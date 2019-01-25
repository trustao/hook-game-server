const mysql = require('../db')
const error = require('../util/error')
const moment = require('moment')

async function createUser (userInfo) {
  const {name, avatar, session_key, openid} = userInfo
  if ([name, avatar, session_key, openid].some(val => !val)) {
    // error
    return error()
  }
  const users = await mysql('game_user').select('openid').where({openid})
  if (users.length > 0) {
    return await mysql('game_user').where({openid}).update({...userInfo, update_time: moment().format('YYYY-MM-DD HH:mm:ss')}).then(res => {
      if (res === 1) {
        return {code: 0, msg: "SUCCESS", userInfo}
      } else {
        return error()
      }
    })
  } else {
    return await mysql('game_user')
      .insert({...userInfo, create_time: moment().format('YYYY-MM-DD HH:mm:ss') })
      .then(res => {
        if (res[0] === 0) {
          return {
            code: 0,
            msg: 'SUCCESS',
            userInfo
          }
        } else {
          return {
            code: 9999,
            msg: 'FAIL'
          }
        }
      })
  }
}


async function getUser (openid) {
  if (!openid) {
    return error()
  }
  return await mysql('game_user').select('*').where({openid}).then(res => res && res[0] ? res[0] : null)
}

module.exports = {
  createUser,
  getUser
}