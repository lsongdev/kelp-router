'use strict';
const url = require('url');
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
    var u = url.parse(req.url, true);
    req.params = {};
    req.query = u.query;
    req.path = u.pathname;
    if((method ? (method.toUpperCase() == req.method) : true) &&  regexp.test(req.path)){
      var matchs = regexp.exec(req.path).slice(1);
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
