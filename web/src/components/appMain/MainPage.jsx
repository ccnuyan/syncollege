import React, {PropTypes} from 'react';
import style from './MainPage.scss';
import styleable from 'react-styleable';
import cn from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class MainPage extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        window.root.style.background = '#eee';
    }

    render() {
        var css = this.props.css;
        var presentations = this.props.presentation.get('presentations').toObject();
        var createFlag = this.props.presentation.get('createFlag');
        return (
            <div ref="module" style={{textAlign:'center'}} className={cn('container-mid', css.module)}>
                <h2 className={cn('heading-secondary','center')}>
                    <Link to='/main/mine' className={cn(css.linkTitle)}>
                        创作
                    </Link>|
                    <Link to='/main/disk' className={cn(css.linkTitle)}>
                        素材
                    </Link>|
                    <Link to='/main/favorate' className={cn(css.linkTitle)}>
                        收藏
                    </Link>|
                    <Link to='/main/recent' className={cn(css.linkTitle)}>
                        最近
                    </Link>
                </h2>
                {this.props.children}
            </div>
        );
    }
}

var selector = function(state) {
    return {user: state.user, presentation: state.presentation};
};

MainPage.contextTypes = {
    router: React.PropTypes.object.isRequired,
    loginStateCheck: React.PropTypes.func.isRequired
};

export default connect(selector)(styleable(style)(MainPage));
