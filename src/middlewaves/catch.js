const error = require('../util/error')
const {logger, ctxLog} = require('../log')

async function auth (ctx, next) {
  let start = new Date();
  ctx.$startTime = start.getTime()
  try {
    await next();
  } catch (e) {
    logger.error(e)
    ctx.body = error()
  }
  ctxLog(ctx)
}

module.exports = auth