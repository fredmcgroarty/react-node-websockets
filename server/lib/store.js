const jsondiffpatch = require('jsondiffpatch')

const createEditorStore = () => {
  let initialState = {
    blocks: [{text: ''}],
    entityMap: {}
  }
  let state = { ...initialState }
 return {
    initialState,
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
