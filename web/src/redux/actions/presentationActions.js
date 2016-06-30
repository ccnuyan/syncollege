import actionTypes from '../actionTypes';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import fetchHelper from './fetchHelper';
import immutable from 'immutable';
import myHumane from '../../service/myHumane';
import lodash from 'lodash';
var storage = window.localStorage;
import actionServices from './actionServices';
var getToken = actionServices.getToken;

var PRESENTATION_STATE = immutable.fromJS({
    isBusing: false,
    currentPresentation: immutable.Map({}),
    currentSnapshot: immutable.Map({}),
    presentations: immutable.Map({}),
    recentSnapshots: immutable.Map({}),
    favorateSnapshots: immutable.Map({}),
    createFlag: false,
    errorMessage: '',
});

var presentationReducer = function(state = PRESENTATION_STATE, action) {
    switch (action.type) {
        //set current presentation block
        case actionTypes.SET_CURRENT_BLOCK:
            state = state.setIn(['currentPresentation', 'currentBlock'], immutable.Map(action.data));
            return state;

            //set current presentation block null
        case actionTypes.SET_CURRENT_BLOCK_NULL:
            state = state.setIn(['currentPresentation', 'currentBlock'], immutable.Map({}));
            return state;

        case actionTypes.AFTER_CREATE_NEW_PRESENTATION:
            state = state.set('isBusing', false);
            state = state.setIn(['presentations', action.result._id], immutable.Map(action.result));
            state = state.set('currentPresentation', immutable.Map(action.result));
            return state;
        case actionTypes.ERROR_CREATE_NEW_PRESENTATION:
            state = state.set('isBusing', false);
            state = state.set('errorMessage', '');
            return state;

            //Get List
        case actionTypes.BEFORE_GET_PRESENTATION_LIST:
            state = state.set('presentations', immutable.Map({}));
            state = state.set('currentPresentation', immutable.Map({}));
            state = state.set('isBusing', true);
            return state;
        case actionTypes.AFTER_GET_PRESENTATION_LIST:
            state = state.set('isBusing', false);
            if (action.result.length === 0) {
                state = state.set('createFlag', true);
            } else {
                state = state.set('createFlag', false);
            }
            action.result.forEach(function(presentation) {
                state = state.setIn(['presentations', presentation._id], immutable.Map(presentation));
            });
            return state;
        case actionTypes.ERROR_GET_PRESENTATION_LIST:
            state = state.set('presentations', immutable.Map({}));
            state = state.set('isBusing', false);
            state = state.set('errorMessage', '获取创作时发生了错误');
            return state;

            //Get Presentation
        case actionTypes.BEFORE_GET_PRESENTATION:
            state = state.set('presentations', immutable.Map({}));
            state = state.set('currentPresentation', immutable.Map({}));
            state = state.set('isBusing', true);
            return state;
        case actionTypes.AFTER_GET_PRESENTATION:
            state = state.setIn(['presentations', action.result._id], immutable.Map(action.result));
            state = state.set('currentPresentation', immutable.Map(action.result));

            state = state.set('isBusing', false);
            return state;
        case actionTypes.ERROR_GET_PRESENTATION:
            state = state.set('presentations', immutable.Map({}));
            state = state.set('isBusing', false);
            state = state.set('errorMessage', '获取创作时发生了错误');
            return state;

            //remove presentation
        case actionTypes.BEFORE_REMOVE_PRESENTATION:
            state = state.set('errorMessage', '');
            state = state.set('isBusing', true);
            return state;

        case actionTypes.AFTER_REMOVE_PRESENTATION:
            state = state.deleteIn(['presentations', action.result._id]);
            state = state.set('isBusing', false);
            return state;
        case actionTypes.ERROR_REMOVE_PRESENTATION:
            state = state.set('errorMessage', '');
            state = state.set('isBusing', false);
            return state;

            //rename presentation
        case actionTypes.BEFORE_UPDATE_PRESENTATION:
            state = state.set('errorMessage', '');
            state = state.set('isBusing', true);
            return state;

        case actionTypes.AFTER_UPDATE_PRESENTATION:
            state = state.setIn(['presentations', action.result._id], immutable.Map(action.result));
            state = state.set('currentPresentation', immutable.Map(action.result));
            state = state.set('isBusing', false);
            return state;

        case actionTypes.ERROR_UPDATE_PRESENTATION:
            state = state.set('errorMessage', '');
            state = state.set('isBusing', false);
            return state;


            //remove file
        case actionTypes.BEFORE_REMOVE_FILE:
            state = state.set('errorMessage', '');
            state = state.set('isBusing', true);
            return state;

        case actionTypes.AFTER_REMOVE_FILE:
            state = state.deleteIn(['files', action.result._id]);
            state = state.set('isBusing', false);
            return state;
        case actionTypes.ERROR_REMOVE_FILE:
            state = state.set('errorMessage', '');
            state = state.set('isBusing', false);
            return state;


            //request to play
        case actionTypes.BEFORE_REQUEST_PLAY:
            state = state.set('currentSnapshot', immutable.Map({}));
            state = state.set('isBusing', true);
            return state;
        case actionTypes.AFTER_REQUEST_PLAY:
            state = state.set('currentSnapshot', immutable.Map(action.result));
            state = state.set('isBusing', false);
            return state;
        case actionTypes.ERROR_REQUEST_PLAY:
            state = state.set('isBusing', false);
            state = state.set('errorMessage', '请求播放时时发生了错误');
            return state;


            //go to play
        case actionTypes.BEFORE_GO_PLAY:
            state = state.set('currentSnapshot', immutable.Map({}));
            state = state.set('isBusing', true);
            return state;
        case actionTypes.AFTER_GO_PLAY:
            if (action.result.user.anonymous) {

            }
            action.result.snapshot.owner = action.result.owner;
            state = state.set('currentSnapshot', immutable.Map(action.result.snapshot));
            state = state.set('isBusing', false);
            return state;
        case actionTypes.ERROR_GO_PLAY:
            state = state.set('currentSnapshot', immutable.Map({}));
            state = state.set('isBusing', false);
            return state;


            //Get favorate List
        case actionTypes.BEFORE_GET_SNAPSHOT_LIST:
            state = state.set('favorateSnapshots', immutable.Map({}));
            state = state.set('recentSnapshots', immutable.Map({}));

            state = state.set('isBusing', true);
            return state;
        case actionTypes.AFTER_GET_SNAPSHOT_LIST:
            state = state.set('isBusing', false);
            action.result.favorateSnapshots.forEach(function(snapshot) {
                state = state.setIn(['favorateSnapshots', snapshot._id], immutable.Map(snapshot));
            });
            action.result.recentSnapshots.forEach(function(snapshot) {
                state = state.setIn(['recentSnapshots', snapshot._id], immutable.Map(snapshot));
            });
            return state;
        case actionTypes.ERROR_GET_SNAPSHOT_LIST:
            state = state.set('favorateSnapshots', immutable.Map({}));
            state = state.set('recentSnapshots', immutable.Map({}));
            state = state.set('isBusing', false);
            state = state.set('errorMessage', '获取播放幻灯片时发生了错误');
            return state;


        default:
            return state;
    }
};

function could(state) {
    return state.getIn(['presentations', 'isBusing']);
}

function setCurrentBlock(block) {
    return {
        type: actionTypes.SET_CURRENT_BLOCK,
        data: block
    };
}

function setCurrentBlockNull() {
    return {
        type: actionTypes.SET_CURRENT_BLOCK_NULL
    };
}

//createNewPresentation
function beforeCreateNewPresentation() {
    return {
        type: actionTypes.BEFORE_CREATE_NEW_PRESENTATION
    };
}

function afterCreateNewPresentation(json) {
    return {
        type: actionTypes.AFTER_CREATE_NEW_PRESENTATION,
        result: json
    };
}

function errorCreateNewPresentation(error) {
    return {
        type: actionTypes.ERROR_CREATE_NEW_PRESENTATION,
        error: error
    };
}

function dispatchCreateNewPresentationAsync(query) {
    return (dispatch, getState) => {
        return dispatch(createNewPresentation(query));
    };
}

function createNewPresentation(query) {
    return dispatch => {
        dispatch(beforeCreateNewPresentation());
        return fetch(`${__API_BASE}presentations`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({
                    name: query.name
                })
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterCreateNewPresentation(json)))
            .catch(error => dispatch(errorCreateNewPresentation(error)));
    };
}

//getPresentationList
function beforeGetPresentationList() {
    return {
        type: actionTypes.BEFORE_GET_PRESENTATION_LIST
    };
}

function afterGetPresentationList(json) {
    return {
        type: actionTypes.AFTER_GET_PRESENTATION_LIST,
        result: json
    };
}

function errorGetPresentationList(error) {
    return {
        type: actionTypes.ERROR_GET_PRESENTATION_LIST,
        error: error
    };
}

function dispatchGetPresentationListAsync(query) {
    return (dispatch, getState) => {
        return dispatch(getPresentationList(query));
    };
}

function getPresentationList(query) {
    return dispatch => {
        dispatch(beforeGetPresentationList());
        return fetch(`${__API_BASE}presentations`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterGetPresentationList(json)))
            .catch(error => dispatch(errorGetPresentationList(error)));
    };
}



//getPresentation
function beforeGetPresentation() {
    return {
        type: actionTypes.BEFORE_GET_PRESENTATION
    };
}

function afterGetPresentation(json) {
    return {
        type: actionTypes.AFTER_GET_PRESENTATION,
        result: json
    };
}

function errorGetPresentation(error) {
    return {
        type: actionTypes.ERROR_GET_PRESENTATION,
        error: error
    };
}

function dispatchGetPresentationAsync(query) {
    return (dispatch, getState) => {
        return dispatch(getPresentation(query));
    };
}

function getPresentation(query) {
    return dispatch => {
        dispatch(beforeGetPresentation());
        return fetch(`${__API_BASE}presentations/${query.id}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterGetPresentation(json)))
            .catch(error => dispatch(errorGetPresentation(error)));
    };
}

//removePresentation
function beforeRemovePresentation(query) {
    return {
        type: actionTypes.BEFORE_REMOVE_PRESENTATION,
        query: query,
    };
}

function afterRemovePresentation(json) {
    return {
        type: actionTypes.AFTER_REMOVE_PRESENTATION,
        result: json
    };
}

function errorRemovePresentation(error) {
    return {
        type: actionTypes.ERROR_REMOVE_PRESENTATION,
        error: error
    };
}

function dispatchRemovePresentationAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(removePresentation(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function removePresentation(query) {
    return dispatch => {
        dispatch(beforeRemovePresentation(query));
        return fetch(`${__API_BASE}presentations/${query.id}`, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRemovePresentation(json)))
            .catch(error => dispatch(errorRemovePresentation(error)));
    };
}

//updatePresentation
function beforeUpdatePresentation(query) {
    return {
        type: actionTypes.BEFORE_UPDATE_PRESENTATION,
        query: query,
    };
}

function afterUpdatePresentation(json) {
    return {
        type: actionTypes.AFTER_UPDATE_PRESENTATION,
        result: json
    };
}

function errorUpdatePresentation(error) {
    return {
        type: actionTypes.ERROR_UPDATE_PRESENTATION,
        error: error
    };
}

function dispatchUpdatePresentationAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(updatePresentation(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function updatePresentation(query) {
    return dispatch => {
        dispatch(beforeUpdatePresentation(query));
        return fetch(`${__API_BASE}presentations/${query.id}`, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({
                    content: query.content
                }),
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterUpdatePresentation(json)))
            .catch(error => dispatch(errorUpdatePresentation(error)));
    };
}

//requestPlay
function beforeRequestPlay() {
    return {
        type: actionTypes.BEFORE_REQUEST_PLAY
    };
}

function afterRequestPlay(json) {
    return {
        type: actionTypes.AFTER_REQUEST_PLAY,
        result: json
    };
}

function errorRequestPlay(error) {
    return {
        type: actionTypes.ERROR_REQUEST_PLAY,
        error: error
    };
}

function dispatchRequestPlayAsync(query) {
    return (dispatch, getState) => {
        return dispatch(requestPlay(query));
    };
}

function requestPlay(query) {
    return dispatch => {
        dispatch(beforeRequestPlay());
        return fetch(`${__API_BASE}presentations/request2play/${query.id}`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({
                    allowAnonymous: query.allowAnonymous,
                    interactive: query.interactive,
                }),
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRequestPlay(json)))
            .catch(error => dispatch(errorRequestPlay(error)));
    };
}



//goPlay
function beforeGoPlay() {
    return {
        type: actionTypes.BEFORE_GO_PLAY
    };
}

function afterGoPlay(json) {
    return {
        type: actionTypes.AFTER_GO_PLAY,
        result: json
    };
}

function errorGoPlay(error) {
    return {
        type: actionTypes.ERROR_GO_PLAY,
        error: error
    };
}

function dispatchGoPlayAsync(query) {
    return (dispatch, getState) => {
        return dispatch(goPlay(query));
    };
}

function goPlay(query) {
    return dispatch => {
        dispatch(beforeGoPlay());
        return fetch(`${__API_BASE}snapshots/start2play/${query.id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterGoPlay(json)))
            .catch(error => dispatch(errorGoPlay(error)));
    };
}




//getSnapshotList
function beforeGetSnapshotList() {
    return {
        type: actionTypes.BEFORE_GET_SNAPSHOT_LIST
    };
}

function afterGetSnapshotList(json) {
    return {
        type: actionTypes.AFTER_GET_SNAPSHOT_LIST,
        result: json
    };
}

function errorGetSnapshotList(error) {
    return {
        type: actionTypes.ERROR_GET_SNAPSHOT_LIST,
        error: error
    };
}

function dispatchGetSnapshotListAsync(query) {
    return (dispatch, getState) => {
        return dispatch(getSnapshotList(query));
    };
}

function getSnapshotList(query) {
    return dispatch => {
        dispatch(beforeGetSnapshotList());
        return fetch(`${__API_BASE}snapshots`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterGetSnapshotList(json)))
            .catch(error => dispatch(errorGetSnapshotList(error)));
    };
}


export default {
    presentationReducer,
    setCurrentBlock,
    setCurrentBlockNull,
    dispatchGetPresentationListAsync,
    dispatchCreateNewPresentationAsync,
    dispatchGetPresentationAsync,
    dispatchUpdatePresentationAsync,
    dispatchRemovePresentationAsync,

    dispatchGetSnapshotListAsync,

    dispatchRequestPlayAsync,
    dispatchGoPlayAsync,
};
