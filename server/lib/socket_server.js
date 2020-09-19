const diffPatch = require('jsondiffpatch')

function runSocketServer(server) {

  const io = require('socket.io')(server);
  const Room = require('./room')
  const room = new Room('1', io)

  io.on('connect', socket => {
    socket.on('disconnect', data => { room.removeUser(socket) })
    socket.on('editorUpdate', data => {
      var delta = diffPatch.diff(
        room.getEditorState(), data
      )
      if (delta) {
        room.patchEditorState(delta);
        socket.broadcast.emit('editorNew', delta)
      }
    });
    socket.on('userSet', (data) => {
      room.setUser(data, socket)
      io.emit('userNew', room.getUsernames())
      socket.emit('editorInit', room.getEditorState())
    });
  })
}

module.exports = { runSocketServer }
