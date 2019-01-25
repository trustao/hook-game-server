const router = require('koa-router')()
const controllers = require('../controllers')
const {auth} = require('../middlewaves/auth')
const {createRoom, roomList} = controllers.room

router.get('/createRoom', auth, createRoom)

router.get('/roomList', auth, roomList)

router.post('/login', controllers.login)

module.exports = router
