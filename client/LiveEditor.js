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
import { Grid } from '@material-ui/core';

const j = require('jsondiffpatch')

const styles = {
  column: {
    border: '5px solid red',
    padding: 20
  }
}

class LiveEditor extends React.Component {
  
  _isUnmounted = false

  constructor(props) { 
    super(props); 
    this.state = { editorState: EditorState.createEmpty() };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    }; 
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
    this.ws.onopen = (e) => {
      this.ws.send(
	JSON.stringify({ 
          type: 'setName', data: this.props.username
      })
    )}
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
  
  handleMessage = ({ data }) => {
    if (!data) return
    let raw = convertToRaw(this.state.editorState.getCurrentContent())
    let diff = j.patch(raw, data.data)
    let nextContentState = convertFromRaw(diff)
    this.setState({
      editorState: EditorState.push(this.state.editorState, nextContentState)
    })
  }
 
  broadcast = debounce((editorState) => {
    if (!this.ws) return
    this.ws.send(JSON.stringify({ 
      type: 'editUpdate',
      data: convertToRaw(editorState.getCurrentContent())
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
	<input
	  onClick={this.logState}
	  type="button"
	  value="Log State"
	/>
	<button onClick={this._onBoldClick.bind(this)}>Bold</button>
	<Grid container>
	  <Grid xs={1} item style={styles.column}>
	    <h1> col1 </h1>
	  </Grid>
	  <Grid xs={3} item style={styles.column}>
	    <h1> col2 </h1>
	  </Grid>
	  <Grid xs={6} item style={styles.column}>
	    <Editor 
	      editorState={this.state.editorState}
	      onChange={this.onChange}
	      handleKeyCommand={this.handleKeyCommand}
	    />
	  </Grid>
	  <Grid xs={2} item style={styles.column}>
	    <h1> col2 </h1>
	  </Grid>
	</Grid>
      </div>
    )
  }
}
export default LiveEditor;
