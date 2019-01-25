function playersData (players) {
  const playersData = players.map(player => {
    const data =  {...player}
    delete data.socket
    return data
  })
  return JSON.stringify(playersData)
}

module.exports = {
  playersData
}