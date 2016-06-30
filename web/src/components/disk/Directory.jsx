import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';

class Directory extends React.Component {
  constructor() {
    super();
    this.onTakeAction = this.onTakeAction.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentDidMount() {
    this.refs['newDirectoryInput'].addEventListener('keypress', function(e) {
      event.stopPropagation();
      if ((e.keyCode || e.which) == 13) {
        this.onConfirm();
      }
    }.bind(this));

    this.refs['newDirectoryInput'].addEventListener('blur', function(e) {
      _Y_.show(this.refs['body']);
      _Y_.hide(this.refs['form']);
      this.refs['newDirectoryInput'].value = '';
    }.bind(this));
  }

  onEdit(event) {
    event.stopPropagation();
    _Y_.hide(this.refs['body']);
    _Y_.show(this.refs['form']);
    this.refs['newDirectoryInput'].focus();
  }
  onConfirm() {
    diskActions.dispatchRenameDirectoryAsync({
      id: this.props.directory._id,
      parentId: this.props.directory.parent,
      body: {
        name: this.refs['newDirectoryInput'].value
      }
    })(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
    this.refs['newDirectoryInput'].blur();
  }

  onRemove(event) {
    event.stopPropagation();
    diskActions.dispatchRemoveDirectoryAsync({id: this.props.directory._id, parentId: this.props.directory.parent})(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }


  onTakeAction() {
    event.stopPropagation();
    var fileId = this.props.disk.getIn(['fileToBeMoved', '_id']);
    var currentDirectoryId = this.props.disk.getIn(['currentDirectory', '_id']);
    var isMoving = !!fileId;
    if (isMoving) {
      diskActions.dispatchMoveFileAsync({fileId: fileId, targetDirectoryId: this.props.directory._id, sourceDirectoryId: currentDirectoryId})(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    } else {
      diskActions.dispatchDiveIntoDirectoryAsync({id: this.props.directory._id, parentId: this.props.directory.parent})(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    }
  }
  render() {
    var css = this.props.css;
    var editStatus = this.props.disk.get('editStatus');
    var subitemsCount = this.props.directory.subDirectories.length + this.props.directory.subFiles.length;
    var opacity = (editStatus && this.props.directory.isEditing)
      ? 1
      : 0;
    var display = (editStatus && this.props.directory.isEditing)
      ? 'none'
      : 'inline-block';
    var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);

    return <div style={{
      zIndex: isMoving
        ? 10
        : 0
    }} className={cn(css.itemEach)}>
      <div className={cn(css.directory)}>
        <div className={cn(css.body)} ref="body" onClick={this.onTakeAction}>
          <div className={cn(css.subItemsTag)}>
            <div>{`[${subitemsCount}]`}</div>
          </div>
          <div className={css.itemLogo}>
            <i className="icon-folder"></i>
          </div>
          <div className={css.itemName}>
            {this.props.directory.name}
          </div>
        </div>
        <div ref="form" className={css.newDirectoryForm} style={{
          display: 'none'
        }}>
          <textarea ref="newDirectoryInput" placeholder="请输入目录名称
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

export default connect(selector)(styleable(style)(Directory));
