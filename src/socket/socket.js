const WebSocket = require('ws').Server
const Player = require('../logic/player')
const action = require('../logic/action')
const errorInfo = require('../util/error')
const {logger} = require('../log')
const BASE_PATH = '/_socket/'
let sId = 0

class SocketRoom {
  constructor (roomId, ctx, callback) {
    if ( typeof roomId !== 'string') {
      callback && callback(errorInfo('SOCKET_CREATE_ERROR'))
      return
    }
    this.owner = ctx.$userInfo.name
    this.ctx = ctx
    this._id = sId++
    this.playersList = []
    this.roomId = roomId
    this.path = BASE_PATH + roomId
    this.create()
  }

  create () {
    this.ws = new WebSocket({noServer: true})
    this.ws.on('connection', (ws, req, userInfo) => {
      this.createPlayer(ws, userInfo)
    })
  }
  
  sendAll (msg) {
    this.ws.clients.forEach(socket => {
      if (socket.readyState === 1) socket.send(msg)
    })
  }

  destroy () {
    this.ws.close()
    delete this.ctx._sockets[this.roomId]
    logger.warn(`socket [${this.roomId}] was closed.`)
  }

  createPlayer (socket, userInfo) {
    const player = new Player(userInfo, socket, this)
    const existUser = this.playersList.find(item => item.id === player.id)
    if (!existUser) {
      this.playersList.push(player)
    } else {
      if (existUser.socket.readyState === 1) {
        existUser.socket.send(action.playerError('在其他设备登陆'))
        existUser.socket.terminate()
      }
      existUser.updatePlayer(userInfo, socket)
    }
    this.sendAll(action.joinPlayer(player))
  }

}

module.exports = SocketRoom