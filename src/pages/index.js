import React from 'react';
import { Checkbox, Grid, Card } from 'semantic-ui-react'
import { AirdropList } from '../components/HomeElements';

const Home = ({ isConnected, network, accounts }) => {

  return (
    <Grid divided='vertically'>
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

      <Grid.Row centered>
        <Grid columns='equal'>
          <Grid.Column >
            <Checkbox toggle label='Placeholder'/>
          </Grid.Column>
          
          <Grid.Column >
            <Checkbox toggle label='Placeholder'/>
          </Grid.Column>
          
          <Grid.Column >
            <Checkbox toggle label='Placeholder'/>
          </Grid.Column>
          
          <Grid.Column >
            <Checkbox toggle label='Placeholder'/>
          </Grid.Column>

        </Grid>
      </Grid.Row>

      <Grid.Row>
        <AirdropList 
          network={ network }
          accounts={ accounts }
          isConnected={ isConnected }
        />
      </Grid.Row>
    </Grid>
  );
};
  
export default Home;