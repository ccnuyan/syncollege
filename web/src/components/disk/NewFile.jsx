import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import qiniu from '../../redux/actions/qiniu.util.js';

class NewFile extends React.Component {
  constructor() {
    super();
    this.onNewClick = this.onNewClick.bind(this);
  }

  componentDidMount() {
    qiniu(this.refs['uploader'], this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }

  onNewClick(event) {
    event.stopPropagation();
    this.refs['uploader'].click();
  }

  render() {
    var css = this.props.css;

    return <div onClick={this.onNewClick} className={cn(css.itemEach)}>
      <div className={css.newDirectory}>
        <div className="dead-center">
          <span style={{
            verticalAlign: top
          }} ref="plus" className={cn('icon-plus')}></span>
          <span style={{
            fontSize: '2em',
            margin: '3px'
          }} ref="plus" className={cn('icon-file-o')}></span>
        </div>
        <div ref="form" className={css.newFileForm} style={{
          display: 'none'
        }}>
          <div>
            <input name="uploader" accept="image/*" ref="uploader" type="file" onChange={this.onUpload}/>
          </div>
        </div>
      </div>
    </div>;
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(NewFile));
