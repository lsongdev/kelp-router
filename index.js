const { METHODS } = require('http');
const routing = require('routing2');

function Router(table) {
  const routes = [];
  async function run(req, res, next) {
    const { status, route } = routing.find(routes, req);
    res.statusCode = status;
    if (!route) return next();
    req.params = route.params;
    return route.action(req, res, next);
  }
  run.route = (method, path, action) => {
    routes.push(routing.create({ method, path, action }));
    return run;
  };
  METHODS.forEach(method => {
    run[method.toLowerCase()] = (path, action) => {
      return run.route(method, path, action);
    };
  });
  if (typeof table === 'object') {
    for (const rule in table) {
      let p = rule.split(' ');
      p = p.length === 1 ? ['get'].concat(p) : p;
      const [method, path] = p;
      run.route(method, path, table[rule]);
    }
  }
  return run;
};

module.exports = Router;
