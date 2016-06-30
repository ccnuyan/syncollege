import React, {PropTypes} from 'react';
import cn from 'classnames';
import fetch from 'isomorphic-fetch';
import fetchHelper from '../../redux/actions/fetchHelper';
import myHumane from '../../service/myHumane';
import Editor from '../editor/Editor';
import StoreProvider from '../StoreProvider';

var token = window.localStorage.getItem('userToken');
var presentationId = _Y_.searchToObject(window.location.search).id;

class Edit extends React.Component {
    render() {
        return (
            <StoreProvider>
                <Editor></Editor>
            </StoreProvider>
        );
    }
}

export default Edit;
