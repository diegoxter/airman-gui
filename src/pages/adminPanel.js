import React from 'react';
import { Grid, Card, Button } from 'semantic-ui-react'
import { ethers } from "ethers";
import activeNetworkContractAddr from '../interactions/data/contracts';

import adminPanelAbi from '../assets/abis/AdminPanel.json'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const testInteraction = async (network) => {
  const adminPanelInstance = new ethers.Contract(activeNetworkContractAddr(network), adminPanelAbi, signer)
  
  console.log(await adminPanelInstance.connect(signer).owner())
}

const AdminPanel = ({ network }) => {


  const handleClick = () => {
    //alert('It works!');
    testInteraction(network)
  }

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
              width: '20%',
              position: 'absolute',
              top: '19px',
              right: '22px',
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