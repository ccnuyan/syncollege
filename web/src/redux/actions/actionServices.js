var getToken = function() {
    return window.localStorage.getItem('userToken');
};

export default {
    getToken: getToken
};
