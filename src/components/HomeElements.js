import { useState } from 'react';
import { Card, Button, Accordion, Segment, Modal, Image, Header } from 'semantic-ui-react';
import { LoadingCardGroup, FetchingDataMessage, NoElementsFoundMessage, RefreshButton } from './CommonComponents';
import {
  joinAirdrop,
  retireFromAirdrop,
  claimAirdrop,
  isCampaignActive,
  getDetailedAirdropCampaignInfo
} from '../interactions/airdropSystem';
import { weiToEther, cleanAddress } from '../interactions';

export const CampaignModal = ({
  accounts,
  campaignAddress,
  campaignFee,
  campaignEndDate,
  isPrivate,
  canClaim,
  isUserBanned,
  hasClaimed,
  setParticipantDataChecked
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isActive = isCampaignActive(campaignEndDate);

  const handleJoinClick = () => {
    setIsLoading(true);
    joinAirdrop(campaignAddress, accounts, setIsLoading, setParticipantDataChecked);
  }

  const handleRetireClick = () => {
    setIsLoading(true);
    retireFromAirdrop(campaignAddress, accounts, setIsLoading, setParticipantDataChecked);
  }

  const handleClaim = () => {
    setIsLoading(true);
    claimAirdrop(campaignAddress, accounts, setIsLoading, setParticipantDataChecked)
    .then((value) => {
      setOpen(!value);
    })
  }

  const chooseButton = () => {
      if (canClaim) {
        return ["Claim", handleClaim];
      } else {
        return ['Retire', handleRetireClick];
      }
  }

  const drawAirdropCardContent = (hasCampaignFee) => {
    if (hasCampaignFee) {
      return (
        canClaim?
        `You will receive ${campaignFee} as refund ether after retiring`
        :
        `The fee to join the campaign is ${campaignFee} ether`
        );
    } else {
      return (
        canClaim?
        'No refund for retiring this campaign'
        :
        'No fee to join this campaign');
    }
  }

  const participationButtonContent = () => {
    if (isActive) {
      return ['green', 'Manage']
    } else {
      if (hasClaimed) {
        return ['violet', 'Claimed']
      } else {
        return ['red', 'Claim']
      }
    }
  }

  const drawModalButtonTrigger = () => {
    if (canClaim) {
      if (isUserBanned) {
        return (
        <Button
          basic
          disabled={true} // aqui
          color='red'
          content='You are banned'
        />
        );
      } else {
        return (
          <Button
            disabled={(hasClaimed)} // aqui
            color={(participationButtonContent())[0]}
            content={(participationButtonContent())[1]}
          />
        );
      }
    } else if (isPrivate) {
      return (
        <Button
          disabled
          basic
          color='grey'
          content='Private Campaign'
        />
      );
    } else {
      return (
        <Button
          disabled={!isActive}
          color={isActive?'green':'grey'}
          content={isActive?'Join Campaign':'Campaign Expired'}
        />
      );
    }
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
        drawModalButtonTrigger()
      }
    >
      <Modal.Header>
        {canClaim?'Retire from':'Join'} campaign
        <RefreshButton floated='right'/>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header content={drawAirdropCardContent(campaignFee > 0)}/>

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
              (canClaim)
              ? (chooseButton())[0]
              : "Click to join"
              }
            onClick={
              (canClaim)
              ? (chooseButton())[1]
              : handleJoinClick
              }
            color={
              (canClaim)
              ? 'red'
              : 'green'
              }
          />
        }
      </Modal.Actions>
    </Modal>
  )
}

const AirdropCampaignCard = ({
  accounts,
  campaignInfo,
  participantData,
  setParticipantDataChecked
}) => {
  const [ isPrivate, setIsPrivate ] = useState('');
  const [ canClaim, setCanClaim ] = useState('');
  const [ isUserBanned, setIsUserBanned ] = useState('');
  const [ checkedUserData, setCheckedUserData ] = useState(false);
  const [ hasClaimed, setHasClaimed] = useState('');

  if (accounts !== '' && !checkedUserData) {
    setCanClaim((participantData.address).toLowerCase() === accounts);
    setIsUserBanned(participantData.isBanned);
    setIsPrivate(campaignInfo.isPrivate[0]);
    setCheckedUserData(true);
  }

  if (hasClaimed === '') {
    setHasClaimed(participantData.claimed);
  }

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

  const getHumanDate = (unixtime) => {
    const date = new Date(unixtime * 1000);
    const options = { month: 'short', weekday: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const dateString = date.toLocaleString('en-US', options);

    return dateString.toString();
  }

  const getFeeAmount = () => {
    if (!isNaN(campaignInfo.whitelistFee) && campaignInfo.whitelistFee !== '') {
      return weiToEther(campaignInfo.whitelistFee)
    }
  }

  return(
    <Card style={{width:'280px', marginLeft:'60px', marginRight:'50px'}} >
      <Card.Content>

      <Card.Header>

        {
          (isCampaignActive(campaignInfo.claimableSince))
          ?
          <p>{`Active Placeholder` + ((isPrivate)? ' Private':'')}</p>
          :
          <s>{`Inactive Placeholder `+ ((isPrivate)? ' Private':'')}</s>
        }

      </Card.Header>

      <Card.Meta>
        <Image
          floated='right'
          size='tiny'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        Token address: <br/><b>{cleanAddress(campaignInfo.tokenAddress[0], 4, 38)}</b>
      </Card.Meta>

      <Card.Meta>
        Campaign address <br/><b>{cleanAddress(campaignInfo.campaignAddress, 4, 38)}</b>
      </Card.Meta>

      <Card.Meta>
        End date: <br/><b>{getHumanDate(campaignInfo.claimableSince)}</b><br/>
        Withdraw before: <br /> <b>{getHumanDate(campaignInfo.ownerTokenWithdrawDateCalls)} </b>
      </Card.Meta>

      <Card.Description>
      {
          (campaignInfo.whitelistFee > 0)
          ?
          <u><strong>{`Fee to join: ${getFeeAmount()} Ether`}</strong></u>
          :
          ``
      }

        <br/>Project description Placeholder
      </Card.Description>
      </Card.Content>

      <Card.Content extra>
        <div className='ui two buttons'>
          <CampaignModal
            isPrivate = { isPrivate }
            accounts={ accounts }
            campaignAddress={ campaignInfo.campaignAddress }
            campaignFee={ weiToEther(campaignInfo.whitelistFee) }
            campaignEndDate={ campaignInfo.claimableSince }
            canClaim={ canClaim }
            isUserBanned={ isUserBanned }
            hasClaimed={ hasClaimed }
            setParticipantDataChecked={ setParticipantDataChecked }
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
        }
      </Segment>
    );
  }
}

