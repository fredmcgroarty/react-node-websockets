const Store = require('./store')
const User = require('./user')
const diffPatch = require('jsondiffpatch')

class Room {
  constructor(id, server) {
    this.id = id
    this.socket = server
    this.editorStore = Store.createEditorStore()
    this.userStore = Store.createUserStore()
  }

  getEditorState() {
    return this.editorStore.getState()
  }

  getUsernames() {
    return Object.values(this.userStore.getState())
  }

  getUserState() {
    return this.userStore.getState()
  }

  patchEditorState(delta) {
    this.editorStore.patch(delta)
  }

  removeUser(socket) {
    this.userStore.remove(socket.id)
  }

  setUser(name, socket) {
    this.userStore.add(socket.id, name)
  }
}

module.exports = Room
