const actions = require('./action')
const constants = require('../constants')
module.exports = class Player {
  constructor (info, socket, socketRoom) {
    const {openid, name, avatar, position} = info
    this.id = openid
    this.name = name
    this.avatar = avatar
    this.postion = {
      x: position && position.x || 0,
      y: position && position.y || 0
    }
    this.online = true
    this.socket = socket
    this.socketRoom = socketRoom
    this.angle = 0
    this.size = 0
    this.scene = 0
    this.status = 0
    this._timer = null
    this.socketEvents()
    this.heartbeat()
  }

  attack (player) {

  }

  updatePlayer (info, socket) {
    this.socket = socket
    this.online = true
  }

  socketEvents () {
    this.socket.send(actions.playerList(this.socketRoom.playersList))
    this.socket.on('message', (data) => {
      console.log(data)
    })
    this.socket.on('close', (code, reason) => {
     this.quit(code, reason)
    })
  }

  quit (code, reason) {
    console.log('[player quit] ', reason)
    clearInterval(this._timer)
    if (code === 1000 && reason === constants.ACTIONS.PLAYER_QUIT) {
      this.socketRoom.playersList.splice(this.socketRoom.playersList.indexOf(this), 1)
      if (this.socketRoom.ws.clients.size === 0) {
        this.socketRoom.destroy()
      }
    }
    this.online = false
    this.socketRoom.sendAll(actions.quitPlayer(this, reason))
  }

  heartbeat (interval = 2000) {
    this._timer = setInterval(() => {
      if (this.socket.readyState === 1) {
        this.socket.send(actions.heartbeat())
      } else {
        clearInterval(this._timer)
      }
    }, interval)
  }
}
