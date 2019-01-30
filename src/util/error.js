const errors = {
  MESSAGE_ERROR: {
    code: 6000,
    msg: '格式错误'
  },
  USER_LOGIN_ERROR: {
    code: 7001,
    msg: '登陆失败'
  },
  LOGIN_NO_CODE: {
    code: 7002,
    msg: '登陆失败, 缺少Code'
  },
  WECHAT_LOGIN_ERROR: {
    code: 7003,
    msg: '获取session_key失败'
  },
  LOGIN_EXPIRED: {
    code: 7004,
    msg: '登陆过期'
  },
  FORBID: {
    code: 7005,
    msg: '无权限'
  },
  SOCKET_CREATE_ERROR: {
    code: 8001,
    msg: 'socket创建失败'
  },
  DEFAULT: {
    code: 9999,
    msg: '服务器错误'
  }
}

const errorInfo = (type) => errors[type] || errors.DEFAULT

module.exports = errorInfo