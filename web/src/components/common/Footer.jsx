import React, {PropTypes} from 'react';
import styleable from 'react-styleable';
import style from './Footer.scss';

class Footer extends React.Component {
  render () {
    var css  = this.props.css;
    return (
      <footer className={css.footer}>
        <div className={'container-full'}>
          <div className={'grid-parent'}>
            <div>
              <div>国家数字化学习技术工程研究中心</div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default styleable(style)(Footer);
