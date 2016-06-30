import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';


class ParentDirectory extends React.Component {
  constructor() {
    super();
    this.onGoUpward = this.onGoUpward.bind(this);
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

    return <div onClick={this.onGoUpward} className={cn(css.itemEach)}>
      <div className={css.parentDirectory}>
        <div ref="plus" className={cn('icon-arrow-up-left', ' dead-center', 'font-largest')}></div>
      </div>
    </div>;
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(ParentDirectory));
