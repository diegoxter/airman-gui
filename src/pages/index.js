import React from 'react';
import { Checkbox, Grid, Card, Segment, Button } from 'semantic-ui-react';
import { LoadingCardGroup, NotConnectedMessage } from '../components/CommonComponents';
import { AirdropList } from '../components/HomeElements';

const Home = ({ isConnected, network, accounts }) => {

  return (
    <Grid style={{marginTop: '40px'}} divided='vertically'>
      <Grid.Row>
        <Card 
            style={{
                display: 'flex',
                justifyContent: 'Right',
                alignItems: 'Right',
                height: '150px',
                width: '480px'
            }}>
            <Card.Content>
              <Card.Header>Placeholder</Card.Header>

            </Card.Content>
        </Card>      
      </Grid.Row>

      <Grid.Row columns='equal'>
        <Grid.Column >
          <Checkbox toggle label='Show expired'/>
        </Grid.Column>
        
        <Grid.Column >
          <Checkbox toggle label='Show Claimed'/>
        </Grid.Column>
        
        <Grid.Column >
          <Checkbox toggle label='Show Claimable'/>
        </Grid.Column>

        <Button circular icon='refresh'/>
      </Grid.Row>
      
      <Grid.Row>
        {
          (isConnected)
          ?
          <AirdropList 
            network={ network }
            accounts={ accounts }
            isConnected={ isConnected }
          />
          :
          <Grid.Column >
            <Segment style={{width:'96%'}}>
            <NotConnectedMessage />
            <LoadingCardGroup />
            </Segment>
          </Grid.Column>
        }

      </Grid.Row>
    </Grid>
  );
};
  
export default Home;