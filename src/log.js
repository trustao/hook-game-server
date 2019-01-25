const log4js = require('log4js')
log4js.configure({
  "appenders":{
    'hook-game': {
      "type": "dateFile",
      "filename": "./log/log",
      "pattern": '-yyyy-MM-dd.log',
      "maxLogSize": 104800,
      "alwaysIncludePattern": true,
      "layout": {
        "type": 'pattern',
        "pattern": '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %c %m%n'
      }
    },
    out: { type: 'stdout' },
  },
  categories: { default: { appenders: ['hook-game', 'out'], level: 'debug' } }
})
const logger = log4js.getLogger('hook-game')
// if (process.env.NODE_ENV === 'development') {
//   logger.level = "OFF"
// } else {
//   logger.level = "INFO"
// }

function ctxLog (ctx) {
  const {req, $startTime} = ctx
  const status = req.status
  const ip = req.connection.remoteAddress || req.ip
  const method = req.method
  const httpVersion = req.httpVersion
  const protocol = `${req.url.protocol || 'http'}/${httpVersion}`
  const host = req.headers['host']
  const path = req.url
  const userAgent = `"${req.headers['user-agent']}"`
  const referer = req.headers['referer'] ? `"referer:${req.headers['referer']}"` : ''
  const timeConsuming = Date.now() - $startTime + 'ms'
  const hookKey = req.headers['hook-key']
  let data = ''
  try {
    data = JSON.stringify(method === 'GET' ? ctx.request.query : ctx.request.body)
  } catch (e) {
  }
  setLog(status, ip, method, protocol, host, path, userAgent, referer, timeConsuming, hookKey, data)
}

function socketLog (req, status) {
  const ip = req.connection.remoteAddress || req.ip
  const method = req.method
  const httpVersion = req.httpVersion
  const protocol = `${req.url.protocol || 'http'}/${httpVersion}`
  const host = req.headers['host']
  const path = req.url
  const userAgent = `"${req.headers['user-agent']}"`
  const referer = req.headers['referer'] ? `"referer:${req.headers['referer']}"` : ''
  const hookKey = req.headers['hook-key']
  logger.info([status, ip, method, protocol, host, path, userAgent, referer, hookKey].join(' '))

}

function setLog (status, ip, method, protocol, host, path, userAgent, referer, timeConsuming, ...other) {
  const str = [ip, method, status,  protocol, host, path, userAgent, referer, ...other, timeConsuming].join(' ')
  logger.info(str)
}

module.exports = {
  logger,
  ctxLog,
  socketLog
}