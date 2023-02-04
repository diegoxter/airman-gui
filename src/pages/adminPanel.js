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
            <Card.Header>Lorem ipsum dolor sit amet</Card.Header>
            <Card.Description>
            Aenean commodo ligula eget dolor.            
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
                Button
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
        <h1>Aenean massa strong.</h1>
      </div>


    </Grid>
  );
};
  
export default AdminPanel;