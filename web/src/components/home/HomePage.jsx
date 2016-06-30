import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import homeSlide from './homeSlide.html';
import style from './HomePage.scss';
import styleable from 'react-styleable';
import {connect} from 'react-redux';
import cn from 'classnames';
import revealConf from '../../service/revealConf.js';
import _ from 'lodash';
import qq from './qq.png';

class HomePage extends React.Component {
    super() {
        this.onNavigate = this.onNavigate.bind(this);
    }
    componentDidMount() {
        var el = document.getElementById('reveal');
        _Y_.setHTML(el, homeSlide);

        Reveal.initialize(revealConf.adConf);
        el.style.display = '';
    }

    onNavigate(event) {
        _Y_.navigateTo(event.currentTarget.dataset.target, true);
    }

    render() {
        var user = this.props.user.get('payload').toObject();
        var css = this.props.css;
        return (
            <div className={css.home}>
                <div id="reveal" ref="reveal" style={{
                    zIndex: 100
                }} className={cn(css.reveal, 'reveal')}></div>

                <div className={cn(css.homeBackground, 'background-block')} style={{
                    backgroundImage: 'url(/background.jpg)',
                    zIndex: 1
                }}>
                    <div className="overlay"></div>
                </div>
                {/*on top of header footer and mainpage*/}
                <div className={css.area} style={{
                    zIndex: 120
                }}>
                    {(_.isEmpty(user) || user.anonymous)
                        ? <div onClick={this.onNavigate} data-target="/oauth/qq/luanch">
                                <img style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle'
                                }} width="24" height="24" src={qq}/>
                                <div style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    padding: '5px'
                                }}>登录</div>
                            </div>
                        : <div style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            padding: '10px'
                        }} onClick={this.onNavigate} data-target="/main/mine">Just Do It</div>
}
                </div>
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user, presentation: state.presentation};
};

HomePage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    loginStateCheck: React.PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(HomePage));
