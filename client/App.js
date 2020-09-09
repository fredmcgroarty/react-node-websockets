import React from 'react'
import LiveEditor from './LiveEditor'
import SignIn from './SignIn'

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
      view = <LiveEditor username={this.state.username} />
    } else {
      view = <SignIn handleSubmit={this.handleSubmit} />
    }
    return (
      <div>
	{ view }
      </div>
    )
  }
}
export default App;
