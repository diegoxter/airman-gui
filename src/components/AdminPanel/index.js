import { Grid, Card, Segment, Divider, Checkbox, Button } from 'semantic-ui-react';
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
                <Card.Header content='Deploy a new Airdrop Manager' />
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

    <Grid.Row columns={'equal'}>
      <Grid.Column >
        <Checkbox toggle label='Show expired'/>
      </Grid.Column>
      
      <Grid.Column >
        <Checkbox toggle label='Show Claimed'/>
      </Grid.Column>
      
      <Grid.Column >
        <Checkbox toggle label='Show Claimable'/>
      </Grid.Column>

      <Button circular icon='refresh'/>

    </Grid.Row>

    <Grid.Row >
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