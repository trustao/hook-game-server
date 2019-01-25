const service = require('../service/wechat')
const errorInfo = require('../util/error')
async function login (ctx, next) {
  const code = ctx.req.query.code
  if (code) {
    const userInfo = await service.loginWechat(code)
    if (userInfo.errmsg) {
      ctx.body = {...errorInfo('WECHAT_LOGIN_ERROR'),code: userInfo.errcode, msg: userInfo.errmsg}
    }
  } else {
    ctx.body = errorInfo('USER_LOGIN_ERROR')
  }
}

module.exports = {
  login
}