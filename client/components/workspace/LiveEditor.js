import React from 'react'
import 'draft-js/dist/Draft.css';
import { convertToRaw, Editor, RichUtils } from 'draft-js'
import { Grid } from '@material-ui/core';

import { SocketContext } from './../contexts/SocketManager';
import { cameraShotRenderer, CameraShot } from './../entities/CameraShot'

const styles = {
  column: {
    border: '5px solid red',
    padding: 20
  }
}

class LiveEditor extends React.Component {

  static contextType = SocketContext;

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(this.context.editorState, command);
    if (newState) {
      this.onChange(newState);
      return;
    }
    return 'not-handled';
  }

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(
      this.context.editorState, 'BOLD'
    ));
  }

  onChange = editorState => {
    this.context.updateStateAndBroadcast(editorState)
  }

  render () {
    return (
      <div>
        <button onClick={this.onBoldClick.bind(this)}>Bold</button>

        <Grid container>
          <Grid xs={1} item style={styles.column}>
            <h1> col1 </h1>
          </Grid>

          <Grid xs={3} item style={styles.column}>
            <h1> col2 </h1>
          </Grid>

          <Grid xs={6} item style={styles.column}>
            <Editor
              blockRendererFn={cameraShotRenderer}
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
