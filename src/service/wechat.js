const axios = require('axios')
const obj2UrlParams = require('../util').obj2UrlParams
const config = require('../../config')
const LOGIN_API = 'https://api.weixin.qq.com/sns/jscode2session'

async function loginWechat (code) {
  const params = {
    "appid": config.appId,
    "secret": config.secret,
    "js_code": code,
    "grant_type": "authorization_code"
  }
  return await axios.get(LOGIN_API + obj2UrlParams(params)).then(({data}) => data)
}

module.exports = {
  loginWechat
}