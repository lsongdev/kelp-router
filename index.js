'use strict';
const url          = require('url');
const pathToRegexp = require('path-to-regexp');

;([
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'options',
  'patch'
]).forEach(function(method){
  route[ method ] = route.bind(this, method);
});

/**
 * [route description]
 * @param  {[type]} method      [description]
 * @param  {[type]} path        [description]
 * @param  {[type]} middlewares [description]
 * @return {[type]}             [description]
 */
function route(method, path, middlewares){
  var offset = (typeof arguments[1] == 'string') ? 0 : -1;
  method      = arguments[ offset ];
  path        = arguments[ offset + 1 ];
  middlewares = [].slice.call(arguments, offset + 2);
  middlewares = [].concat.apply([], middlewares);
  var keys = [], regexp = pathToRegexp(path, keys);
  return function(req, res, next){
    var path = decodeURIComponent(url.parse(req.url).pathname), self = this, i = -1;
    if((method ? (method.toUpperCase() == req.method) : true) &&  regexp.test(path)){
      req.params  = {};
      var matchs = regexp.exec(path).slice(1);
      keys.forEach(function(key, index){
        req.params[ key.name ] = matchs[ index ];
      });
      (function fn(err){
        var middleware = middlewares[ ++i ];
        if(typeof middleware == 'function'){
          middleware.apply(self, [ req, res, fn, err ]);
        }
      })();
    }else{
      next();
    }
  }
};

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = route;
