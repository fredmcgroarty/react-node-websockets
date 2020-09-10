const Store = require('./store')
const User = require('./user')
const WebSocket = require('ws')
const diffPatch = require('jsondiffpatch')

class Room {
  constructor(id, server) {
    this.id = id
    this.socket = new WebSocket.Server({ server })
    this.store = Store.createStore()
    this.totalSockets = 0
    this.users = {}
  }

  addUser(ws) {
    ws.id = this.totalSockets++
    this.users[ws.id] = new User(ws)
  }

  broadcast(sender, message, type) {
    Object.keys(this.users).forEach((userId) => {
      if (userId != sender.id) {
	this.users[userId].sendMessage(message, type)
      }
    })
  }

  broadcastDiff(sender, payload) {
    const delta = diffPatch.diff(
      this.store.getState(), payload
    )

    if (delta) {
      this.store.patch(delta);
      this.broadcast(sender, delta, 'editorNew')
    }
  }
}

module.exports = Room
