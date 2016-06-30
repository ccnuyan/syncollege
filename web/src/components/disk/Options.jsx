import React, {PropTypes} from 'react';
import style from './Options.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';

class File extends React.Component {
  constructor() {
    super();
    this.onShowNewDirectory = this.onShowNewDirectory.bind(this);
    this.onGoUpward = this.onGoUpward.bind(this);
    this.onUpload = this.onUpload.bind(this);
  }

  onShowNewDirectory() {
    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    if (currentDirectory && currentDirectory._id) {
      this.props.dispatch(diskActions.onShowNewDirectory());
    }
  }

  onSwitchEditStatus() {
    this.props.dispatch(diskActions.switchEditStatus());
  }

  onUpload() {
    event.stopPropagation();

    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    diskActions.dispatchRequestUploadAsync({id: currentDirectory._id, file: this.refs['uploader'].files[0]})(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }

  onGoUpward() {
    event.stopPropagation();

    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    if (currentDirectory && currentDirectory.depth > 1 && currentDirectory.parent) {
      var grandParent = this.props.disk.getIn(['directories', currentDirectory.parent, 'parent']);
      diskActions.dispatchDiveIntoDirectoryAsync({id: currentDirectory.parent, parentId: grandParent})(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    } else if (currentDirectory && currentDirectory.depth === 1 && currentDirectory.parent) {
      diskActions.dispatchGetRootAsync()(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    } else {}
  }

  render() {
    var css = this.props.css;
    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    var editStatus = this.props.disk.get('editStatus');
    return (
      <div className={cn(css.options)}>
        {currentDirectory.depth > 0
          ? (
            <div className={cn('float-left')} style={{marginRight:'10px'}}>
              <button onClick={this.onGoUpward} className={cn('icon-arrow-up-left button')}>返回</button>
            </div>
          )
          : ''}
        {currentDirectory.depth < 2
          ? <div className={cn('float-left')}>
              <button onClick={this.onShowNewDirectory} className={cn('icon-plus button-primary')}>目录</button>
            </div>
          : ''}
        {currentDirectory._id
          ? <div className={cn('float-right')}>

              <button name="uploader" type="file" className={cn('button-primary', css.uploader)}>
                <input name="uploader" ref="uploader" type="file" onChange={this.onUpload}/>
                <div>+文件</div>
              </button>
            </div>
          : ''}
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(File));
