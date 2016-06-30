import actionTypes from '../actionTypes';
import fetch from 'isomorphic-fetch';
import fetchHelper from './fetchHelper';
import immutable from 'immutable';
import myHumane from '../../service/myHumane';
var storage = window.localStorage;
import actionServices from './actionServices';
var getToken = actionServices.getToken;

/////用户的客户端状态/////
// 初始状态
// USER_STATE = {
//     isLoading: true,
//     payload: immutable.Map({}),
//     errorMessage:''
// }

// 1 匿名登录成功
// USER_STATE = {
//     isLoading: false,
//     payload: immutable.Map(anonymouse_payload)
//     errorMessage: ''
// }

// 2 初始化登录成功
// USER_STATE = {
//     isLoading: false,
//     payload: immutable.Map(user_payload),
//     errorMessage: ‘’
// }

// 3 登录失败
// USER_STATE = {
//     isLoading: false,
//     payload: immutable.Map({}),
//     errorMessage: ’error’
// }
/////用户的客户端状态/////

var USER_STATE = immutable.fromJS({
    isLoading: true,
    payload: immutable.Map({}),
    errorMessage:''
});

var userReducer = function(state = USER_STATE, action) {
    switch (action.type) {
        //no token found
        case actionTypes.NO_TOKEN_FOUND:
            state = state.set('isLoading', false);
            return state;
        //initialize
        case actionTypes.BEFORE_INITIALIZE:
            state = state.set('isLoading', true);
            state = state.set('payload', immutable.Map({}));
            return state;
        case actionTypes.AFTER_INITIALIZE:
            state = state.set('payload', immutable.Map(action.result.payload));
            state = state.set('isLoading', false);
            myHumane.info('欢迎回来，' + action.result.payload.nickname);
            return state;
        case actionTypes.ERROR_INITIALIZE:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', false);
            storage.clear('userToken');
            return state;

        //register
        case actionTypes.BEFORE_REGISTER:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', true);
            storage.clear('userToken');
            return state;
        case actionTypes.AFTER_REGISTER:
            state = state.set('payload', immutable.Map(action.result.payload));
            state = state.set('isLoading', false);
            storage.setItem('userToken', action.result.accessToken);
            myHumane.success('您已成功注册并登录，' + action.result.payload.nickname);
            return state;
        case actionTypes.ERROR_REGISTER:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', false);
            storage.clear('userToken');
            myHumane.error(action.error.message);
            return state;

        //login
        case actionTypes.BEFORE_LOGIN:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', true);
            storage.clear('userToken');
            return state;
        case actionTypes.AFTER_LOGIN:
            state = state.set('payload', immutable.Map(action.result.payload));
            state = state.set('isLoading', false);
            storage.setItem('userToken', action.result.accessToken);
            myHumane.success('您已成功登录，' + action.result.payload.nickname);
            return state;
        case actionTypes.ERROR_LOGIN:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', false);
            storage.clear('userToken');
            myHumane.error(action.error.message);
            return state;


        //anonymous login
        case actionTypes.BEFORE_ANONYMOUS_LOGIN:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', true);
            storage.clear('userToken');
            return state;
        case actionTypes.AFTER_ANONYMOUS_LOGIN:
            state = state.set('payload', immutable.Map(action.result.payload));
            state = state.set('isLoading', false);
            storage.setItem('userToken', action.result.accessToken);
            myHumane.success('匿名登录成功，' + action.result.payload.nickname);
            return state;
        case actionTypes.ERROR_ANONYMOUS_LOGIN:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', false);
            storage.clear('userToken');
            myHumane.error(action.error.message);
            return state;


        //logout
        case actionTypes.LOGOUT:
            state = state.set('payload', immutable.Map({}));
            state = state.set('isLoading', false);
            storage.clear('userToken');
            myHumane.success('您已成功注销');
            return state;

        //ModifyPwd
        case actionTypes.BEFORE_MODIFY_PASSWORD:
            state = state.set('isLoading', true);
            return state;
        case actionTypes.AFTER_MODIFY_PASSWORD:
            state = state.set('isLoading', false);
            myHumane.success('密码修改成功');
            return state;
        case actionTypes.ERROR_MODIFY_PASSWORD:
            state = state.set('isLoading', false);
            myHumane.error(action.error.message);
            return state;

        default:
            return state;
    }
};

//noTokenFound
function noTokenFound(){
    return {
        type: actionTypes.NO_TOKEN_FOUND
    };
}

//initialize
function beforeIntialize() {
    return {
        type: actionTypes.BEFORE_INITIALIZE
    };
}

function afterIntialize(json) {
    return {
        type: actionTypes.AFTER_INITIALIZE,
        result: {
            payload: json
        }
    };
}

function errorIntialize(error) {
    return {
        type: actionTypes.ERROR_INITIALIZE,
        error: error
    };
}

function dispatchIntializeAsync() {
    return (dispatch, getState) => {
        return dispatch(initialize());
    };
}

function initialize() {
    return dispatch => {
        dispatch(beforeIntialize());
        var token = window.localStorage.getItem('userToken');
        return fetch(__API_BASE + `user/info`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterIntialize(json)))
            .catch(error => dispatch(errorIntialize(error)));
    };
}

//register
function beforeRegister() {
    return {
        type: actionTypes.BEFORE_REGISTER
    };
}

function afterRegister(json) {
    return {
        type: actionTypes.AFTER_REGISTER,
        result: json
    };
}

function errorRegister(error) {
    return {
        type: actionTypes.ERROR_REGISTER,
        error: error
    };
}

function dispatchRegisterAsync(registerInfo) {
    return (dispatch, getState) => {
        return dispatch(register(registerInfo));
    };
}

function register(registerInfo) {
    return dispatch => {
        dispatch(beforeRegister(registerInfo));
        return fetch(__API_BASE + `user/register/${registerInfo.bid}`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerInfo)
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRegister(json)))
            .catch(error => dispatch(errorRegister(error)));
    };
}

//login
function beforeLogin() {
    return {
        type: actionTypes.BEFORE_LOGIN
    };
}

function afterLogin(json) {
    return {
        type: actionTypes.AFTER_LOGIN,
        result: json
    };
}

function errorLogin(error) {
    return {
        type: actionTypes.ERROR_LOGIN,
        error: error
    };
}

function dispatchLoginAsync(loginInfo) {
    return (dispatch, getState) => {
        return dispatch(login(loginInfo));
    };
}

function login(loginInfo) {
    if (loginInfo.mode === 'transaction') {
        return dispatch => {
            dispatch(beforeLogin(loginInfo));
            return fetch(__API_BASE + `user/login/${loginInfo.lid}`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginInfo)
                })
                .then(fetchHelper.checkStatus)
                .then(fetchHelper.parseJSON)
                .then(json => dispatch(afterLogin(json)))
                .catch(error => dispatch(errorLogin(error)));
        };
    } else {
        return dispatch => {
            dispatch(beforeLogin(loginInfo));
            return fetch(__API_BASE + `user/login`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginInfo)
                })
                .then(fetchHelper.checkStatus)
                .then(fetchHelper.parseJSON)
                .then(json => dispatch(afterLogin(json)))
                .catch(error => dispatch(errorLogin(error)));
        };
    }
}

//logout
function logout() {
    return {
        type: actionTypes.LOGOUT
    };
}

//modify password
function beforeModifyPassword() {
    return {
        type: actionTypes.BEFORE_MODIFY_PASSWORD
    };
}

function afterModifyPassword(json) {
    return {
        type: actionTypes.AFTER_MODIFY_PASSWORD,
        result: json
    };
}

function errorModifyPassword(error) {
    return {
        type: actionTypes.ERROR_MODIFY_PASSWORD,
        error: error
    };
}

function dispatchModifyPasswordAsync(newPasswordInfo) {
    return (dispatch, getState) => {
        return dispatch(modifyPassword(newPasswordInfo));
    };
}

function modifyPassword(newPasswordInfo) {
    return dispatch => {
        dispatch(beforeModifyPassword(newPasswordInfo));
        var token = window.localStorage.getItem('userToken');
        return fetch(__API_BASE + `user/modifypwd`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(newPasswordInfo)
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(function(json) {
                if (json.status === 'failure') {
                    reject(json);
                }
            })
            .then(json => dispatch(afterModifyPassword(json)))
            .catch(error => dispatch(errorModifyPassword(error)));
    };
}



//anonymous login
function beforeAnonymousLogin() {
    return {
        type: actionTypes.BEFORE_ANONYMOUS_LOGIN
    };
}

function afterAnonymousLogin(json) {
    return {
        type: actionTypes.AFTER_ANONYMOUS_LOGIN,
        result: json
    };
}

function errorAnonymousLogin(error) {
    return {
        type: actionTypes.ERROR_ANONYMOUS_LOGIN,
        error: error
    };
}

function dispatchAnonymousLoginAsync() {
    return (dispatch, getState) => {
        return dispatch(anonymousLogin());
    };
}

function anonymousLogin() {
    return dispatch => {
        dispatch(beforeAnonymousLogin());
        return fetch(__API_BASE + `user/anonymous-login`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterAnonymousLogin(json)))
            .catch(error => dispatch(errorAnonymousLogin(error)));
    };
}

export default {
    userReducer: userReducer,
    noTokenFound:noTokenFound,
    dispatchIntializeAsync: dispatchIntializeAsync,
    dispatchRegisterAsync: dispatchRegisterAsync,
    dispatchLoginAsync: dispatchLoginAsync,
    dispatchAnonymousLoginAsync:dispatchAnonymousLoginAsync,
    dispatchModifyPasswordAsync: dispatchModifyPasswordAsync,
    logout: logout
};
