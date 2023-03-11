import { Checkbox, Grid, Card, Segment } from 'semantic-ui-react';
import { LoadingCardGroup, NotConnectedMessage, RefreshButton } from '../components/CommonComponents';
import { AirdropList } from '../components/HomeElements';
import { useState } from 'react';

const Home = ({ isConnected, network, accounts }) => {
  const [ campaignDataChecked, setCampaignDataChecked ] = useState(false);
  const [ participantDataChecked, setParticipantDataChecked ] = useState(false);

  const handleRefreshClick = () => {
    setCampaignDataChecked(false);
    setParticipantDataChecked(false);
  }

  return (
    <Grid divided='vertically' style={{width: '96%'}}>
      <Grid.Row>
        <Card
          style={{
            display: 'flex',
            justifyContent: 'Right',
            alignItems: 'Right',
            height: '150px',
            width: '480px'
          }}
        >
          <Card.Content>
            <Card.Header>Placeholder</Card.Header>
          </Card.Content>
        </Card>
      </Grid.Row>

      <Grid.Row columns='equal'>
        <Grid.Column>
          <Checkbox toggle label='Show expired'/>
        </Grid.Column>

        <Grid.Column>
          <Checkbox toggle label='Show Claimed'/>
        </Grid.Column>

        <Grid.Column>
          <Checkbox toggle label='Show Claimable'/>
        </Grid.Column>

        <RefreshButton color='blue' execOnClick={handleRefreshClick}/>
      </Grid.Row>

      <Grid.Row>
        {
          (isConnected)
          ?
          <AirdropList
            network={ network }
            accounts={ accounts }
            campaignDataChecked={ campaignDataChecked }
            setCampaignDataChecked={ setCampaignDataChecked }
            participantDataChecked={ participantDataChecked }
            setParticipantDataChecked={ setParticipantDataChecked }
          />
          :
          <Grid.Column >
            <Segment style={{width:'96%'}}>
              <NotConnectedMessage/>
              <LoadingCardGroup/>
            </Segment>
          </Grid.Column>
        }

      </Grid.Row>
    </Grid>
  );
};

export default Home;