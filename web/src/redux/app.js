import userActions from './actions/userActions.js';
import presentationActions from './actions/presentationActions.js';
import diskActions from './actions/diskActions.js';

import {
    combineReducers
}
from 'redux';

const app = combineReducers({
    user: userActions.userReducer,
    presentation: presentationActions.presentationReducer,
    disk: diskActions.diskReducer,
});

export default app;
