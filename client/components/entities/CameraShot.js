import React from 'react'
import { Link } from "react-router-dom";

const CameraShot = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const data = entity.getData();
  return(
    <Link to={ '/entity/' + props.block.getEntityAt(0) } >
      <h2>{data.title}</h2>
      {props.children}
    </Link>
  );
};

const cameraShotRenderer = (block) => {
  if (block.getType() === 'atomic') {
    return {
      component: CameraShot,
      editable: false,
    };
  }
  return null;
}

export { CameraShot, cameraShotRenderer }
