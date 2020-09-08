import React from 'react'
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import debounce from 'debounce'
import 'draft-js/dist/Draft.css';

const j = require('jsondiffpatch')

class App extends React.Component {

  state = {
    editorState: EditorState.createEmpty()
  }
  
  _isUnmounted = false
    
  componentDidMount () {
    this.ws = new window.WebSocket("ws://localhost:1234")
    this.ws.onmessage = (event) => {
      if (this._isUnmounted) return
      this.handleMessage(JSON.parse(event.data))
    }
  }
    
  componentWillUnmount () {
    this.ws.close()
    delete this.ws
    this._isUnmounted = true
  }
  
  handleMessage = ({ delta }) => {
    if (!delta) return
    let raw = convertToRaw(this.state.editorState.getCurrentContent())
    let diff = j.patch(raw, delta)
    let nextContentState = convertFromRaw(diff)
    this.setState({
      editorState: EditorState.push(this.state.editorState, nextContentState)
    })
  }
 
  broadcast = debounce((editorState) => {
    if (!this.ws) return
    this.ws.send(JSON.stringify({
      raw: convertToRaw(editorState.getCurrentContent())
    }))
  }, 300)
 
  onChange = editorState => {
    this.broadcast(editorState)
    this.setState({ editorState })
  }

  render () {
    return (
      <div>
	<Editor 
	  editorState={this.state.editorState}
	  onChange={this.onChange}
	/>
      </div>
    )
  }
}
export default App;
