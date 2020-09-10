const PORT = process.env.PORT || 1234

const http = require('http')
const server = http.createServer()

const Room = require('./room')

const room = new Room('1', server)
room.socket.on('connection', function connection (ws, req) {

  room.addUser(ws);

  ws.on('message', function incoming (msg) {
    const sender = room.users[ws.id]
    const payload = JSON.parse(msg)

    switch(payload.type) {
      case 'userSet':
	sender.setName(payload.data)
	room.broadcast(sender, payload.data, 'userNew')
    	break;
      case 'editorUpdate':
        room.broadcastDiff(sender, payload);
        break;
      default:
    }
  })
})

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})
