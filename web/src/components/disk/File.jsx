import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import mapping from './iconMapping';

class File extends React.Component {
    constructor() {
        super();

        this.onRemove = this.onRemove.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onDownload = this.onDownload.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onTakeAction = this.onTakeAction.bind(this);
    }

    componentDidMount() {
        this.refs['file'].addEventListener('mouseenter', function(event) {
            if (this.refs['overlay'].dataset.image === 'true') {
                this.refs['overlay'].style.opacity = 1;
            }
        }.bind(this));
        this.refs['file'].addEventListener('mouseleave', function(event) {
            if (this.refs['overlay'].dataset.image === 'true') {
                this.refs['overlay'].style.opacity = 0;
            }
        }.bind(this));

        this.refs['newNameInput'].addEventListener('keypress', function(e) {
            event.stopPropagation();
            if ((e.keyCode || e.which) == 13) {
                this.onConfirm();
            }
        }.bind(this));

        this.refs['newNameInput'].addEventListener('blur', function(e) {
            _Y_.show(this.refs['body']);
            _Y_.hide(this.refs['form']);
            this.refs['newNameInput'].value = '';
        }.bind(this));
    }

    onEdit(event) {
        event.stopPropagation();
        _Y_.hide(this.refs['body']);
        _Y_.show(this.refs['form']);
        this.refs['newNameInput'].focus();
    }
    onConfirm() {
        diskActions.dispatchRenameFileAsync({
            id: this.props.file._id,
            parentId: this.props.file.parent,
            body: {
                name: this.refs['newNameInput'].value
            }
        })(this.props.dispatch, function() {
            return this.props.disk;
        }.bind(this));
        this.refs['newNameInput'].blur();
    }

    onRemove(event) {
        event.stopPropagation();

        diskActions.dispatchRemoveFileAsync({id: this.props.file._id, parentId: this.props.file.parent})(this.props.dispatch, function() {
            return this.props.disk;
        }.bind(this));
    }

    onMove(event) {
        event.stopPropagation();
        this.props.dispatch(diskActions.switchToMoveMode({id: this.props.file._id}));
    }

    onDownload() {
        event.stopPropagation();
        diskActions.dispatchRequestDownloadAsync({id: this.props.file._id, parentId: this.props.file.parent})(this.props.dispatch, function() {
            return this.props.disk;
        }.bind(this));
    }

    onTakeAction() {
        if (this.context.setImage) {
            this.context.setImage(`${__QINIU_URL}/${this.props.file.fileObject._id}`);
        } else {}
    }

    render() {
        var css = this.props.css;
        var editStatus = this.props.disk.get('editStatus');
        var opacity = (editStatus && this.props.file.isEditing)
            ? 1
            : 0;
        var display = (editStatus && this.props.file.isEditing)
            ? 'none'
            : 'block';

        var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);
        var isThisMoving = isMoving
            ? this.props.disk.getIn(['fileToBeMoved', '_id']) === this.props.file._id
            : false;

        var file = this.props.file;

        var isImage = file.created && file.fileObject.mime.startsWith('image');

        return <div ref="file" style={{
            zIndex: isThisMoving
                ? 10
                : 0
        }} className={cn(css.itemEach)} onClick={this.onTakeAction}>
            <div className={cn(css.file)}>
                <div className={cn(css.body)} ref="body">
                    {file.created && file.fileObject.mime.startsWith('image')
                        ? <img className={cn(css.fileImage, 'dead-center')} src={`${__QINIU_URL}/${file.fileObject._id}`}/>
                        : ''}
                    <div ref="overlay" className={cn(css.overlay)} data-image={isImage}>
                        <div className={cn(css.subItemsTag)}>
                            <div>{`${_Y_.humanFileSize(file.fileObject.size)}`}</div>
                        </div>
                        <div className={cn(css.itemLogo)}>
                            <i className={mapping[file.name.split('.').pop()]}></i>
                        </div>
                        <div className={cn(css.itemName)}>
                            {file.name}
                        </div>
                    </div>
                </div>
                <div ref="form" className={css.newDirectoryForm} style={{
                    display: 'none'
                }}>
                    <textarea ref="newNameInput" placeholder="请输入文件名称
              按回车确定" className={cn(css.newDirectoryTextArea)} type="text"></textarea>
                </div>
                {editStatus
                    ? <div className={css.itemOptions}>
                            <button onClick={this.onEdit} className={cn('button-warning', 'icon-pencil2')}></button>
                            <button onClick={this.onRemove} className={cn('button-error', 'icon-cross')}></button>
                        </div>
                    : ''}
            </div>
        </div>;
    }
}

var selector = function(state) {
    return {user: state.user, disk: state.disk};
};

File.contextTypes = {
    setImage: PropTypes.func
};


export default connect(selector)(styleable(style)(File));
