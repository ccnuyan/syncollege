import React, {PropTypes} from 'react';
import style from './Player.scss';
import styleable from 'react-styleable';
import fetchHelper from '../../redux/actions/fetchHelper';
import cn from 'classnames';
import presentationActions from '../../redux/actions/presentationActions';
import userActions from '../../redux/actions/userActions';

import revealConf from '../../service/revealConf.js';
import {connect} from 'react-redux';
import _ from 'lodash';
import keymap from 'browser-keymap';

class Player extends React.Component {
    componentDidMount() {
        var presentationId = _Y_.searchToObject(window.location.search).id;

        var token = window.localStorage.getItem('userToken');
        if (token) {
            presentationActions.dispatchGoPlayAsync({id: presentationId, asOwner: false})(this.props.dispatch, function() {
                return this.props.presentation;
            }.bind(this));
        } else {
            userActions.dispatchAnonymousLoginAsync()(this.props.dispatch, function() {
                return this.props.user;
            }.bind(this));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        var current = nextProps.presentation.get('currentSnapshot').toObject();
        return !_.isEmpty(current);
    }

    componentDidUpdate(prevProps, prevState) {
        var current = this.props.presentation.get('currentSnapshot').toObject();
        var user = this.props.user.get('payload').toObject();

        head.load(__ASSETS + current.theme + '.css');
        _Y_.setHTML(this.refs['reveal'], current.content);

        Reveal.initialize(revealConf.playConf);

        Velocity(this.refs['reveal'], {
            opacity: [1, 0]
        }, {
            duration: 500,
            delay: 200
        });
        window.snapshot = current;
        window.user = user;

        var evt = new CustomEvent('snapshotLoaded', {snapshot: current});
        window.root.dispatchEvent(evt);
    }

    render() {
        var css = this.props.css;
        return <div className={css.container}>
            <div id="reveal" ref="reveal" className="reveal" style={{
                opacity: 0
            }}></div>
        </div>;
    }
}

var selector = function(state) {
    return {presentation: state.presentation, user: state.user};
};
export default connect(selector)(styleable(style)(Player));
