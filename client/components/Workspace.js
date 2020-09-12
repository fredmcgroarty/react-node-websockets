import LiveEditor from './LiveEditor'
class Workspace extends React.Component {
  render() {
    return (
      <div>
	<LiveEditor ws={this.ws}/>
      </div>
    );
  }

}
