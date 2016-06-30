import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import File from './File';
import NewFile from './NewFile';
import UploadingFile from './UploadingFile';

class FileList extends React.Component {
  render() {
    var css = this.props.css;

    var createFileRow = function(file) {
      file = file.toObject();
      return <File key={file._id} file={file}></File>;
    }.bind(this);

    var createUploadingFileRow = function(file) {
      file = file.toObject();
      return <UploadingFile key={file.id} file={file}></UploadingFile>;
    };

    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    var loading = this.props.disk.get('loading');
    var files = this.props.disk.get('files').filter(function(file) {
      return file.get('parent') === currentDirectory._id;
    }).toList();

    var uploadingFiles = this.props.disk.get('uploadingFiles').filter(function(file) {
      return file.get('parent') === currentDirectory._id;
    }).toList();
    return (
      <div className={cn(css.itemList, 'grid-parent')}>
        {files.map(createFileRow)}
        {uploadingFiles.map(createUploadingFileRow)}
        <NewFile></NewFile>
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(FileList));
