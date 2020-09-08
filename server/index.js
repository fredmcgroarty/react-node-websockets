const j = require('jsondiffpatch')
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
      state = j.patch(state, diff)
    }
  } 
}
const store = createStore()
wss.on('connection', function connection (ws, req) {
  const token = req.headers.cookie && req.headers.cookie.split('=')[1]
  // When a new user connects, we need to get the delta between the server's current state
  // and the empty, initialState and emit that. The client can then patch
  // its own state when the window loads.
  const delta = j.diff(store.initialState, store.getState())
  ws.send(JSON.stringify({ delta })) 
  
  // each client will broadcast its state at a regular interval if there are changes.
  ws.on('message', function incoming (data) {
    let { raw } = JSON.parse(data) 
    // 1. Get the delta between the server's current state and the client-emitted state
    // note that delta will be null if there's no change.
    let delta = j.diff(store.getState(), raw)
    if (delta) {
      // 2. We need to patch the server state so that it doesn't become stale
      store.patch(delta)
      // 3. Emit the delta to all of the clients.
      wss.clients.forEach(function each (client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
	  console.log(client)
          client.send(JSON.stringify({ delta }))
        }
      })
    }
  })
})
server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})
