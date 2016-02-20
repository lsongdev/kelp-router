'use strict';
const pathToRegexp = require('path-to-regexp');

function route(method, path, callback){
  if(arguments.length == 2){
    callback = path;
    path = method;
    method = null;
  }
  var keys = [];
  var regexp = pathToRegexp(path, keys);
  return function(req, res, next){
    if((method ? (method.toUpperCase() == req.method) : true) &&  regexp.test(req.url)){
      req.params = {};
      var matchs = regexp.exec(req.url).slice(1);
      keys.forEach(function(key, i){
        req.params[ key.name ] = matchs[ i ];
      });
      callback.apply(this, arguments);
    }else{
      next();
    }
  }
};

route.get = function(path, callback){
  return route('get', path, callback);
};

module.exports = route;
