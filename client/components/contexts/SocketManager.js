import React from "react";
import debounce from 'debounce'
import io from 'socket.io-client';
import {
  convertFromRaw, convertToRaw, EditorState,
} from 'draft-js'

var socket = require('socket.io-client')('ws://0.0.0.0:1234');
const diffPatch = require('jsondiffpatch')

export const SocketContext = React.createContext({
  activeUsers: [],
  broadcast: () => {},
  updateStateAndBroadcast: () => {},
  editorState: EditorState.createEmpty(),
});


export class SocketManager extends React.Component {

  state = {
    activeUsers: [],
    broadcast: () => {},
    editorState: EditorState.createEmpty(),
  }

  socket = null;

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.socket = socket

    this.socket.on('connect',
      this.socket.emit('userSet', this.props.username),
      this.socket.on('editorInit', this.initEditor)
    )
    this.socket.on('editorInit', this.initEditor)
    this.socket.on('editorNew', this.handleEditorChanges)
    this.socket.on('userNew', this.handleNewUser)
  }

  componentWillUnmount () {
    try {
      this.socket !== null && this.socket.disconnect();
    } catch (e) {
      // socket not connected
    }
  }

  initEditor = data => {
    console.log('data', data)
    var convertedState = convertFromRaw(data)
    this.setState({
      editorState: EditorState.createWithContent(convertedState)
    })
  }

  handleNewUser = (data) => {
    this.setState({ activeUsers: data })
  }

  handleEditorChanges = (data) => {
    if (!data) return
    let raw = convertToRaw(this.state.editorState.getCurrentContent())
    let diff = diffPatch.patch(raw, data)
    let nextContentState = convertFromRaw(diff)
    this.setState({
      editorState: EditorState.push(
        this.state.editorState, nextContentState
      )
    })
  }

  broadcast = debounce((editorState) => {
    this.socket.emit(
      'editorUpdate', convertToRaw(
        this.state.editorState.getCurrentContent()
      )
    )
  }, 300)

  render () {
    return (
      <SocketContext.Provider value={{
        updateState: (editorState) => {
          this.setState({ editorState: editorState });
        },
        updateStateAndBroadcast: (editorState) => {
          this.setState({ editorState: editorState });
          this.broadcast(editorState)
        },
        editorState: this.state.editorState,
        activeUsers: this.state.activeUsers
      }}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}
export default SocketManager;
