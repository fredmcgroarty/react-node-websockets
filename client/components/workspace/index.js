import React from 'react'

import { EntityDrawer } from './EntityDrawer'
import LiveEditor from './LiveEditor'
import { SocketContext } from './../contexts/SocketManager';

import { convertToRaw, EditorState } from 'draft-js'
import { Button } from '@material-ui/core';
import { Switch, Route, Link } from "react-router-dom";

class Workspace extends React.Component {
  static contextType = SocketContext;
  logState = () => {
    const content = this.context.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  }

  buttonRow() {
    return(
      <div>
        <Link to='/entity/new/CAMERA_SHOT' >
          <Button variant="outlined" color="primary" >
            Camera Shot
          </Button>
        </Link>
        <Link to='/entity/new/VT_INSERT' >
          <Button variant="outlined" color="primary" >
            Vit Insert
          </Button>
        </Link>
      </div>
    )
  }

  render() {
    return (
      <div>
        <input
          onClick={this.logState}
          type="button"
          value="Log State"
        />
        <h2>
          { this.context.activeUsers }
        </h2>
        { this.buttonRow() }
        <Switch>
          <Route path='/entity/new/:type' component={EntityDrawer} />
          <Route path='/entity/:type/:id' component={EntityDrawer} />
          <Route path='/' />
        </Switch>
        <LiveEditor/>
      </div>
    );
  }
}

export default Workspace;
