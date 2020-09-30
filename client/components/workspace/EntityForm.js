import React from 'react'
import { Redirect } from "react-router-dom";
import { Button, FormControl, InputLabel, TextField } from '@material-ui/core'
import { AtomicBlockUtils, Modifier, EditorState } from 'draft-js'
import { SocketContext } from './../contexts/SocketManager';
import Form from "@rjsf/core";
import PropTypes from 'prop-types';

const entitySchema = { 
  'CAMERA_SHOT': { 
    schemaUrl: 'camera_shot.json',
    uiSchema: { 
      description: {
        "ui:widget": "textarea",
        "ui:options": {
          rows: 15
        }
      }
    }
  },
  'VT_INSERT': { 
    schemaUrl: 'vt_insert.json',
    uiSchema: { 
      description: {
        "ui:widget": "textarea",
        "ui:options": {
          rows: 15
        }
      }
    }
  }
}

class EntityForm extends React.Component {

  static contextType = SocketContext;


  state = {
    formData: {},
    isFinished: false,
    schema: {},
    uiSchema: {}
  }

  componentDidMount() {
    var schema = entitySchema[this.props.entityType]
    var schemaUrl = ("http://localhost:5000/" + schema['schemaUrl'])

    this.setState({uiSchema: schema['uiSchema'] })

    fetch(schemaUrl).then(response => response.json()).then(body => { 
      this.setState({ schema: body })
    })

    this.editorState = this.context.editorState
    this.contentState = this.editorState.getCurrentContent()

    if (this.props.entityKey) {
      const data = this.contentState.getEntity(this.props.entityKey).getData()
      data ? this.setState({formData: data}) : console.log('RECORD NOT FOUND')
    }
  }

  handleSubmit = (e) => {
    event.preventDefault();
    this.props.entityKey ? this.updateEntity() : this.createEntity()
    this.setState({isFinished: true})
  }

  updateEntity() {
    const entity = this.contentState.getEntity(this.props.entityKey)

    this.contentState.mergeEntityData(
      this.props.entityKey, { ...this.state.formData }
    )

    this.context.updateStateAndBroadcast(
      EditorState.forceSelection(
        this.editorState, this.editorState.getSelection()
      )
    )
  }

  createEntity() {
    const currentSelection = this.editorState.getSelection();

    const contentStateWithEntity = this.contentState.createEntity(
      this.props.entityType, 'IMMUTABLE', this.state.formData
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      this.editorState, { currentContent: contentStateWithEntity }
    );

    this.context.updateState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
    )
  }

  render() {
    var view = null
    if (this.state.isFinished) {
      view = <Redirect to='/' />
    } else {
      view = <Form formData={this.state.formData}
                   onChange={e => this.setState({formData: e.formData})}
                   onSubmit={this.handleSubmit}
                   schema={this.state.schema}
                   uiSchema={this.state.uiSchema}
              />
    }
    return (view);
  }
}

EntityForm.propTypes = {
  entityType: PropTypes.string.isRequired,
  entityKey: PropTypes.string.isOptional
};

export default EntityForm;
