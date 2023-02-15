import React, {useState} from 'react';
import { Grid, Card } from 'semantic-ui-react'
import { getInstanceInformation } from '../interactions/airmanSystem'
import AdminPanelModal from '../components/AdminPanel/Modal';
import { DeployedAirManList } from '../components/AdminPanel/DeployedAirMan';

async function fetchData(_accounts , _setInstances, _setCheckedInstances) {
  const _instances = await getInstanceInformation(_accounts);
  //console.log(_instances.length)
  //console.log(_instances)

  if (_instances) {
    //console.log('exito')
    _setInstances(_instances);
    _setCheckedInstances(true)
    //console.log(`test ${_instances.length} test2`)
  } else {
    console.log('fracaso')
  }

  return true
};

const AdminPanel = ({ network, accounts, isConnected }) => {
  const [instances, setInstances] = useState([]);
  const [checkedInstances, setCheckedInstances] = useState(false)
  
  if (!checkedInstances && accounts !== '' && isConnected) {
    fetchData(accounts, setInstances, setCheckedInstances);
    //console.log(`${instances.length} is a test ${checkedInstances}`)
    //console.log(instances)

  }

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
      <DeployedAirManList 
      network={ network } 
      accounts={ accounts }
      isConnected={ isConnected }
      instances={instances}
      checkedInstances={checkedInstances}
      />
    </Grid.Row>


    </Grid>
  );
};
  
export default AdminPanel;