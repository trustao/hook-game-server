const Koa = require('koa');
const mysql = require('./db')
const {socketAuth} = require('./middlewaves/auth')
const {logger, socketLog} = require('./log')

class KoaWs extends Koa {
  constructor (props) {
    super(props)
    this.context._sockets = {}
    this.mysql = mysql
    this.willCloseSockets = []
  }


  listen (...args) {
    const server = super.listen.apply(this, args)
    this.attachUpgrade(server)
    this.checkAliveSocket()
    return server
  }

  attachUpgrade (server) {
    server.on('upgrade', socketAuth((req, socket, head, userInfo) => {
      const match = req.url.match(/\/_socket\/(\w+)?/)
      const roomId = match && match[1]
      if (roomId && this.context._sockets[roomId]) {
        const {ws} = this.context._sockets[roomId]
        ws.handleUpgrade(req, socket, head, function done(websocket) {
          socketLog(req, 'SOCKET_SUCCESS')
          ws.emit('connection', websocket, req, userInfo);
        });
      } else {
        socketLog(req, 'SOCKET_FAIL')
        socket.destroy();
      }
    }))
  }

  checkAliveSocket () {
    setTimeout(() => {
      Object.keys(this.context._sockets).forEach(roomId => {
        if (this.context._sockets[roomId].ws.clients.size === 0) {
          this.willCloseSockets.push({roomId, checkCount: 0})
          logger.warn(`socket [${roomId}] will be closed.`)
        }
      })
      this.checkAliveSocket()
      this.checkShouldSocket()
    }, 5000)
  }

  checkShouldSocket () {
    for (let i = 0; i < this.willCloseSockets.length; i++) {
      const item = this.willCloseSockets[i];
      const room = this.context._sockets[item.roomId]
      if (room) {
        if (room.ws.clients.size === 0) {
          item.checkCount++
          if (item.checkCount >= 5) {
            this.closeSocket(item.roomId)
            this.willCloseSockets.splice(i, 1)
            i--
          }
        } else {
          this.willCloseSockets.splice(i, 1)
          i--
        }
      }
    }
  }

  closeSocket (roomId) {
    this.context._sockets[roomId].destroy()
  }
}

module.exports = KoaWs
