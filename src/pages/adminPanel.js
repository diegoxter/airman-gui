import React from 'react';
import { Grid, Card, Image, Button } from 'semantic-ui-react'
import AdminPanelModal from '../components/AdminPanel/Modal';

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
    <Card.Group>
    <Card>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
        />
        <Card.Header>Steve Sanders</Card.Header>
        <Card.Meta>Friends of Elliot</Card.Meta>
        <Card.Description>
          Steve wants to add you to the group <strong>best friends</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green'>
            Approve
          </Button>
          <Button basic color='red'>
            Decline
          </Button>
        </div>
      </Card.Content>
    </Card>
    <Card>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>Molly Thomas</Card.Header>
        <Card.Meta>New User</Card.Meta>
        <Card.Description>
          Molly wants to add you to the group <strong>musicians</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green'>
            Approve
          </Button>
          <Button basic color='red'>
            Decline
          </Button>
        </div>
      </Card.Content>
    </Card>
    <Card>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
        />
        <Card.Header>Jenny Lawrence</Card.Header>
        <Card.Meta>New User</Card.Meta>
        <Card.Description>
          Jenny requested permission to view your contact details
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green'>
            Approve
          </Button>
          <Button basic color='red'>
            Decline
          </Button>
        </div>
      </Card.Content>
    </Card>
  </Card.Group>
      </ Grid.Row>


    </Grid>
  );
};
  
export default AdminPanel;