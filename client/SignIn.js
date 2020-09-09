import React from 'react'

class SignIn extends React.Component {
  constructor(props) { 
    super(props);
    this.state = { username: null }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.value});  
  }

  render() {
     return (
      <div>
        <form onSubmit={(e)=> { 
	     e.preventDefault();
	     this.props.handleSubmit(this.state);
	  }}>
	  <label htmlFor="username">Username:</label>
	  <input type="text" 
		 id="username" 
		 name="username" 
	     	 onChange={this.handleChange}
		 required
	  />
	  <button type="submit"> go </button>
	</form>
      </div>
    );
  }
}

export default SignIn;
