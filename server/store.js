const jsondiffpatch = require('jsondiffpatch')

const createStore = () => {
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

module.exports = { createStore }
