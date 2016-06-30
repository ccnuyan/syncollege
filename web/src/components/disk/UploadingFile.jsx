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
  }

  render() {
    var css = this.props.css;
    var file = this.props.file;

    return <div className={cn(css.itemEach)}>
      <div className={css.uploadingFile}>
        <div className={css.uploadingProgress} style={{
          height: `${file.percent}%`
        }}></div>
        <div className={cn(css.subItemsTag)}>
          <div>{`[${_Y_.humanFileSize(file.size)}]`}</div>
        </div>
        <div className={css.itemLogo}>
          <i className="icon-file-o"></i>
        </div>
        <div className={css.itemName}>
          {file.name}
        </div>
        <div className={css.uploadingTag}>
          正在上传...
        </div>
      </div>
    </div>;
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(File));
