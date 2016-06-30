import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import Directory from './Directory';
import NewDirectory from './NewDirectory';
import ParentDirectory from './ParentDirectory';


class DirectoryList extends React.Component {
  render() {
    var css = this.props.css;
    var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);

    var createDirectoryRow = function(directory) {
      directory = directory.toObject();
      return <Directory key={directory._id} directory={directory}></Directory>;
    };
    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    var loading = this.props.disk.get('loading');
    var directories = isMoving
      ? this.props.disk.get('directories').filter(function(directory) {
        return directory.get('_id') !== currentDirectory._id;
      }).toList()
      : this.props.disk.get('directories').filter(function(directory) {
        return directory.get('parent') === currentDirectory._id;
      }).toList();

    return (
      <div className={cn(css.itemList, 'grid-parent')}>
        {currentDirectory.depth > 0
          ? <ParentDirectory></ParentDirectory>
          : ''}
        {directories.map(createDirectoryRow)}
        <NewDirectory></NewDirectory>
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(DirectoryList));
