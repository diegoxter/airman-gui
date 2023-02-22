import { Grid, Card, Segment, Header, Divider } from 'semantic-ui-react';
import { LoadingCardGroup, NotConnectedMessage } from '../CommonComponents';
import { AdminPanelModal } from './DeployAirmanModal';
import { DeployedAirManList } from './DeployedAirManList';

const AirdropManagerTab = ({network, accounts, isConnected, checkedInstances, setCheckedInstances, instances}) => {
  return(
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
          <AdminPanelModal 
            network={ network } 
            accounts={ accounts } 
            isConnected={ isConnected }
            setCheckedInstances={ setCheckedInstances }
          /> 
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