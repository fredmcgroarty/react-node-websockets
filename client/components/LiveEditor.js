import React from 'react'
import {
  Editor,
  EditorState,
  RichUtils,
  compositeDecorator,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css';
import { Grid } from '@material-ui/core';
import { SocketContext } from './SocketManager';

const styles = {
  column: {
    border: '5px solid red',
    padding: 20
  }
}

class LiveEditor extends React.Component {

  static contextType = SocketContext;

  constructor(props) {
    super(props);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.logState = () => {
      const content = this.context.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
  }

  // hijacks keyboard ctrls like cmd+b for bold etc
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(this.context.editorState, command);
    if (newState) {
      this.onChange(newState);
      return;
    }
    return 'not-handled';
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onChange = editorState => {
    this.context.broadcast(editorState)
  }

  render () {
    return (
      <div>
        <h2>
          { this.context.activeUsers }
        </h2>
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
              editorState={this.context.editorState}
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
