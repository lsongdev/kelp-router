const http = require('http');
const kelp = require('kelp');
const Router = require('..');

const app = kelp();

const router = new Router()

app.use(router);

router.get('/:name?', async (req, res, next) => {
  console.log(req.params);
  res.end('hello');
});

app.use((req, res) => res.end('404'));

const server = http.createServer(app);

server.listen(3000);
