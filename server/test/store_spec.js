const chai = require('chai');
const expect = chai.expect
const diffPatch = require('jsondiffpatch')
const Store = require('../lib/store')

describe('createEditorStore', function() {

  var block = {
    "key":"8r9d6",
    "text":"hello world!",
    "type":"unstyled",
    "depth":0,
    "inlineStyleRanges":[],
    "entityRanges":[],
    "data":{}
  }

  var delta = {
    "blocks":{
      "0":[block],
      "_t":"a"
    }
  }

  describe('initialState', function() {
    it('is empty', function() {
      let initialState = Store.createEditorStore().initialState

      expect(initialState.blocks).to.be.an('array').that.is.empty
      expect(initialState.entityMap).to.be.an('object').that.is.empty
    });
  });

  describe('isEmpty', function() {
    it('returns unless entityMap or Block length change', function() {
      let store = Store.createEditorStore();

      expect(store.isEmpty()).to.be.true
      store.patch(delta)
      expect(store.isEmpty()).to.be.false
    });
  });

  describe('#patch(diff)', function() {
    it('updates the state of the store', function() {
      let store = Store.createEditorStore();
      expect(store.getState()).to.deep.equal({
        blocks: [], entityMap: {}
      })

      store.patch(delta)

      expect(store.getState()).to.deep.equal({
        blocks: [block], entityMap: {}
      })
    });
  });
});
