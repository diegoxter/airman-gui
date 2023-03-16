import { useState } from 'react';
import { Grid, Card, Segment, Divider, Checkbox } from 'semantic-ui-react';
import { LoadingCardGroup, NotConnectedMessage, RefreshButton } from '../CommonComponents';
import { AdminPanelModal } from './DeployAirmanModal';
import { AdminModal } from './AdminModal';
import { DeployedAirManList } from './DeployedAirManList';
import { getInstanceInfoByOwner, isAdminAddress, getAirManInstancesMetadata } from '../../interactions/airmanSystem';

const AirdropManagerTab = ({ network, accounts, isConnected }) => {
  const [ isAdmin, setIsAdmin ] = useState('')
  const [ instances, setInstances ] = useState('');
  const [ checkedInstances, setCheckedInstances ] = useState(false);
  const [ instancesMetadata, setInstancesMetadata ] = useState([]);
  const [ instancesMetadataChecked, setInstancesMetadataChecked ] = useState(false)

  if (network !== '' && accounts !== '' && checkedInstances === false) {
    getInstanceInfoByOwner(network, accounts)
    .then((value) => {
      setInstances(value);
      setCheckedInstances(true);
    })

    if (isAdmin === '') {
      isAdminAddress(network, accounts)
      .then((value) => setIsAdmin(value))
    }

  }

  if (network !== '' && instances !== '' && instancesMetadataChecked === false ) {
    getAirManInstancesMetadata(network, instances)
    .then((result, i) => {
      const tempArray = []

      for (let index = 0; index < result.length; index++) {
        tempArray[index] = (result[index])[1];
      }

      setInstancesMetadata(tempArray)
      setInstancesMetadataChecked(true)
    })
  }

  const handleRefreshClick = () => {
    setInstances('');
    setCheckedInstances(false);
    setInstancesMetadataChecked(false);
  }

  return(
    <Grid divided='vertically'>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Card style={{width: '85%'}}>
            <Grid celled='internally'>
              <Grid.Column width={11}>

                <Card.Content>
                  <Card.Header content='Deploy a new Airdrop Manager'/>
                  <Card.Description>
                    Create a new Airdrop Manager for your community!
                  </Card.Description>
                </Card.Content>
              </Grid.Column>

              <Grid.Column width={5}>
                <AdminPanelModal
                  network={ network }
                  accounts={ accounts }
                  isConnected={ isConnected }
                  setInstances={ setInstances }
                  setCheckedInstances={ setCheckedInstances }
                  setInstancesMetadataChecked={ setInstancesMetadataChecked }
                />
              </Grid.Column>
            </Grid>
          </Card>
        </Grid.Column>

        {(isConnected  && isAdmin)
        ?
        <Grid.Column>
          <Card style={{width: '55%'}}>
            <Grid celled='internally'>
              <Grid.Column width={10}>

                <Card.Content>
                  <Card.Header content='Owner space'/>
                  <Card.Description>
                    Manage the Admin Panel!
                  </Card.Description>
                </Card.Content>
              </Grid.Column>

              <Grid.Column width={5}>
                <AdminModal style={{width: '90%'}} network={ network }/>
              </Grid.Column>
            </Grid>
          </Card>
        </Grid.Column>
        :
        false
        }
      </Grid.Row>

      <Grid.Row columns={'equal'}>
        <Grid.Column>
          <Checkbox toggle label='Show empty'/>
        </Grid.Column>

        <RefreshButton color='blue' execOnClick={handleRefreshClick}/>

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
        instancesMetadata={ instancesMetadata }
        instancesMetadataChecked={ instancesMetadataChecked }
      />
      :
      <Grid.Column >
        <Segment>
          <NotConnectedMessage />
          <Divider hidden />
          <LoadingCardGroup />
        </Segment>
      </Grid.Column>
      }

      </Grid.Row>
    </Grid>
  );
}

export default AirdropManagerTab