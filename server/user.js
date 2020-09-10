class User {
  constructor(ws) {
    this.name = null;
    this.socket = ws;
  }

  id() {
    this.socket.id
  }

  sendMessage(message, type) {
    this.socket.send(
      JSON.stringify({type: type, data: message})
    )
  }

  setName(name)  {
    this.name = name;
  }
}

module.exports = User
