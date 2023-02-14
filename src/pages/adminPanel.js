import React, {useState} from 'react';
import { Grid, Card } from 'semantic-ui-react'
import AdminPanelModal from '../components/AdminPanel/Modal';
import { DeployedAirManList } from '../components/AdminPanel/DeployedAirMan';

const AdminPanel = ({ network, accounts, isConnected }) => {

  // TO DO this Grid needs to be drawn better
  return (
    <Grid divided='vertically'>
      <Grid.Row>
        <Card 
          style={{
              display: 'flex',
              justifyContent: 'Right',
              alignItems: 'Right',
              height: '100%',
              width: '100%'
          }}>
          <Card.Content>
            <Card.Header>Deploy a new Airdrop Manager</Card.Header>
            <Card.Description>
              Create a new Airdrop Manager for your community!
            </Card.Description>
          </Card.Content>
          <AdminPanelModal network={ network } accounts={ accounts } isConnected={ isConnected }/>  
      </Card>
    </ Grid.Row>
    <Grid.Row>
      <DeployedAirManList 
      network={ network } 
      accounts={ accounts }
      isConnected={ isConnected }
      />
    </Grid.Row>


    </Grid>
  );
};
  
export default AdminPanel;