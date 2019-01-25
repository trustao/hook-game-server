const config = require('../config')
var knex = require('knex');

const mysql = knex({
  client: 'mysql',
  connection: config.mysql
})

module.exports = mysql