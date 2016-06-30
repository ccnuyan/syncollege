  export default function(router, location) {
    var callback = location.query.callback;
    var q = location.query;
    delete q.callback;
    if (!callback) {
      router.push({
        pathname: 'home'
      });
    } else {
      var query = _Y_.objectToQuery(q);
      var location = query ? callback + '?' + query : callback;
      _Y_.navigateTo(location);
    }
  }
