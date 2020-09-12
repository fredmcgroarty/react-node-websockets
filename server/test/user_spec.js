const chai = require('chai');
const expect = chai.expect
chai.use(require('chai-change'));
const User = require('../lib/user');
const mockWebSocket = require('mock-websocket').WebSocket;

describe('User', function() {
  describe('#constructor', function() {
    it('requires a websocket', function() {
      let user = new User(mockWebSocket)
      expect(user.socket).to.equal(mockWebSocket);
    });
    it('sets name as null', function() {
      let user = new User(mockWebSocket)
      expect(user.name).to.equal(null);
    });
  });
  describe('#sendMessage', function() {
     xit('sends a message to the client (user)', function() {
       let user = new User(mockWebSocket)
       let message = 'hello world'
       let type = 'TEST_TYPE'
       user.sendMessage(message, type)
     });

  });

  describe('#setName(name)', function() {
    it('sets the name', function() {
      let user = new User(mockWebSocket)
      expect(() => {
	user.setName('Fred')
      }).to.alter(() => user.name, { to: 'Fred' })
    });

  });

});

