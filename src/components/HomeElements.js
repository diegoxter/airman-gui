import { useState } from 'react';
import { Card, Button, Accordion, Segment, Modal, Image, Header } from 'semantic-ui-react';
import { getAirdropCampaignData, joinAirdrop, getWhitelistFee, isCampaignActive } from '../interactions/airdropSystem';
import { LoadingCardGroup, FetchingDataMessage, NoElementsFoundMessage } from './CommonComponents';

export const CampaignModal = ({ accounts, campaignAddress, campaignEndDate, participantData }) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState('')
  const [hasJoined, setHasJoined] = useState('')
  const [checkedHasJoined, setCheckedHasJoined] = useState(false)

  if (fee === '' && campaignAddress !== '') {
    getWhitelistFee(campaignAddress).then((value) => setFee(Number(value['_hex'])));
  }

  //console.log(participantData.address)

  if (!checkedHasJoined || hasJoined === '') {
    setHasJoined(participantData.address === accounts);
    setCheckedHasJoined(true);
  }
  //const test = (campaignAddress)

  const handleJoinClick = () => {
    setIsLoading(true);
    joinAirdrop(test, setIsLoading)
    .then(() =>{
      new Promise(r => setTimeout(r, 2500))
      .then(()=> setCheckedHasJoined(false))
    })
    console.log('Test join click');
  }

  const handleRetireClick = () => {
    console.log('Test retire click');
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
        color={(isCampaignActive(campaignEndDate))?'green':'red'}
        content={(isCampaignActive(campaignEndDate))?'Manage':'Claim'}
      />
      :
      <Button
        disabled={!(isCampaignActive(campaignEndDate))} 
        color={isCampaignActive(campaignEndDate)?'green':'grey'}
        content={isCampaignActive(campaignEndDate)?'Check Campaign':'Campaign Expired'}
      />
      }
    >
      <Modal.Header>Airdrop campaign management</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            Fee to join {fee} ether
          </Header>
          <p>
            Placeholder
          </p>
          <p>Placeholder</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
        Placeholder
        </Button>
        { (isLoading)
        ?
          <Button basic loading />
        :
          <Button
            content={
              (hasJoined)
              ? "Placeholder"
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
          (isCampaignActive(campaignInfo.claimableSince['_hex']))
          ?
          `Placeholder`
          :
          <s>{`Placeholder`}</s> 
        }

      </Card.Header>

      <Card.Meta>
        <Image
          floated='right'
          size='tiny'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        Token address: <br/><b>{cleanAddress(campaignInfo.tokenAddress)}</b>
      </Card.Meta>

      <Card.Meta>
        Campaign address <br/><b>{cleanAddress(campaignInfo.campaignAddress)}</b>
      </Card.Meta>
      
      <Card.Meta>
        End date: <br/><b>{getHumanDate(Number(campaignInfo.claimableSince['_hex']))}</b><br/>
      </Card.Meta>

      <Card.Description>
      {
          (campaignInfo.acceptPayableWhitelist)
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
          campaignEndDate={ campaignInfo.claimableSince['_hex'] }
          participantData={ participantData } /> 
        </div>
        <Accordion panels={panels}/>

      </Card.Content>
    </Card>
  );
}

export const AirdropList = ({ network, accounts, isConnected }) => {
  const [campaignData, setCampaignData] = useState([]);
  const [campaignDataChecked, setCampaignDataChecked] = useState(false);
  const [participantData, setParticipantData] = useState([]);
  const [participantDataChecked, setParticipantDataChecked] = useState(false);

  if (network !== '' && accounts !== '' && campaignDataChecked === false && participantDataChecked === false) {
    getAirdropCampaignData(network, accounts)
    .then((result) => {
      setCampaignData(result[0]);
      setCampaignDataChecked(true);
      //console.log(result[1])
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

