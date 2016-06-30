import actionTypes from '../actionTypes';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import fetchHelper from './fetchHelper';

var getToken = function() {
  return window.localStorage.getItem('userToken');
};

//request upload
function queue(file) {
  return {
    type: actionTypes.QUEUE,
    file: file,
  };
}

//request upload
function progress(file) {
  return {
    type: actionTypes.UPLOAD_PROGRESS,
    file: file,
  };
}



function uploaded(file) {
  return {
    type: actionTypes.UPLOADED,
    file: file
  };
}

export default {
  queue,
  progress,
  uploaded,
};
