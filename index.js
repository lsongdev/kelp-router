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
function route(method, path, middleware){
  var offset = (typeof arguments[1] == 'string') ? 0 : -1;
  method      = arguments[ offset ];
  path        = arguments[ offset + 1 ];
  middleware  = arguments[ offset + 2 ];
  var keys = [], regexp = pathToRegexp(path, keys);
  return function(req, res, next){
    var path = decodeURIComponent(url.parse(req.url).pathname), self = this;
    if((method ? (method.toUpperCase() == req.method) : true) &&  regexp.test(path)){
      req.params  = {};
      var matchs = regexp.exec(path).slice(1);
      keys.forEach(function(key, index){
        req.params[ key.name ] = matchs[ index ];
      });
      middleware.call(self, req, res, next);
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
