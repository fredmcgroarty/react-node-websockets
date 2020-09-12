class User {
  constructor(ws) {
    this.name = null;
    this.socket = ws;
  }

  setName(name)  {
    this.name = name;
  }
}

module.exports = User
