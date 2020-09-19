import React from 'react'
import { Link } from "react-router-dom";
import { Button, Drawer } from '@material-ui/core';
import EntityForm from './EntityForm'

const EntityDrawer = ({ match }) => (
  <Drawer open={true} >
    <Link to='/'>
      <Button>
        Close
      </Button>
    </Link>
    <EntityForm id={match.params.id}/>
  </Drawer>
)


export { EntityDrawer }
