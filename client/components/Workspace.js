import LiveEditor from './LiveEditor'

class Workspace extends React.Component {
  componentDidMount () {
    this.ws = new window.WebSocket("ws://localhost:1234")
    this.ws.onopen = (e) => {
      this.ws.send(
	JSON.stringify({ 
          type: 'userSet', data: this.props.username
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

  render() {
    return (
      <div>
	<LiveEditor ws={this.ws}/>
      </div>
    );
  }

}
