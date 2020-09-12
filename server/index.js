const PORT = process.env.PORT || 1234

const http = require('http')
const server = http.createServer()
require('./lib/socket_server').runSocketServer(server)
server.listen(1234);
