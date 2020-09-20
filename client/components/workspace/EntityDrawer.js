import React from 'react'
import { Link } from "react-router-dom";
import { Button, Drawer } from '@material-ui/core';
import EntityForm from './EntityForm'

const EntityDrawer = ({ match }) => (
  <Drawer open={true} >
    <Link to='/'>
      <Button variant="outlined" color="secondary" href="#outlined-buttons">
        Close
      </Button>
    </Link>
    <EntityForm entityKey={match.params.id}
                entityType={match.params.type}/>
  </Drawer>
)


export { EntityDrawer }
