var qiniu = require('qiniu');
var uuid = require('uuid');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = process.env.QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = process.env.QINIU_SECRET_KEY;

//要上传的空间
bucket = process.env.QINIU_BUCKET;

//上传到七牛后保存的文件名
key = uuid.v4();

//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key);
  putPolicy.callbackUrl = 'http://www.syncollege.com:7777/qiniu/callback';
  putPolicy.callbackBody = 'key=$(key)&filesize=$(fsize)&mime=$(mimeType)&etag=$(etag)';
  return putPolicy.token();
}

//生成上传 Token
token = uptoken(bucket, key);
console.log(token);
//要上传文件的本地路径
filePath = './qiniu_test.png';

//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
    if (!err) {
      // 上传成功， 处理返回值
      console.log(ret);
    } else {
      // 上传失败， 处理返回代码
      console.log(err);
    }
  });
}

//调用uploadFile上传
uploadFile(token, key, filePath);
