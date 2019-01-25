const ACTIONS = require('../constants').ACTIONS

function baseParam (action, data) {
  return JSON.stringify({
    action, data, timeStamp: Date.now()
  })
}

const playerList = (players) => {
  return baseParam(ACTIONS.PLAYER_LIST, players.map(({name, avatar, id, online}) => ({name, avatar, id, online})))
}

const joinPlayer = (player) =>  {
  const {name, avatar, id, online} = player
  return baseParam(ACTIONS.PLAYER_JOIN, {name, avatar, id, online})
}

const quitPlayer = (player, reason) => baseParam(reason === ACTIONS.PLAYER_QUIT ? ACTIONS.PLAYER_QUIT : ACTIONS.PLAYER_OFFLINE, player.id)

const playerError = (msg) => baseParam(ACTIONS.PLAYER_ERROR, msg)

const position = (players) => {
  return baseParam(
    ACTIONS.POSITION_FRAMER,
    players.map(player => {
      const {id, postion, status} = player
      return {id, postion, status}
    })
  )
}

const heartbeat = () => baseParam(ACTIONS.HEARTBEAT)

module.exports = {
  playerList,
  playerError,
  joinPlayer,
  quitPlayer,
  position,
  heartbeat
}