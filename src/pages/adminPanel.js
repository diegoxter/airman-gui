import React, { useState, useEffect } from 'react';
import { Grid, Card } from 'semantic-ui-react'
import { getInstanceInformationByOwner } from '../interactions/airmanSystem'
import AdminPanelModal from '../components/AdminPanel/DeployAirmanModal';
import { DeployedAirManList } from '../components/AdminPanel/DeployedAirManList';


const AdminPanel = ({ network, accounts, isConnected }) => {
  const [instances, setInstances] = useState('');
  const [checkedInstances, setCheckedInstances] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getInstanceInformationByOwner(accounts, network);

      return data;
    }

    if (isConnected && accounts !== '' && network !== '') ( 
      fetchData()
      .then((value) => {
        setInstances(value);
        return true;
      })
      .then((result) => setCheckedInstances(result))
  )
  }, [accounts, checkedInstances, isConnected, network]);

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
              width: '480px'
          }}>
          <Card.Content>
            <Card.Header>Deploy a new Airdrop Manager</Card.Header>
            <Card.Description>
              Create a new Airdrop Manager for your community!
            </Card.Description>
          </Card.Content>
          <AdminPanelModal 
            network={ network } 
            accounts={ accounts } 
            isConnected={ isConnected }
            setCheckedInstances={ setCheckedInstances }
          />  
      </Card>
    </Grid.Row>

    <Grid.Row>
      <DeployedAirManList 
        network={ network } 
        accounts={ accounts }
        isConnected={ isConnected }
        instances={ instances }
        checkedInstances={ checkedInstances }
      />
    </Grid.Row>

    </Grid>
  );
};
  
export default AdminPanel;