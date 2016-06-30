import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import {
    createStore,
    applyMiddleware
}

from 'redux';
import immutable from 'immutable';
import app from './app';


const loggerMiddleware = createLogger();

const createStoreWithMiddleware = __DEV ? applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    // loggerMiddleware, // neat middleware that logs actions
)(createStore) : applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
)(createStore);

//initialState here represent real data it could be from the server;
var initialState;
if (__DEV) {
    initialState = {
        user: immutable.fromJS({
            isLoading: true,
            payload: immutable.Map({}),
            errorMessage: ''
        }),
        presentation: immutable.fromJS({
            isBusing: false,
            currentPresentation: immutable.Map({}),
            currentSnapshot: immutable.Map({}),
            presentations: immutable.Map({}),
            recentSnapshots: immutable.Map({}),
            favorateSnapshots: immutable.Map({}),
            createFlag: false,
            errorMessage: '',
        }),
        disk: immutable.fromJS({
            directories: immutable.Map({}),
            files: immutable.Map({}),
            currentDirectory: immutable.Map({}),
            errorMessage: '',
            loading: false,
            uploading: false,
            newDirectoryShown: false,
            editStatus: false,
            fileToBeMoved: immutable.Map({}),
            uploadingFiles: immutable.Map({
                mamsdmf: immutable.Map({
                    name: '123.png',
                    id: 'mamsdmf',
                    size: 1230,
                    percent: 60,
                    parent: '57147bb7952c34297990bdf1'
                }),
                amdmfnbg: immutable.Map({
                    name: '482.png',
                    id: 'amdmfnbg',
                    size: 12310,
                    percent: 30,
                    parent: '57147bb7952c34297990bdf1'
                })
            })
        })
    };
} else {
    initialState = {
        user: immutable.fromJS({
            isLoading: true,
            payload: immutable.Map({}),
            errorMessage: ''
        }),
        presentation: immutable.fromJS({
            isBusing: false,
            currentPresentation: immutable.Map({}),
            currentSnapshot: immutable.Map({}),
            presentations: immutable.Map({}),
            recentSnapshots: immutable.Map({}),
            favorateSnapshots: immutable.Map({}),
            createFlag: false,
            errorMessage: '',
        }),
        disk: immutable.fromJS({
            directories: immutable.Map({}),
            files: immutable.Map({}),
            currentDirectory: immutable.Map({}),
            errorMessage: '',
            loading: false,
            uploading: false,
            newDirectoryShown: false,
            editStatus: false,
            fileToBeMoved: immutable.Map({}),
            uploadingFiles: immutable.Map({})
        })
    };
}

const store = createStoreWithMiddleware(app, initialState);

export default store;
