const chai = require('chai');
const expect = chai.expect
chai.use(require('chai-change'));
const Room = require('../lib/room');

describe('Room', function() {

  let id = 'this is the id'
  let server = undefined;
  let room = new Room(id, server)

  describe('#constructor(id, server)', function() {
    it('assigns id and server', function() {
      expect(room.id).to.equal(id)
      expect(room.server).to.equal(server)
    });
  });
});


