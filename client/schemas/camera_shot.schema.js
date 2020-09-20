const CameraShotSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "./camera_shot.schema.json",
  "title": "Camera Shot",
  "description": "A script editor entity.",
  "type": "object",
  "required": ["title", "description"],
  "properties": {
    "description": {
        "type": "string",
    },
    "instructionType": {
      "type": "string",
      "enum": ['camera reposition',
               'dashed shot line',
               'solid shot line',
               'shot development']
    },
    "title": {
        "type": "string",
    },
  }
}

export default CameraShotSchema
