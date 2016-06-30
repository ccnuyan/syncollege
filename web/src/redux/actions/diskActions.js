import actionTypes from '../actionTypes';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import fetchHelper from './fetchHelper';
import immutable from 'immutable';
import myHumane from '../../service/myHumane';
var storage = window.localStorage;
import actionServices from './actionServices';
var getToken = actionServices.getToken;

var DISK_STATE = immutable.fromJS({
    directories: immutable.Map({}),
    files: immutable.Map({}),
    currentDirectory: immutable.Map({}),
    errorMessage: '',
    loading: false,
    uploading: false,
    newDirectoryShown: false,
    editStatus: false,
    fileToBeMoved: immutable.Map({}),
    uploadingFiles: immutable.Map({}),
});

var diskReducer = function(state = DISK_STATE, action) {
    switch (action.type) {
        //uploader
        case actionTypes.QUEUE:
            var file = action.file;
            state = state.setIn(['uploadingFiles', file.id], immutable.Map({
                id: file.id,
                name: file.name,
                size: file.size,
                parent: file.parent,
                percent: 0
            }));

            return state;
        case actionTypes.UPLOAD_PROGRESS:
            var file = action.file;
            state = state.setIn(['uploadingFiles', file.id, 'percent'], file.percent);
            return state;

        case actionTypes.UPLOADED:
            var file = action.file;
            state = state.deleteIn(['uploadingFiles', file.uploadId]);
            state = state.setIn(['files', file._id], immutable.Map(file));

            return state;

            //Get root
        case actionTypes.BEFORE_GET_ROOT:
            state = state.set('directories', immutable.Map({}));
            state = state.set('currentDirectory', immutable.Map({}));
            state = state.set('files', immutable.Map({}));
            state = state.set('errorMessage', '');
            state = state.set('loading', true);
            return state;
        case actionTypes.AFTER_GET_ROOT:
            state = state.set('currentDirectory', immutable.Map(action.result));
            state = state.setIn(['directories', action.result._id], immutable.Map(action.result));

            action.result.subDirectories.forEach(function(directory) {
                state = state.setIn(['directories', directory._id], immutable.Map(directory));
            });
            action.result.subFiles.forEach(function(file) {
                state = state.setIn(['files', file._id], immutable.Map(file));
            });

            state = state.set('errorMessage', '');
            state = state.set('loading', false);
            return state;
        case actionTypes.ERROR_GET_ROOT:
            state = state.set('directories', immutable.Map({}));
            state = state.set('files', immutable.Map({}));
            state = state.set('errorMessage', 'something wrong');
            state = state.set('loading', true);
            return state;

            //Show new directory
        case actionTypes.SHOW_NEW_DIRECTORY:
            state = state.set('newDirectoryShown', true);
            return state;

            //Create new directory
        case actionTypes.BEFORE_CREATE_NEW_DIRECTORY:
            state = state.set('newDirectoryShown', false);
            state = state.set('errorMessage', '');
            state = state.set('loading', true);
            return state;
        case actionTypes.AFTER_CREATE_NEW_DIRECTORY:
            state = state.setIn(['directories', action.result._id], immutable.Map(action.result));
            action.result.subDirectories.forEach(function(directory) {
                state = state.setIn(['directories', directory._id], immutable.Map(directory));
            });

            state = state.set('loading', false);
            return state;
        case actionTypes.ERROR_CREATE_NEW_DIRECTORY:
            state = state.set('errorMessage', '');
            state = state.set('loading', false);
            return state;

            //Dive into directory
        case actionTypes.BEFORE_DIVE_INTO_DIRECTORY:
            state = state.set('currentDirectory', state.getIn(['directories', action.query.id]));
            state = state.set('errorMessage', '');
            state = state.set('loading', true);
            return state;

        case actionTypes.AFTER_DIVE_INTO_DIRECTORY:
            state = state.setIn(['directories', action.result._id], immutable.Map(action.result));

            action.result.subDirectories.forEach(function(directory) {
                state = state.setIn(['directories', directory._id], immutable.Map(directory));
            });

            action.result.subFiles.forEach(function(file) {
                state = state.setIn(['files', file._id], immutable.Map(file));
            });

            state = state.set('loading', false);
            return state;
        case actionTypes.ERROR_DIVE_INTO_DIRECTORY:
            state = state.set('errorMessage', '');
            state = state.set('loading', false);
            return state;

            //Switch Edit Status
        case actionTypes.SWITCH_EDIT_STATUS:
            var editStatus = state.get('editStatus');
            state = state.set('editStatus', !editStatus);
            if (editStatus) {
                state = state.set('newDirectoryShown', false);
            }
            return state;


            //remove directory
        case actionTypes.BEFORE_REMOVE_DIRECTORY:
            state = state.set('errorMessage', '');
            state = state.set('loading', true);
            return state;

        case actionTypes.AFTER_REMOVE_DIRECTORY:
            state = state.deleteIn(['directories', action.result._id]);
            state = state.set('loading', false);
            return state;
        case actionTypes.ERROR_REMOVE_DIRECTORY:
            state = state.set('errorMessage', '');
            state = state.set('loading', false);
            return state;

            //Edit directory
        case actionTypes.EDIT_DIRECTORY:
            state = state.setIn(['directories', action.query.id, 'isEditing'], true);
            return state;

            //rename directory
        case actionTypes.BEFORE_RENAME_DIRECTORY:
            state = state.set('errorMessage', '');
            state = state.set('loading', true);
            return state;

        case actionTypes.AFTER_RENAME_DIRECTORY:
            state = state.setIn(['directories', action.result._id], immutable.Map(action.result));
            state = state.set('loading', false);
            return state;

        case actionTypes.ERROR_RENAME_DIRECTORY:
            state = state.set('errorMessage', '');
            state = state.set('loading', false);
            return state;



            //requestUpload
        case actionTypes.BEFORE_REQUEST_UPLOAD:
            state = state.set('errorMessage', '');
            state = state.set('uploading', true);
            return state;

        case actionTypes.AFTER_REQUEST_UPLOAD:
            state = state.setIn(['files', action.result._id], immutable.Map(action.result));
            state = state.set('uploading', false);
            return state;

        case actionTypes.ERROR_REQUEST_UPLOAD:
            state = state.set('errorMessage', '');
            state = state.set('uploading', false);
            return state;



            //remove file
        case actionTypes.BEFORE_REMOVE_FILE:
            state = state.set('errorMessage', '');
            state = state.set('loading', true);
            return state;

        case actionTypes.AFTER_REMOVE_FILE:
            state = state.deleteIn(['files', action.result._id]);
            state = state.set('loading', false);
            return state;
        case actionTypes.ERROR_REMOVE_FILE:
            state = state.set('errorMessage', '');
            state = state.set('loading', false);
            return state;

            //Edit file
        case actionTypes.EDIT_FILE:
            state = state.setIn(['files', action.query.id, 'isEditing'], true);
            return state;

            //rename file
        case actionTypes.BEFORE_RENAME_FILE:
            state = state.set('errorMessage', '');
            state = state.set('loading', true);
            return state;

        case actionTypes.AFTER_RENAME_FILE:
            state = state.setIn(['files', action.result._id], immutable.Map(action.result));
            state = state.set('loading', false);
            return state;

        case actionTypes.ERROR_RENAME_FILE:
            state = state.set('errorMessage', '');
            state = state.set('loading', false);
            return state;;



            //requestDownload
        case actionTypes.BEFORE_REQUEST_DOWNLOAD:
            return state;

        case actionTypes.AFTER_REQUEST_DOWNLOAD:
            var url = `${__STORAGE_HOST}/download/${action.result._id}`;
            window.location = url;
            //document.getElementById('download_frame').src = `${__STORAGE_HOST}/download/${action.result._id}`;
            return state;

        case actionTypes.ERROR_REQUEST_DOWNLOAD:
            return state;


            //SWITCH TO MOVE FILE MODE
        case actionTypes.SWITCH_TO_MOVE_FILE_MODE:
            var fileId = action.query.id;
            if (state.getIn(['fileToBeMoved', '_id']) === fileId) {
                state = state.set('fileToBeMoved', immutable.Map({}));
            } else {
                state = state.set('fileToBeMoved', state.getIn(['files', fileId]));
            }
            return state;



            //requestDownload
        case actionTypes.BEFORE_MOVE_FILE:
            state = state.set('loading', true);
            return state;

        case actionTypes.AFTER_MOVE_FILE:
            state = state.setIn(['directories', action.result.source._id], immutable.Map(action.result.source));
            state = state.setIn(['directories', action.result.target._id], immutable.Map(action.result.target));
            state = state.setIn(['files', action.result.file._id], immutable.Map(action.result.file));

            state = state.set('fileToBeMoved', immutable.Map({}));
            state = state.set('loading', false);
            return state;

        case actionTypes.ERROR_MOVE_FILE:
            state = state.set('fileToBeMoved', immutable.Map({}));
            return state;


        default:
            return state;
    }
};

function could(state) {
    return state.getIn(['directories', 'loading']);
}

//getRoot
function beforeGetRoot() {
    return {
        type: actionTypes.BEFORE_GET_ROOT
    };
}

function afterGetRoot(json) {
    return {
        type: actionTypes.AFTER_GET_ROOT,
        result: json
    };
}

function errorGetRoot(error) {
    return {
        type: actionTypes.ERROR_GET_ROOT,
        error: error
    };
}

function dispatchGetRootAsync(query) {
    return (dispatch, getState) => {
        return dispatch(getRoot(query));
    };
}

function getRoot(query) {
    return dispatch => {
        dispatch(beforeGetRoot());
        return fetch(`${__API_BASE}/disk/root`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterGetRoot(json)))
            .catch(error => dispatch(errorGetRoot(error)));
    };
}

//onShowNewDirectory
function onShowNewDirectory() {
    return {
        type: actionTypes.SHOW_NEW_DIRECTORY
    };
}

//createNewDirectory
function beforeCreateNewDirectory() {
    return {
        type: actionTypes.BEFORE_CREATE_NEW_DIRECTORY
    };
}

function afterCreateNewDirectory(json) {
    return {
        type: actionTypes.AFTER_CREATE_NEW_DIRECTORY,
        result: json
    };
}

function errorCreateNewDirectory(error) {
    return {
        type: actionTypes.ERROR_CREATE_NEW_DIRECTORY,
        error: error
    };
}

function dispatchCreateNewDirectoryAsync(query) {
    return (dispatch, getState) => {
        return dispatch(createNewDirectory(query));
    };
}

function createNewDirectory(query) {
    return dispatch => {
        dispatch(beforeCreateNewDirectory());
        return fetch(`${__API_BASE}/disk/dir/${query.parentId}/subdir/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(query.body)
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterCreateNewDirectory(json)))
            .catch(error => dispatch(errorCreateNewDirectory(error)));
    };
}

//diveIntoDirectory
function beforeDiveIntoDirectory(query) {
    return {
        type: actionTypes.BEFORE_DIVE_INTO_DIRECTORY,
        query: query,
    };
}

function afterDiveIntoDirectory(json) {
    return {
        type: actionTypes.AFTER_DIVE_INTO_DIRECTORY,
        result: json
    };
}

function errorDiveIntoDirectory(error) {
    return {
        type: actionTypes.ERROR_DIVE_INTO_DIRECTORY,
        error: error
    };
}

function dispatchDiveIntoDirectoryAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(diveIntoDirectory(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function diveIntoDirectory(query) {
    return dispatch => {
        dispatch(beforeDiveIntoDirectory(query));
        return fetch(`${__API_BASE}/disk/dir/${query.parentId}/subdir/${query.id}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterDiveIntoDirectory(json)))
            .catch(error => dispatch(errorDiveIntoDirectory(error)));
    };
}

//switchEditStatus
function switchEditStatus() {
    return {
        type: actionTypes.SWITCH_EDIT_STATUS
    };
}



//removeDirectory
function beforeRemoveDirectory(query) {
    return {
        type: actionTypes.BEFORE_REMOVE_DIRECTORY,
        query: query,
    };
}

function afterRemoveDirectory(json) {
    return {
        type: actionTypes.AFTER_REMOVE_DIRECTORY,
        result: json
    };
}

function errorRemoveDirectory(error) {
    return {
        type: actionTypes.ERROR_REMOVE_DIRECTORY,
        error: error
    };
}

function dispatchRemoveDirectoryAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(removeDirectory(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function removeDirectory(query) {
    return dispatch => {
        dispatch(beforeRemoveDirectory(query));
        return fetch(`${__API_BASE}/disk/dir/${query.parentId}/subdir/${query.id}`, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRemoveDirectory(json)))
            .catch(error => dispatch(errorRemoveDirectory(error)));
    };
}

//editDirectory
function editDirectory(query) {
    return {
        type: actionTypes.EDIT_DIRECTORY,
        query: query
    };
}

//renameDirectory
function beforeRenameDirectory(query) {
    return {
        type: actionTypes.BEFORE_RENAME_DIRECTORY,
        query: query,
    };
}

function afterRenameDirectory(json) {
    return {
        type: actionTypes.AFTER_RENAME_DIRECTORY,
        result: json
    };
}

function errorRenameDirectory(error) {
    return {
        type: actionTypes.ERROR_RENAME_DIRECTORY,
        error: error
    };
}

function dispatchRenameDirectoryAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(renameDirectory(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function renameDirectory(query) {
    return dispatch => {
        dispatch(beforeRenameDirectory(query));
        return fetch(`${__API_BASE}/disk/dir/${query.parentId}/subdir/${query.id}`, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(query.body)
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRenameDirectory(json)))
            .catch(error => dispatch(errorRenameDirectory(error)));
    };
}



//request upload
function beforeRequestUpload(query) {
    return {
        type: actionTypes.BEFORE_REQUEST_UPLOAD,
        query: query,
    };
}

function afterRequestUpload(json) {
    return {
        type: actionTypes.AFTER_REQUEST_UPLOAD,
        result: json
    };
}

function errorRequestUpload(error) {
    return {
        type: actionTypes.ERROR_REQUEST_UPLOAD,
        error: error
    };
}

function dispatchRequestUploadAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(requestUpload(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function requestUpload(query) {
    return dispatch => {
        dispatch(beforeRequestUpload(query));
        return fetch(`${__API_BASE}/disk/request/upload/dir/${query.id}/subfile/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(function(transaction) {
                var data = new FormData();
                data.append('file', query.file);
                fetch(`${__STORAGE_HOST}/upload/${transaction._id}`, {
                        method: 'POST',
                        body: data
                    })
                    .then(fetchHelper.checkStatus)
                    .then(fetchHelper.parseJSON)
                    .then(json => dispatch(afterRequestUpload(json)))
                    .catch(error => dispatch(errorRequestUpload(error)));
            })
            .catch(error => dispatch(errorRequestUpload(error)));
    };
}



//removeFile
function beforeRemoveFile(query) {
    return {
        type: actionTypes.BEFORE_REMOVE_FILE,
        query: query,
    };
}

function afterRemoveFile(json) {
    return {
        type: actionTypes.AFTER_REMOVE_FILE,
        result: json
    };
}

function errorRemoveFile(error) {
    return {
        type: actionTypes.ERROR_REMOVE_FILE,
        error: error
    };
}

function dispatchRemoveFileAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(removeFile(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function removeFile(query) {
    return dispatch => {
        dispatch(beforeRemoveFile(query));
        return fetch(`${__API_BASE}/disk/dir/${query.parentId}/subfile/${query.id}`, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRemoveFile(json)))
            .catch(error => dispatch(errorRemoveFile(error)));
    };
}

//editFile
function editFile(query) {
    return {
        type: actionTypes.EDIT_FILE,
        query: query
    };
}

//renameFile
function beforeRenameFile(query) {
    return {
        type: actionTypes.BEFORE_RENAME_FILE,
        query: query,
    };
}

function afterRenameFile(json) {
    return {
        type: actionTypes.AFTER_RENAME_FILE,
        result: json
    };
}

function errorRenameFile(error) {
    return {
        type: actionTypes.ERROR_RENAME_FILE,
        error: error
    };
}

function dispatchRenameFileAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(renameFile(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function renameFile(query) {
    return dispatch => {
        dispatch(beforeRenameFile(query));
        return fetch(`${__API_BASE}/disk/dir/${query.parentId}/subfile/${query.id}`, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(query.body)
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRenameFile(json)))
            .catch(error => dispatch(errorRenameFile(error)));
    };
}



//request download
function beforeRequestDownload(query) {
    return {
        type: actionTypes.BEFORE_REQUEST_DOWNLOAD,
        query: query,
    };
}

function afterRequestDownload(json) {
    return {
        type: actionTypes.AFTER_REQUEST_DOWNLOAD,
        result: json
    };
}

function errorRequestDownload(error) {
    return {
        type: actionTypes.ERROR_REQUEST_DOWNLOAD,
        error: error
    };
}

function dispatchRequestDownloadAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(requestDownload(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function requestDownload(query) {
    return dispatch => {
        dispatch(beforeRequestDownload(query));
        return fetch(`${__API_BASE}/disk/request/download/dir/${query.parentId}/subfile/${query.id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterRequestDownload(json)))
            .catch(error => dispatch(errorRequestDownload(error)));
    };
}



//switchToMoveMode
function switchToMoveMode(query) {
    return {
        type: actionTypes.SWITCH_TO_MOVE_FILE_MODE,
        query: query
    };
}


//renameDirectory
function beforeMoveFile(query) {
    return {
        type: actionTypes.BEFORE_MOVE_FILE,
        query: query,
    };
}

function afterMoveFile(json) {
    return {
        type: actionTypes.AFTER_MOVE_FILE,
        result: json
    };
}

function errorMoveFile(error) {
    return {
        type: actionTypes.ERROR_MOVE_FILE,
        error: error
    };
}

function dispatchMoveFileAsync(query) {
    return (dispatch, getState) => {
        if (!could(getState())) {
            return dispatch(moveFile(query));
        } else {
            return Promise.resolve();
        }
    };

    return Promise.resolve();
}

function moveFile(query) {
    return dispatch => {
        dispatch(beforeMoveFile(query));

        return fetch(`${__API_BASE}/disk/move/${query.fileId}/from/${query.sourceDirectoryId}/to/${query.targetDirectoryId}`, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(query.body)
            })
            .then(fetchHelper.checkStatus)
            .then(fetchHelper.parseJSON)
            .then(json => dispatch(afterMoveFile(json)))
            .catch(error => dispatch(errorMoveFile(error)));
    };
}


export default {
    diskReducer,
    dispatchGetRootAsync,
    onShowNewDirectory,
    dispatchCreateNewDirectoryAsync,
    dispatchDiveIntoDirectoryAsync,
    switchEditStatus,
    dispatchRemoveDirectoryAsync,
    editDirectory,
    dispatchRenameDirectoryAsync,
    dispatchRequestUploadAsync,
    dispatchRemoveFileAsync,
    editFile,
    dispatchRenameFileAsync,
    dispatchRequestDownloadAsync,
    switchToMoveMode,
    dispatchMoveFileAsync,
};
