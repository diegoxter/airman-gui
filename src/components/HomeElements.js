import { useState } from 'react';
import { Card, Button, Accordion, Segment, Modal, Image, Header } from 'semantic-ui-react'
import { getAirdropCampaignData } from '../interactions/airdropSystem';
import { LoadingCardGroup } from './AdminPanel/Modal Elements/DeployedListElements'

export const JoinCampaignModal = ({ campaignInfo, isCampaignActive }) => {
  const [open, setOpen] = useState(false)

  const handleJoinClick = () => {
    console.log('Test join click')
  }

  return (
    <Modal
      size='mini'
      dimmer='inverted'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button
        disabled={!(isCampaignActive(campaignInfo))} 
        color={isCampaignActive(campaignInfo)?'green':'grey'}
        content={isCampaignActive(campaignInfo)?'Join':'Expired'}
      >
      </Button>}
    >
      <Modal.Header>Placeholder</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Placeholder</Header>
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
        <Button
          content="Placeholder"
          labelPosition='right'
          icon='checkmark'
          onClick={() => handleJoinClick()}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

const AirdropCampaignCard = ({ campaignInfo }) => {
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

  const isCampaignActive = (_campaignInfo) => {
    return (Number(_campaignInfo.claimableSince['_hex']) * 1000 > Date.now())
  }

  return(
    <Card style={{
      width:'250px'
    }}>
      <Card.Content>

      <Card.Header>

        {
          (isCampaignActive(campaignInfo))
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
          <JoinCampaignModal campaignInfo={ campaignInfo } isCampaignActive={ isCampaignActive }/> 
        </div>
        <Accordion panels={panels}/>

      </Card.Content>
    </Card>
  )
}

export const AirdropList = ({ network, accounts, isConnected }) => {
  const [campaignData, setCampaignData] = useState([]);
  const [campaignDataChecked, setCampaignDataChecked] = useState(false)

  if (network !== '' && campaignDataChecked === false) {
    getAirdropCampaignData(network)
    .then((result) => {
      setCampaignData(result)
      setCampaignDataChecked(true)
    })
  }

  return(
    <Segment loading={!isConnected}
      style={{width:'96%'}}>
      { (campaignData.length === 0)
      ?
        <LoadingCardGroup />      
      :
        <Card.Group itemsPerRow={2}>

        {campaignData.map((campaignInfo, index) => (
          <AirdropCampaignCard key={campaignInfo.campaignAddress} campaignInfo={campaignInfo} />
        ))}

        </Card.Group>
      }
    </Segment>
  )
}