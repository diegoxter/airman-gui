import React from 'react';
import { Image, Segment, Grid } from 'semantic-ui-react'
import AirdropList from '../components/AirdropList';

const Home = ({ isConnected, network, accounts }) => {

  return (
    <Grid divided='vertically'>
      <Grid.Row>
        Placeholder
      </Grid.Row>

      <Grid.Row>
      <Segment loading={!isConnected}>
          <AirdropList 
          network={ network }
          accounts={ accounts }
          />
        </Segment>
      </Grid.Row>
    </Grid>
  );
};
  
export default Home;