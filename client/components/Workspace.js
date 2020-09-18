import LiveEditor from './LiveEditor'
import React from 'react'
import { Drawer } from '@material-ui/core';

class Workspace extends React.Component {

  state = {
    drawerOpen: false
  }

  toggleDrawer = (open) => () => {
    this.setState(prevState => ({ drawerOpen: !prevState.drawerOpen }));
  };

  logState = () => {
    const content = this.context.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleDrawer()}>Open Sesame</button>
        <Drawer open={this.state.drawerOpen} >
          <button onClick={this.toggleDrawer()}>Close Sesame</button>
          <input onClick={this.logState}
                 type="button"
                 value="Log State"
          />
        </Drawer>
        <h2>
          { this.context.activeUsers }
        </h2>
        <LiveEditor ws={this.ws}/>
      </div>
    );
  }

}

export default Workspace;
