import { useState } from 'react';
import { Card, Button, Accordion, Segment, Modal, Image, Header } from 'semantic-ui-react';
import { LoadingCardGroup, FetchingDataMessage, NoElementsFoundMessage } from './CommonComponents';
import { 
  joinAirdrop,
  retireFromAirdrop,
  isCampaignActive,
  getAirdropCampaignInfo,
  checkParticipation
} from '../interactions/airdropSystem';

export const CampaignModal = ({ 
  accounts,
  campaignAddress,
  campaignFee,
  campaignEndDate
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState('');
  const [checkedHasJoined, setCheckedHasJoined] = useState(false);

  const isActive = isCampaignActive(campaignEndDate);

  if (!checkedHasJoined && accounts !== '' && campaignAddress !== '') {
    checkParticipation(campaignAddress, accounts)
    .then((result) => { //console.log(result)
      setHasJoined(result);
      new Promise(r => setTimeout(r, 2500))
        .then(() => setCheckedHasJoined(true))
    })
  }

  const handleJoinClick = () => {
    setIsLoading(true);
    joinAirdrop(campaignAddress, setIsLoading, setHasJoined);
  }

  const handleRetireClick = () => {
    setIsLoading(true);
    retireFromAirdrop(campaignAddress, setIsLoading, setHasJoined);
  }

  const handleClose = () => {

  }

  return (
    <Modal
      size='mini'
      dimmer='inverted'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger=
      {
        (hasJoined) ?
      <Button
        color={(isActive)?'green':'red'}
        content={(isActive)?'Manage':'Claim'}
      />
      :
      <Button
        disabled={!isActive} 
        color={isActive?'green':'grey'}
        content={isActive?'Check Campaign':'Campaign Expired'}
      />
      }
    >
      <Modal.Header>Airdrop campaign management (Placeholder)</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header content={(campaignFee > 0)?'Fee to join {campaignFee} ether': 'No fee to join' }/>
            
          <p>
            Placeholder
          </p>
          <p>Placeholder</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='grey' onClick={() => setOpen(false)}>
        Close
        </Button>
        { (isLoading)
        ?
          <Button color='black' loading content='PLACEH'/>
        :
          <Button
            content={
              (hasJoined)
              ? "Retire"
              : "Join"}
            onClick={
              (hasJoined)
              ? handleRetireClick
              : handleJoinClick}
            color={
              (hasJoined)
              ? 'red'
              : 'green'}
          />
        }
      </Modal.Actions>
    </Modal>
  )
}

const AirdropCampaignCard = ({ accounts, campaignInfo, participantData }) => {
  const panels = [
    {
      key: 'content',
      title: {
        content: 'Project information',
      },
      content: {
        content: (
          <span>
            Project page:     PLACEHOLDER <br/>
            Project Twitter:  PLACEHOLDER <br/>
            Project Telegram: PLACEHOLDER <br/>
            Project Discrod:  PLACEHOLDER <br/>
          </span>
        ),
      },
    },
  ];

  const cleanAddress = (_address) => {
    let firstHalf = _address.substr(0, 4);
    let secondHalf = _address.substr(38, 4);

    return firstHalf+'...'+secondHalf;
  }

  const getHumanDate = (unixtime) => {
    const date = new Date(unixtime * 1000);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const dateString = date.toLocaleString('en-US', options);

    return dateString.toString();
  }

  return(
    <Card style={{
      width:'250px'
    }}>
      <Card.Content>

      <Card.Header>

        {
          (isCampaignActive(campaignInfo.claimableSince))
          ?
          `Active Placeholder`
          :
          <s>{`Inactive Placeholder`}</s> 
        }

      </Card.Header>

      <Card.Meta>
        <Image
          floated='right'
          size='tiny'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        Token address: <br/><b>{cleanAddress(campaignInfo.tokenAddress[0])}</b>
      </Card.Meta>

      <Card.Meta>
        Campaign address <br/><b>{cleanAddress(campaignInfo.campaignAddress)}</b>
      </Card.Meta>
      
      <Card.Meta>
        End date: <br/><b>{getHumanDate(campaignInfo.claimableSince)}</b><br/>
      </Card.Meta>

      <Card.Description>
      {
          (campaignInfo.acceptPayableWhitelist[0])
          ?
          <u><strong>{'Fee to join: '+campaignInfo.whitelistFee}</strong></u>
          :
          ``
      }

        <br/>Project description Placeholder 
      </Card.Description>
      </Card.Content>

      <Card.Content extra>
        <div className='ui two buttons'>
          <CampaignModal 
            accounts={ accounts }
            campaignAddress={ campaignInfo.campaignAddress }
            campaignFee={ campaignInfo.whitelistFee }
            campaignEndDate={ campaignInfo.claimableSince }
          /> 
        </div>
        <Accordion panels={panels}/>

      </Card.Content>
    </Card>
  );
}

export const AirdropList = ({ network, accounts }) => {
  const [campaignData, setCampaignData] = useState([]);
  const [campaignDataChecked, setCampaignDataChecked] = useState(false);
  const [participantData, setParticipantData] = useState([]);
  const [participantDataChecked, setParticipantDataChecked] = useState(false);

  if (network !== '' && accounts !== '' && campaignDataChecked === false && participantDataChecked === false) {
   getAirdropCampaignInfo(network, accounts)
    .then((result) => {
      setCampaignData(result[0]);
      setCampaignDataChecked(true);
      setParticipantData(result[1]);
      setParticipantDataChecked(true);
    })
  }

  if (campaignDataChecked === false) {
    return(
      <Segment style={{width:'96%'}}>
        <FetchingDataMessage />
        <LoadingCardGroup />  

      </Segment>   
    );
  } else {
    return(
      <Segment style={{width:'96%'}}>
        { 
        (campaignData.length === 0)
        ?
        <div>
          <NoElementsFoundMessage whatIsBeingLookedFor='Active Airdrop Campaigns'/>
          <LoadingCardGroup />
        </div> 
        :
        <Card.Group itemsPerRow={2}>
  
        {campaignData.map((campaignInfo, index) => (
          <AirdropCampaignCard 
          key={ campaignInfo.campaignAddress }
          accounts={ accounts }
          campaignInfo={ campaignInfo }
          participantData={ participantData[index] } />
        ))}
        </Card.Group>
        }
      </Segment>
    );
  }
}

