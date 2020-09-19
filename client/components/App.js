import React from 'react'
import Workspace from './workspace/index'
import SignIn from './SignIn'
import SocketManager from './contexts/SocketManager'

class App extends React.Component {
  state = {
    username: null
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleSubmit({username}) {
    this.setState({ username });
  }

  render () {
    let view;
    if (null != this.state.username) {
      view = (
        <SocketManager username={this.state.username}>
          <Workspace />
        </ SocketManager>
      )
    } else {
      view = (
        <SignIn handleSubmit={this.handleSubmit} />
      )
    }

    return (
      <div>
        { view }
      </div>
    )
  }
}
export default App;
