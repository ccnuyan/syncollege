import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';

class NewDirectory extends React.Component {
  constructor() {
    super();
    this.onCreateNewDirectory = this.onCreateNewDirectory.bind(this);
    this.onNewClick = this.onNewClick.bind(this);
  }

  componentDidMount() {
    this.refs['newDirectoryInput'].addEventListener('keypress', function(e) {
      event.stopPropagation();
      if ((e.keyCode || e.which) == 13) {
        this.onCreateNewDirectory();
      }
    }.bind(this));

    this.refs['newDirectoryInput'].addEventListener('blur', function(e) {
      _Y_.show(this.refs['plus']);
      _Y_.hide(this.refs['form']);
      this.refs['newDirectoryInput'].value = '';
    }.bind(this));
  }

  onCreateNewDirectory() {
    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    if (currentDirectory && currentDirectory._id) {
      var query = {
        parentId: currentDirectory._id,
        body: {
          name: this.refs['newDirectoryInput'].value
        }
      };
      diskActions.dispatchCreateNewDirectoryAsync(query)(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    }
    this.refs['newDirectoryInput'].blur();
  }

  onNewClick(event) {
    event.stopPropagation();
    _Y_.hide(this.refs['plus']);
    _Y_.show(this.refs['form']);
    this.refs['newDirectoryInput'].focus();
  }

  render() {
    var css = this.props.css;

    return <div onClick={this.onNewClick} className={cn(css.itemEach)}>
      <div className={css.newDirectory}>
        <div className="dead-center">
          <span style={{
            verticalAlign: top,
            margin:'3px'
          }} ref="plus" className={cn('icon-plus')}></span>
          <span style={{
            fontSize: '2em'
          }} ref="plus" className={cn('icon-folder')}></span>
        </div>
        <div ref="form" className={css.newDirectoryForm} style={{
          display: 'none'
        }}>
          <textarea ref="newDirectoryInput" placeholder="请输入目录名称
              按回车确定" className={cn(css.newDirectoryTextArea)} type="text"></textarea>
        </div>
      </div>
    </div>;
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(NewDirectory));
