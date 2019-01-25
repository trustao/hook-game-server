const Server = require('../src/main')
const config = require('../config')
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser')
const path = require('path');
const index = require('../src/router/index')
const port = process.env.PROT || config.port
const catchGobal = require('../src/middlewaves/catch')

const app = new Server()
const hostname = '0.0.0.0'

// 静态文件访问
app.use(koaStatic(
  path.join(__dirname, '../public'),
  {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    gzip: true,
  } // eslint-disable-line
));

app.use(bodyParser())

app.use(catchGobal)

app.use(index.routes(), index.allowedMethods())

app.listen(port, hostname, () => {
  console.log(`server running at http://${hostname}:${port}/`);
});
