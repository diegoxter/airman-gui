import React from 'react';
import { Card, Grid } from 'semantic-ui-react'

const Home = () => {
  const CardExampleLinkCard = () => (
    <Card
      href='#card-example-link-card'
      header='Elliot Baker'
      meta='Friend'
      description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
    />
  )

  return (
    // to do a grid
    <Grid style={{
      position: 'relative',
      display: 'flex',
      height: '10vh'
    }}>
      <CardExampleLinkCard />
    </Grid>
  );
};
  
export default Home;