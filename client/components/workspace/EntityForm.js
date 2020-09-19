import React from 'react'
import { Button, FormControl, InputLabel, TextField } from '@material-ui/core'
import { AtomicBlockUtils, Modifier, EditorState } from 'draft-js'
import { SocketContext } from './../contexts/SocketManager';

class EntityForm extends React.Component {

  static contextType = SocketContext;

  state = {
    title: '',
    description: '',
  }

  componentDidMount() {
    this.editorState = this.context.editorState
    this.contentState = this.editorState.getCurrentContent()

    if (this.props.id) {

      const entity = this.contentState.getEntity(this.props.id)

      if (entity) {
        var data = entity.getData()
        this.state.title = data.title
        this.state.description = data.description
      } else {
        console.log('RECORD NOT FOUND')
      }
    }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit = (e) => {
    event.preventDefault();
    if (this.props.id) {
      this.updateEntity();
    } else {
      this.createEntity();
    }
  }

  updateEntity() {
    const entity = this.contentState.getEntity(this.props.id)
    this.contentState.mergeEntityData(this.props.id, { ...this.state })
    this.context.updateStateAndBroadcast(
      EditorState.forceSelection(this.editorState, this.editorState.getSelection())
    )
  }

  createEntity() {
    const currentSelection = this.editorState.getSelection();

    const contentStateWithEntity = this.contentState.createEntity(
      'CAMERA_SHOT',
      'IMMUTABLE',
       this.state
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      this.editorState,
      {currentContent: contentStateWithEntity}
    );
    this.context.updateState(
      AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      )
    )
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormControl>
          <TextField name="title"
                     variant='outlined'
                     type="text"
                     value={this.state.title}
                     onChange={this.handleChange} />
        </FormControl>

        <br />

        <FormControl>
          <TextField multiline
                     variant='outlined'
                     rows={4}
                     name="description"
                     value={this.state.description}
                     onChange={this.handleChange} />
        </FormControl>
        <br />
        <Button color='primary' type='submit'>
          Save
        </Button>
      </form>
    );
  }
}

export default EntityForm;
