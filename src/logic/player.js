const actions = require('./action')
const constants = require('../constants')
const {logger} = require('../log')
const error = require('../util/error')

module.exports = class Player {
  constructor (info, socket, socketRoom) {
    const {openid, name, avatar, position, sence} = info
    this.id = openid
    this.name = name
    this.avatar = avatar
    this.position = {
      x: position && position.x || (Math.random() * 1500 | 0),
      y: position && position.y || (Math.random() * 750 | 0)
    }
    this.online = true
    this.socket = socket
    this.socketRoom = socketRoom
    this.radian = 0
    this.size = 0
    this._scene = sence || 1002
    this.status = 0
    this._timer = null
    this.weapon = ''
    this.socketEvents()
    this.heartbeat()
  }

  attack (player) {

  }

  get scene  () {
    return this._scene
  }

  set scene (val) {
    this._scene = val
    switch (val) {
      case constants.SCENE.GAME:
        this.socketRoom.readyCount++
        break
      case constants.SCENE.OVER:
        this.gameOver()
        break
    }
  }
  
  send (msg) {
    if (this.socket.readyState === 1) {
      this.socket.send(msg)
    }
  }

  gameStart () {
    this.send(actions.gameStart(this.socketRoom.playersList))
    clearInterval(this._timer)
    this._timer = setInterval(() => {
      // console.log(`[send ${this.name}] x: ${this.position.x}; y: ${this.position.y}; radian: ${this.radian}`)
      this.send(
        actions.position(this.socketRoom.playersList.filter(player => player.scene === constants.SCENE.GAME))
      )
    }, constants.GAME.FRAMER_DURATION)
  }

  gameOver () {
    clearInterval(this._timer)
    this.send(actions.gameOver(this.socketRoom.playersList))
  }

  update ({position = {}, radian, size, scene, status} = {}) {
    console.log(`[update ${this.name}] x: ${position.x}; y: ${position.y}; radian: ${radian}`)
    const {x, y} = position
    if (!isNaN(x)) this.position.x = x
    if (!isNaN(y)) this.position.y = y
    this.radian = radian
    // this.size = size
    // this.scene = scene
    // this.status = status
  }

  reLoadPlayer (info, socket) {
    this.socket = socket
    this.online = true
  }

  socketEvents () {
    this.send(actions.playerList(this.socketRoom.playersList))
    this.socket.on('message', (data) => {
      this.onMessage(data)
    })
    this.socket.on('close', (code, reason) => {
     this.quit(code, reason)
    })
  }

  onMessage (data) {
    try {
      const msg = JSON.parse(data)
      switch (msg.action) {
        case constants.ACTIONS.GAME_READY:
          this.scene = constants.SCENE.LOADING
          this.socketRoom.sendAll(actions.gameReady())
          break
        case constants.ACTIONS.GAME_START:
          this.scene = constants.SCENE.GAME
          break
        case constants.ACTIONS.GAME_OVER:
          break
        case constants.ACTIONS.PING:
          this.send(actions.pingBack())
          break
        case constants.ACTIONS.POSITION_FRAMER:
          this.update(msg.data)
          break

      }
    } catch (e) {
      logger.error(e)
      this.send(JSON.stringify(error('MESSAGE_ERROR')))
    }
  }

  quit (code, reason) {
    console.log('[player quit] ', reason)
    clearInterval(this._timer)
    if (code === 1000 && reason === constants.ACTIONS.PLAYER_QUIT) {
      this.socketRoom.playersList.splice(this.socketRoom.playersList.indexOf(this), 1)
      if (this.socketRoom.ws.clients.size === 0) {
        this.socketRoom.gameOver()
        this.socketRoom.destroy()
      }
    }
    this.online = false
    this.socketRoom.sendAll(actions.quitPlayer(this, reason))
  }

  heartbeat (interval = 2000) {
    this._timer = setInterval(() => {
      if (this.socket.readyState === 1) {
        this.send(actions.heartbeat())
      } else {
        clearInterval(this._timer)
      }
    }, interval)
  }
}
