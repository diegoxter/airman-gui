import React from 'react';
import { Card, Grid } from 'semantic-ui-react'

const Home = () => {
  const AirdropCard = () => (
    <Card
      href='#card-example-link-card'
      header='Elliot Baker'
      meta='Friend'
      description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
    />
  )
/*
  const NoContent = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'Center',
        alignItems: 'Right',
        height: '100vh'
      }}
    >
      <h1>GeeksforGeeks is a Computer Science portal for geeks.</h1>
    </div>
  )
*/

  return (

      <Grid>
        <AirdropCard />
      </Grid>
  );
};
  
export default Home;