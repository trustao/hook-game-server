const modal = require('../modal')
const error = require('../util/error')
const {deCodeUUID} = require('../util')
const {logger} = require('../log')

async function auth (ctx, next) {
  const {'hook-key': uuid} = ctx.req.headers
  if (!uuid) {
    return ctx.body = error('FORBID')
  }
  const {sessionKey, openId} = deCodeUUID(uuid)
  const userInfo = await modal.user.getUser(openId)
  if (userInfo) {
    if (sessionKey !== userInfo.session_key) {
      return ctx.body = error('LOGIN_EXPIRED')
    } else {
      ctx.$userInfo = userInfo
      return next()
    }
  } else {
    return ctx.body = error('FORBID')
  }
}

function socketAuth (fn) {
  return (req, socket, head) => {
    const {'hook-key': uuid} = req.headers
    if (!uuid) {
      socket.destroy();
      return
    }
    const {sessionKey, openId} = deCodeUUID(uuid)
    modal.user.getUser(openId).then((userInfo) => {
      if (userInfo) {
        if (sessionKey !== userInfo.session_key) {
          socket.destroy();
          // return ctx.body = error('LOGIN_EXPIRED')
        } else {
          fn(req, socket, head, userInfo)
        }
      } else {
        socket.destroy();
        // return ctx.body = error('FORBID')
      }
    }).catch(e => {
      logger.error(e)
    })
  }
}

module.exports = {
  auth,
  socketAuth
}