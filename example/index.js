const http = require('http');
const kelp = require('kelp');
const route = require('../');

const app = kelp();

app.use(route.get('/', function(req, res, next){
  res.end('hi')
}));

const server = http.createServer(app);

server.listen(3000);
