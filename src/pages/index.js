import { useState } from 'react';
import { Checkbox, Grid, Card, Segment } from 'semantic-ui-react';
import { LoadingCardGroup, NotConnectedMessage, RefreshButton, FetchingDataMessage, NoElementsFoundMessage } from '../components/CommonComponents';
import { AirdropCampaignCard } from '../components/HomeElements';
import { getDetailedAirdropCampaignInfo } from '../interactions/airdropSystem';

const AirdropList = ({
  network,
  accounts,
  campaignDataChecked,
  setCampaignDataChecked,
  participantDataChecked,
  setParticipantDataChecked
}) => {
  const [ campaignData, setCampaignData ] = useState([]);
  const [ participantData, setParticipantData ] = useState([]);

  if (campaignDataChecked === false || participantDataChecked === false) {
    if (network !== '' && accounts !== '') {
     getDetailedAirdropCampaignInfo(network, accounts)
     .then((result) => {
       setCampaignData(result[0]);
       setCampaignDataChecked(true);
       setParticipantData(result[1]);
       setParticipantDataChecked(true);
     })
    }
   }

  if (campaignDataChecked === false) {
    return(
      <Segment style={{width:'96%'}}>
        <FetchingDataMessage />
        <LoadingCardGroup />

      </Segment>
    );
  } else if (campaignData.length === 0) {
    return(
      <Segment style={{width:'99%'}}>
        <NoElementsFoundMessage whatIsBeingLookedFor='Active Airdrop Campaigns'/>
        <LoadingCardGroup />
      </Segment>
    );
  } else {
    return (
      <Segment style={{width:'100%'}}>
        <Card.Group>
          {campaignData.map((campaignInfo, index) => (
            <AirdropCampaignCard
              key={ campaignInfo.campaignAddress }
              accounts={ accounts }
              campaignInfo={ campaignInfo }
              participantData={ participantData[index] }
              setParticipantDataChecked={ setParticipantDataChecked }
            />
          ))}
        </Card.Group>
      </Segment>
    );
  }
}


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