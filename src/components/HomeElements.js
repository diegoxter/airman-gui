import { useState } from 'react';
import { Card, Button, Modal, Image, Header } from 'semantic-ui-react';
import { RefreshButton, ProjectInfo } from './CommonComponents';
import { joinAirdrop, retireFromAirdrop, claimAirdrop, isCampaignActive } from '../interactions/airdropSystem';
import { weiToEther, cleanAddress, readJSONFromIPFS } from '../interactions';
import { getAirManMetadata } from '../interactions/airmanSystem';

export const CampaignModal = ({
  accounts,
  campaignAddress,
  campaignFee,
  campaignEndDate,
  isPrivate,
  canClaim,
  isUserBanned,
  hasClaimed,
  setCanClaim,
  projectInfoJSON
}) => {
  const [ open, setOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const isActive = isCampaignActive(campaignEndDate);

  const handleJoinClick = () => {
    setIsLoading(true);
    joinAirdrop(campaignAddress, accounts, setIsLoading)
    .then((result) => setCanClaim(result))
  }

  const handleRetireClick = () => {
    setIsLoading(true);
    retireFromAirdrop(campaignAddress, accounts, setIsLoading)
    .then((result) => setCanClaim(!result))
  }

  const handleClaim = () => {
    setIsLoading(true);
    claimAirdrop(campaignAddress, accounts, setIsLoading)
    .then((value) => {
      setOpen(!value);
    })
  }

  const chooseButton = () => {
      if (canClaim && isActive) {
        return ['Retire', handleRetireClick];
      } else {
        return ["Claim", handleClaim];
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
        return ( <Button basic disabled={true} color='red' content='You are banned'/> );
      } else {
        return (
          <Button
            disabled={(hasClaimed)}
            color={(participationButtonContent())[0]}
            content={(participationButtonContent())[1]}
          />
        );
      }
    } else if (isPrivate) {
      return (
        <Button disabled basic color='grey' content='Private Campaign'/>
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
      size='small'
      dimmer='inverted'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={ drawModalButtonTrigger() }
    >
      <Modal.Header>
        {canClaim?'Retire from':'Join'} campaign
        <RefreshButton floated='right'/>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header content={drawAirdropCardContent(campaignFee > 0)}/>
           <ProjectInfo projectInfoSource={ projectInfoJSON } drawButton={false}/>
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

export const AirdropCampaignCard = ({
  network,
  accounts,
  campaignInfo,
  participantData
}) => {
  const [ isPrivate, setIsPrivate ] = useState('');
  const [ canClaim, setCanClaim ] = useState('');
  const [ isUserBanned, setIsUserBanned ] = useState('');
  const [ checkedUserData, setCheckedUserData ] = useState(false);
  const [ hasClaimed, setHasClaimed] = useState('');
  const [ instancesImageData, setInstancesImageData ] = useState([]);
  const [ instancesProjectInfo, setInstancesProjectInfo ] = useState([]);
  const [ instancesMetadataChecked, setInstancesMetadataChecked ] = useState(false)
  const [ projectInfoJSON, setProjectInfoJSON ] = useState('');

  if (accounts !== '' && !checkedUserData) {
    setCanClaim((participantData.address).toLowerCase() === accounts);
    setIsUserBanned(participantData.isBanned);
    setIsPrivate(campaignInfo.isPrivate[0]);
    setCheckedUserData(true);
  }

  if (network !== '' && instancesMetadataChecked === false ) {
    getAirManMetadata(network, campaignInfo.airManAddress[0])
    .then((result) => {
      setInstancesImageData(result[1]);
      readJSONFromIPFS(result[0])
      .then((json) => {
        setProjectInfoJSON(json);
        setInstancesMetadataChecked(true);
      })
      .catch((error) => {
        console.error(error);
      });
    })
  }

  if (hasClaimed === '') {
    setHasClaimed(participantData.claimed);
  }

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
    <Card style={{width:'280px', marginLeft:'40px', marginRight:'50px'}} >
      <Card.Content>

      <Card.Header>

        {
          (isCampaignActive(campaignInfo.claimableSince))
          ?
          <p>{(projectInfoJSON.name) + ((isPrivate)? ' Private':'')}</p>
          :
          <s>{(projectInfoJSON.name)+ ((isPrivate)? ' Private':'')}</s>
        }

      </Card.Header>

      <Card.Meta>
        <Image
          floated='right'
          size='tiny'
          src={`https://testairdropman.infura-ipfs.io/ipfs/${instancesImageData[0]}`}
        />
        Token address: <br/><b>{cleanAddress(campaignInfo.tokenAddress[0], 4, 38)}</b>
      </Card.Meta>

      <Card.Meta>
        Campaign address <br/><b>{cleanAddress(campaignInfo.campaignAddress, 4, 38)}</b>
      </Card.Meta>

      <Card.Meta>
        Claim date: <br/><b>{getHumanDate(campaignInfo.claimableSince)}</b><br/>
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
            setCanClaim={ setCanClaim }
            projectInfoJSON={ projectInfoJSON }
          />
        </div>

      </Card.Content>
    </Card>
  );
}