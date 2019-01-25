const service = require('../service/wechat')
const modal = require('../modal')
const errorInfo = require('../util/error')
const util = require('../util')


async function login (ctx, next) {
  const data = ctx.request.body
  let userInfo = {
    name: data.nickName || '',
    gender: data.gender || 0,
    language: data.language || '',
    avatar: data.avatarUrl || '',
    city: data.city || '',
    province: data.province || '',
    country: data.country || ''
  }
  const code = ctx.request.body.code
  if (code) {
    const userKeys = await service.loginWechat(code)
    if (userKeys.errmsg) {
      ctx.body = {...errorInfo('WECHAT_LOGIN_ERROR')}
    } else {
      const uuid = util.createUUID(userKeys.session_key, userKeys.openid)
      const res = await modal.user.createUser({...userInfo, ...userKeys, uuid})
      res.data = uuid
      ctx.body = res
    }
  } else {
    ctx.body = errorInfo('LOGIN_NO_CODE')
  }
}

module.exports = login