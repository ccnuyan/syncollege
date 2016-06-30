import React, {PropTypes} from 'react';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';
import {createHistory, useBasename} from 'history';
import {Provider} from 'react-redux';
import store from '../redux/store';
import Initializer from './Initializer';

require('react-tap-event-plugin')();
require('es6-promise').polyfill();

class StoreProvider extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <Provider store={store}>
                <Initializer>
                    {this.props.children}
                </Initializer>
            </Provider>
        );
    }
}
var selector = function(state) {
    return {user: state.user};
};
export default StoreProvider;
