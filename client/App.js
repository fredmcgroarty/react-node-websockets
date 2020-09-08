import React from 'react'

import { 
  Editor, 
  EditorState, 
  RichUtils,
  convertFromRaw,
  convertToRaw, 
} from 'draft-js'

import debounce from 'debounce'
import 'draft-js/dist/Draft.css';

const j = require('jsondiffpatch')

class App extends React.Component {
  
  _isUnmounted = false

  constructor(props) { 
    super(props); 
    this.state = { editorState: EditorState.createEmpty() };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  
  // hijacks keyboard ctrls like cmd+b for bold etc
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return;
    }
    return 'not-handled';
  } 
    
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

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render () {
    return (
      <div>
	<button onClick={this._onBoldClick.bind(this)}>Bold</button>
	<Editor 
	  editorState={this.state.editorState}
	  onChange={this.onChange}
	  handleKeyCommand={this.handleKeyCommand}
	/>
      </div>
    )
  }
}
export default App;
