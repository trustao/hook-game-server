const router = require('koa-router')({
  prefix: '/user'
})
const controllers = require('../controllers')
const {createRoom, roomList} = controllers.room

router.get('/login', createRoom)

router.get('/roomList', roomList)

module.exports = router
