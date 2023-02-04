import React from 'react';
import { Grid, Card, Button } from 'semantic-ui-react'

const AdminPanel = () => {
  
  const handleClick = () => alert('It works!');

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
          <Button 
          style={{
              width: '32%',
              position: 'absolute',
              right: '0px',
              border: '70x'
            }}
              basic color='green' onClick={ handleClick }>
                Deploy
          </Button>
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
        <h1>Welcome to GeeksforGeeks Events</h1>
      </div>


    </Grid>
  );
};
  
export default AdminPanel;