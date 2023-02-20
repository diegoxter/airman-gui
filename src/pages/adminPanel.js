import React, { useState, useEffect } from 'react';
import { Grid, Card, Segment, Header } from 'semantic-ui-react';
import { getInstanceInformationByOwner } from '../interactions/airmanSystem';
import { LoadingCardGroup, NotConnectedMessage } from '../components/CommonComponents';
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
    <Grid divided='vertically' container>
      <Grid.Row>
        <Card style={{width: '528px'}} >
          <Grid celled='internally'>
          <Grid.Column width={12}>

          <Card.Content>
            <Header>Deploy a new Airdrop Manager</Header>
            <Card.Description>
              Create a new Airdrop Manager for your community!
            </Card.Description>
          </Card.Content>
          </Grid.Column>

          <Grid.Column width={3} >
        <div>
          <AdminPanelModal 
            network={ network } 
            accounts={ accounts } 
            isConnected={ isConnected }
            setCheckedInstances={ setCheckedInstances }
          /> 
        </div>
        </Grid.Column>

      </Grid>
      </Card>
    </Grid.Row>

    <Grid.Row>
      {(isConnected)
      ?
      <DeployedAirManList 
        network={ network } 
        accounts={ accounts }
        isConnected={ isConnected }
        instances={ instances }
        checkedInstances={ checkedInstances }
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
  
export default AdminPanel;