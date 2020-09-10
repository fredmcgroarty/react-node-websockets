class User {
  constructor(ws) {
    this.name = null;
    this.socket = ws;
  }

  id() {
    this.socket.id
  }

  sendMessage(message) {
    this.socket.send(
      JSON.stringify({type: 'editUpdate', data: message})
    )
  }

  setName(name)  {
    this.name = name;
  }
}

module.exports = User
