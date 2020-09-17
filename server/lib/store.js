const jsondiffpatch = require('jsondiffpatch')

const createEditorStore = () => {
  let initialState = {
    blocks: [],
    entityMap: {}
  }
  let state = { ...initialState }
 return {
    initialState,
    isEmpty: () => {
      var hasBlocks = state.blocks.length > 0
      var hasEntityMaps = Object.keys(state.entityMap).length > 0
      return !hasBlocks && !hasEntityMaps
    },
    getState: () => state,
    patch: (diff) => {
      state = jsondiffpatch.patch(state, diff)
    }
  }
}

const createUserStore = () => {
  let initialState = {
    users: {}
  }
  let state = { ...initialState.users }
 return {
    initialState,
    getState: () => state,
    add: (id, name) => {
      state[id] = name
    },
    remove: (id) => {
      delete(state[id])
    }
  }
}

module.exports = { createEditorStore, createUserStore }
