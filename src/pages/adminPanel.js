import React from 'react';
import { Grid, Card } from 'semantic-ui-react'
import AdminPanelModal from '../components/AdminPanelModal';

const AdminPanel = ({ network, accounts }) => {
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
          <AdminPanelModal network={ network } accounts={ accounts }/>  
      </Card>
    </ Grid.Row>

      <div
        style={{
          display: 'flex',
          justifyContent: 'Right',
          alignItems: 'Right',
          height: '100vh'
        }}
      >
        <h1>
          Lorem ipsum dolor sit amet, consec
        </h1>
      </div>


    </Grid>
  );
};
  
export default AdminPanel;