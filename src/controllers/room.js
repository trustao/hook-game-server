const SocketRoom = require('../socket/socket')
const randomKey = require('../util/index').randomKey

async function createRoom (ctx, next) {
  const roomId = randomKey()
  const socket = new SocketRoom(roomId, ctx, (err) => {
    ctx.body = err
  })
  if (socket) {
    ctx._sockets[roomId] = socket
    ctx.body = {
      code: 0,
      msg: 'SUCCESS',
      data: roomId
    }
  }
}

async function roomList (ctx, next) {
  const rooms = Object.keys(ctx._sockets)
  ctx.body = {
    code: 0,
    message: 'SUCCESS',
    data: rooms.map(roomId => ({owner: ctx._sockets[roomId].owner, roomId}))
  }
}

async function destoryRoom (ctx, next) {
  const roomId = ctx.req.query.roomId
  if (roomId) {
    const roomSocket = ctx._sockets[roomId]
    if (roomSocket && roomSocket.ws.readyState === 3) {
      delete ctx._sockets[roomId]
    }
  }
}

module.exports = {
  createRoom,
  roomList,
  destoryRoom
}