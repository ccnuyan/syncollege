import uploadActions from '../../redux/actions/uploadActions';
import fetch from 'isomorphic-fetch';
import fetchHelper from './fetchHelper';
import humane from '../../service/myHumane';

var getToken = function() {
    return window.localStorage.getItem('userToken');
};

var requestToken = function(dirid, filename) {
    var request = new XMLHttpRequest();

    request.open('POST', `${__API_BASE}/disk/request/upload/dir/${dirid}/subfile/`, false); // `false` makes the request synchronous
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + getToken());
    request.setRequestHeader('Content-Type', 'application/json');

    request.send(JSON.stringify({
        filename: filename
    }));

    return request;
};

var requestCreate = function(dirid, qiniu_ret) {
    var request = new XMLHttpRequest();

    request.open('POST', `${__API_BASE}/qiniu-disk/dir/${dirid}/subfile/`, false); // `false` makes the request synchronous
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + getToken());
    request.setRequestHeader('Content-Type', 'application/json');

    request.send(JSON.stringify(qiniu_ret));

    return request;
};

var options = {
    runtimes: 'html5,flash,html4', // 上传模式,依次退化
    get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的 uptoken
    domain: __CONTAINER, // bucket 域名，下载资源时用到，**必需**
    max_file_size: '4mb', // 最大文件体积限制
    max_retries: 1, // 上传失败最大重试次数
    chunk_size: '4mb', // 分块上传时，每块的体积
    auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
    filters: {
        mime_types: [{
            title: 'Image files',
            extensions: 'jpg,gif,png'
        }, {
            title: 'Zip files',
            extensions: 'zip'
        }],
        prevent_duplicates: true
    }
};
var __getStore;
var __diskpatcher;
var initialize = function(element, dispatcher, getStore) {
    __getStore = getStore;
    __diskpatcher = dispatcher;

    options.browse_button = element;

    options.uptoken_func = function(file) {
        var token;
        var error;
        var currentDirectory = __getStore().get('currentDirectory').toObject();

        var request = requestToken(currentDirectory._id, file.name);

        if (request.status === 201) {
            var obj = JSON.parse(request.responseText);
            file.key = obj.key;
            return obj.token;
        }
    };

    options.init = {
        'FilesAdded': function(up, files) {
            var currentDirectory = __getStore().get('currentDirectory').toObject();
            plupload.each(files, function(file) {
                file.parent = currentDirectory._id;
                __diskpatcher(uploadActions.queue(file));
            });
        },
        'BeforeUpload': function(up, file) {
            //2;
            // 每个文件上传前,处理相关的事情
        },
        'UploadProgress': function(up, file) {
            //3;
            // 每个文件上传时,处理相关的事情
            __diskpatcher(uploadActions.progress(file));
        },
        'FileUploaded': function(up, file, info) {
            if (__DEV) {
                var qiniu_ret = JSON.parse(info);
                var request = requestCreate(file.parent, qiniu_ret);
                if (request.status === 201) {
                    var ret = JSON.parse(request.responseText);
                    ret.uploadId = file.id;
                    __diskpatcher(uploadActions.uploaded(ret));
                }
            } else {
                var ret = JSON.parse(info);
                ret.uploadId = file.id;
                __diskpatcher(uploadActions.uploaded(ret));
            }
        },
        'Error': function(up, err, errTip) {
            console.log(err.code);
            switch (err.code) {
                case -601:
                    humane.error('只允许上传jpg、png、gif图片及zip压缩包');
                    break;
                case -601:
                    humane.error('文件大小限制为4mb');
                    break;
                default:
            }
        },
        'UploadComplete': function() {
            humane.success('所有文件上传完毕');
        },
        'Key': function(up, file) {
            var key = file.key;
            return key;
        }
    };

    Qiniu.uploader(options);
};

module.exports = initialize;
