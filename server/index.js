const jsondiffpatch = require('jsondiffpatch')
const WebSocket = require('ws')
const http = require('http')
const PORT = process.env.PORT || 1234
const server = http.createServer()
const wss = new WebSocket.Server({ server })

const createStore = () => {
  let initialState = {
    blocks: [{text: ''}],
    entityMap: {}
  }
  let state = { ...initialState }
  let users = {}
  return {
    initialState,
    getState: () => state,
    patch: (diff) => {
      state = jsondiffpatch.patch(state, diff)
    }
  }
}

class Room {
  constructor(id) {
    this.id = id
    this.users = {}

  }
  addUser(user) {
    this.users[user.socket.id] = user
  }

  broadcast(message, senderId) {
    Object.keys(this.users).forEach((userId) => {
      if (userId != senderId) {
	this.users[userId].sendMessage(message)
      }
    })
  }
}

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


const room = new Room('1')
const store = createStore()
let usersCount = 0
wss.on('connection', function connection (ws, req) {

  ws.id = usersCount++
  let user = new User(ws)
  room.addUser(user);
  let delta = jsondiffpatch.diff(store.getState())

  ws.on('message', function incoming (message) {
    const payload = JSON.parse(message)
    if (payload.type == 'setName') {
      room.users[ws.id].setName(payload.data)
    } else if (payload.type == 'editUpdate') {
      let delta = jsondiffpatch.diff(store.getState(), payload)
      if (delta) {
	store.patch(delta);
	room.broadcast(delta, ws.id)
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})
