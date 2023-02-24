import { useState } from 'react';
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { 
  deployAirdropCampaign,
  getCampaignInfo,
  fetchEtherBalance,
  manageAirmanFunds
} from '../../../interactions/airmanSystem';
import { withdrawCampaignTokens } from '../../../interactions/airdropSystem';
import { checkBalance, sendTokens, getTokenInfo } from '../../../interactions/erc20';
import { LoadingCardGroup, NoElementsFoundMessage, FetchingDataMessage } from '../../CommonComponents';
import { 
    Card, 
    Button, 
    Grid, 
    Segment,
    Modal,
    Header,
    Form,
    Checkbox,
    Popup,
    Input,
    Divider,
    Accordion
} from 'semantic-ui-react';

const sleep = ms => new Promise(r => setTimeout(r, ms));

export const ManageAssetsPopup = ({
  setPopUpOpen,
  accounts,
  instanceAddress,
  instanceToken,
  setIsLoading,
  userTokenBalance,
  tokenBalance,
  setTokenBalance,
  etherBalance,
  setEtherBalance
 }) => {
  const [amount, setAmount] = useState('');
  const [amountInputValue] = useDebounce(amount, 600);
  const [isValidAmount, setIsValidAmount] = useState(false);

  const handleAmountChange = (num) => {
    setAmount(num);
    setIsValidAmount(!isNaN(num) && num > 0);
  }

  const handleSendClick = () => {
    setIsLoading(true);
    sendTokens(accounts, instanceToken, instanceAddress, Number(amountInputValue), setIsLoading)
    .then((value) => {
      if (value === true) {
        setPopUpOpen(false);
        sleep(5500)
        .then(() => setTokenBalance(''))
      }
    })
  }

  const handleWithdrawTokensClick = () => {
    manageAirmanFunds(instanceAddress, 1, setIsLoading)
    .then(() => {
      setPopUpOpen(false);
      sleep(5500)
      .then(() => setTokenBalance(''))
    })
  }

  const handleWithdrawEtherClick = () => {
    manageAirmanFunds(instanceAddress, 0, setIsLoading)
    .then(() => {
      setPopUpOpen(false);
      let sleep = ms => new Promise(r => setTimeout(r, ms));

      sleep(3500)
      .then(() => setEtherBalance(''))
    })    
  }


  return (
    <Grid divided='vertically'>
      <Grid.Row>
        <Grid.Column>
          <h4>Refill tokens</h4>
          <Input fluid placeholder='Amount to send...' onChange={(e) => handleAmountChange(e.target.value)}/>
          <Divider hidden />
          {(Number(amountInputValue) === 0 || userTokenBalance < Number(amountInputValue) || !isValidAmount)
          ?
          <Button fluid size='tiny' content="Invalid token amount" disabled />
          :
          <Button fluid size='tiny' color='green' content='Send' onClick={() => {handleSendClick();}} />
          }
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          {(tokenBalance > 0)
          ?
          <Button fluid size='tiny' color='red' content='Withdraw tokens' onClick={() => {handleWithdrawTokensClick()}} />
          :
          <Button fluid size='tiny' content="No tokens to withdraw" disabled />
          }
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <h4>Ether in contract</h4>
            <Segment>
              {(etherBalance > 0)?ethers.utils.formatEther(etherBalance.toString())+' ETH': '0 ETH'} 
            </Segment>
          <Divider hidden />
          <Button fluid size='tiny' color={(etherBalance === 0 || etherBalance==='')?'grey':'orange'} content='Withdraw Ether' onClick={handleWithdrawEtherClick} disabled={(etherBalance === 0 || etherBalance === '')}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}


export const NewAirdropModal = ({
  instanceAddress,
  tokenBalance,
  setTokenBalance,
  tokenSymbol,
  isLoading,
  setIsLoading,
  setCampaignDataChecked
  }) => {
  const [open, setOpen] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState('');
  const [hasValidTimeAmounts, setHasValidTimeAmounts] = useState(false);
  const [amountToAirdrop, setAmountToAirdrop] = useState('');
  const [hasValidAmounts, setHasValidAmounts] = useState(false);
  const [hasFixedAmount, setHasFixedAmount] = useState(false);
  const [amountPerParticipant, setAmountPerParticipant] = useState('');
  const [hasValidAmountPerParticipant, setHasValidAmountPerParticipant] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setTimeInSeconds('');
    setAmountToAirdrop('');
    setTokenBalance('');
  }

  const handleCheckboxChange = () => {
    if (hasFixedAmount) {
      setHasFixedAmount(false);
    } else {
      setHasFixedAmount(true);
    }
  }

  const handleTimeChange = (value) => {
    setTimeInSeconds(Number(value));
    setHasValidTimeAmounts(!isNaN(value) && Number(value) > 0);
  }

  const handleAmountToAirdropChange = (value) => {
    setAmountToAirdrop(Number(value));
    setHasValidAmounts(!isNaN(value) && Number(value) > 0);
  }

  const handleAmountPerParticipantChange = (value) => {
    setAmountPerParticipant(Number(value));
    setHasValidAmountPerParticipant(!isNaN(value) && Number(value) > 0 && Number(value) < amountToAirdrop);
  }

  const handleDeployClick = () => {
    setIsLoading(true);
    let parsedAmountPerParticipant = 0;

    if (hasFixedAmount) {
      parsedAmountPerParticipant = Number(amountPerParticipant);
    }

    deployAirdropCampaign(
      instanceAddress, 
      Number(timeInSeconds), 
      Number(amountToAirdrop), 
      hasFixedAmount, 
      parsedAmountPerParticipant, 
      setIsLoading)
    .then(() => {
      handleClose();
      setCampaignDataChecked(false);
    })
  }

  return (
    <Modal
      closeIcon
      size='tiny'
      open={open}
      trigger={<Button color='olive'> Deploy new airdrop </Button>}
      onClose={() => handleClose()}
      onOpen={() => setOpen(true)}
    >
      <Header> Tokens held in AirMan: <u>{tokenBalance} {tokenSymbol}</u></Header >

      <Modal.Content>
        <Form>
          <Form.Field      
            error={(!hasValidTimeAmounts)}
            onChange={(e) => handleTimeChange(e.target.value)}>
            <label>Time (in seconds) to end the campaign:</label>
            <input placeholder='Seconds to end the campaign...' />
          </Form.Field>

          <Form.Field
            error={(!hasValidAmounts || amountToAirdrop > tokenBalance)}
            onChange={(e) => handleAmountToAirdropChange(e.target.value)} >
            <label>Total amount to airdrop</label>
            <input placeholder='Tokens to give...' />
          </Form.Field>

          <Form.Field>
            <Checkbox 
            label='Has fixed amount per user?'
            onChange={() => handleCheckboxChange()} 
            />
          </Form.Field>

          {(hasFixedAmount)
          ?
          <Form.Field
            onChange={(e) => handleAmountPerParticipantChange(e.target.value)}
            error={!hasValidAmountPerParticipant}>
            <label>Amount for each participant</label>
            <input placeholder='Amount...' />
          </Form.Field>
          :
          <Form.Field disabled>
            <label>Amount for each participant</label>
            <input placeholder='Amount...' />
          </Form.Field>}
        </Form>
      </Modal.Content>
      
      <Modal.Actions>
        <Button color='red' onClick={() => handleClose()}>
          Cancel
        </Button>
        {
        (!hasValidAmounts || !hasValidTimeAmounts || (hasFixedAmount && !hasValidAmountPerParticipant))
        ?
        <Button
        color='grey'
        disabled
        content='Insert amount' />
        :
        <Button
        loading={isLoading}
        color={
          ((amountToAirdrop > tokenBalance || !hasValidAmounts || (hasFixedAmount && !hasValidAmountPerParticipant)))
          ? 'red' : 'green'} 
        disabled={
          (
            (amountToAirdrop > tokenBalance || !hasValidAmounts || (hasFixedAmount && !hasValidAmountPerParticipant)))
          ? true : false}
        content={
          ((amountToAirdrop > tokenBalance || !hasValidAmounts || !hasValidTimeAmounts))
          ? 'Invalid data' : 'Deploy'} 
        onClick={() => handleDeployClick()} />
        }
      </Modal.Actions>
    </Modal>
  );
}

const CampaignAccordionOptions = () => {

  return(
    <div>
      isActive <br/> acceptPayableWhitelist <br/> whitelistFee <br/> maxParticipantAmount
      <br/> amountForEachUser
    </div>
  );
}

const AddUsersPopup = () => {

  const handleAddClick = () => {
    console.log('Test add button')
  }

  return (
    <div>
        <Form>
          <Form.Field>
            <label>Insert the to-be-add addresses separated by comma</label>
            <input placeholder='Addressess' />
          </Form.Field>
        </Form>

        <Divider hidden />

        <Button fluid color='teal' onClick={handleAddClick}>
            Add
        </Button>
    </div>
  )
}

const BanUsersPopup = () => {

  const handleBanClick = () => {
    console.log('Test ban button')
  }

  return (
    <div>
        <Form>
          <Form.Field>
            <label>Insert the to-be-banned addresses separated by comma</label>
            <input placeholder='Addressess' />
          </Form.Field>
        </Form>

        <Divider hidden />

        <Button fluid color='red' onClick={handleBanClick}>
            Ban
        </Button>
    </div>
  )
}

const DeployedCampaignCard = ({
  campaignInfo,
  instanceToken,
  isCampaignActive,
  tokenSymbol,
  cleanAddress,
  getHumanDate,
  checkedBalance,
  tokenBalance,
  setTokenBalance,
  setIsLoading
}) => {
  const [campaignBalance, setCampaignBalance] = useState('')

  if (campaignBalance === '' || checkedBalance === false) {
    checkBalance(campaignInfo.campaignAddress, instanceToken)
    .then((result) => {
      setCampaignBalance(result);
    });
   };

  const handleWithdrawTokens = () => {
    setIsLoading(true)
    withdrawCampaignTokens(campaignInfo.campaignAddress, setIsLoading)
    .then((value) => {
      if (value === true) {
        sleep(5500)
        .then(() => setTokenBalance(''))
      }
    })
  }

  // TO DO finish this
  const panels = [
  {
    key: 'content',
    title: {content: 'Manage campaign options'},
    content: {content: (
      <div>
        <Segment vertical>
          <CampaignAccordionOptions />
        </Segment>
        
        <Segment vertical>
          <Button fluid color={'blue'} content='Save' />
        </Segment>
      </div>
    )}}];

  return(
    <Card key={Number(campaignInfo.campaignID['_hex'])}>
      <Card.Content>

      <Card.Header>
        {
          (isCampaignActive(campaignInfo))
          ?
          `Campaign #${Number(campaignInfo.campaignID['_hex'])}`
          :
          <s>{`Campaign #${Number(campaignInfo.campaignID['_hex'])}`}</s>
        }
      </Card.Header>

      <Card.Meta>{`Total amount to airdrop ${campaignInfo.amountToAirdrop} ${tokenSymbol}`}</Card.Meta>
      <Card.Meta>{`Amount in contract ${campaignBalance} ${tokenSymbol}`}</Card.Meta>

      <Card.Meta>Campaign address <b>{cleanAddress(campaignInfo.campaignAddress)}</b></Card.Meta>

      <Card.Description>
      {
          (isCampaignActive(campaignInfo))
          ?
          `End date: ${getHumanDate(Number(campaignInfo.endDate['_hex']))}`
          :
          `End date: Expired`
      }
      <br />Participants <br /> Unclaimed
      </Card.Description>
      </Card.Content>

      <Card.Content extra>
        {(isCampaignActive(campaignInfo))
        ?
        <div className='ui two buttons'>
          <Popup
            content={<AddUsersPopup position='top center' />}
            on='click'
            pinned
            trigger={<Button color='teal' content='Add users' />}
          />      

          <Popup
            content={<BanUsersPopup position='top center' />}
            on='click'
            pinned
            trigger={<Button color='red' content='Ban users' position='top right' />}
          /> 
        </div>
        :
        <div>
        <Button 
        disabled={campaignBalance === 0} 
        color={(campaignBalance === 0)? 'grey': 'teal'} 
        fluid 
        onClick={handleWithdrawTokens}
        content={(campaignBalance === 0)? 'No tokens to withdraw': 'Withdraw leftover tokens'}>
          
        </Button>
      </div>
      }

        <Accordion panels={panels}/>

      </Card.Content>
    </Card>
  )
}


export const DeployedAirdropModal = ({ accounts, network, instanceNumer, instanceAddress, instanceToken }) => {
  const [open, setOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [campaignDataChecked, setCampaignDataChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [userTokenBalance, setUserTokenBalance] = useState('')
  const [etherBalance, setEtherBalance] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [checkedBalance, setCheckedBalance] = useState(false);

  if (etherBalance === '') {
    fetchEtherBalance(instanceAddress)
    .then((value) => {
      setEtherBalance(Number(value['_hex']))
    })
  }

  if (userTokenBalance === '') {
    checkBalance(accounts, instanceToken)
    .then((value) => {setUserTokenBalance(value)})
  }

  if (open && !campaignDataChecked) {
    getCampaignInfo(network, instanceAddress)
    .then((value) => {
      setCampaignData(value);
      setCampaignDataChecked(true);
    })
  }

  if (tokenBalance === '' || tokenSymbol === '') {
    getTokenInfo(instanceAddress, instanceToken, instanceAddress, network)
    .then((value) => {
      setTokenBalance(Number(value.balance));
      setTokenSymbol(value.symbol[0]);
    })
  }

  const handleClose = () => {
    setTokenBalance('');
    setUserTokenBalance('');
    setTokenSymbol('');
    setOpen(false);
    setCampaignDataChecked(false);
    setCampaignData([]);
    setCheckedBalance(false);
  }

  const getHumanDate = (unixtime) => {
    const date = new Date(unixtime * 1000);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const dateString = date.toLocaleString('en-US', options);

    return dateString.toString();
  }

  const cleanAddress = (_address) => {
    let firstHalf = _address.substr(0, 4);
    let secondHalf = _address.substr(38, 4);

    return firstHalf+'...'+secondHalf;
  }

  const isCampaignActive = (campaignInfo) => {
    return (Number(campaignInfo.endDate['_hex']) * 1000 > Date.now())
  }

  return (
    <Modal
      //dimmer='blurring'
      onClose={() => handleClose()}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button fluid color='violet'> Manage Airdrop Campaigns </Button>} >
      
      <Modal.Header>
        <Grid >
          <Grid.Row>
            <Grid.Column as='h1' floated='left' width={7}>
              Instance #{instanceNumer} <br/>Deployed campaigns
              <br/> <p style={{
                fontSize: '12px',
                marginTop:'20px'}}>Instance address: {cleanAddress(instanceAddress)} </p>
            </Grid.Column>

            <Grid.Column floated='right' width={5}>
              Tokens held in this contract: <br/> <Segment textAlign='center'><u>{(tokenBalance > 0)?tokenBalance: 0 } {tokenSymbol}</u></Segment>
            </Grid.Column>
          </Grid.Row>
          
          <Grid.Row columns={'equal'}>
            <Grid.Column>
              <Checkbox toggle label={'Placeholder'} />
            </Grid.Column>

            <Grid.Column>
              <Checkbox toggle label={'Placeholder'} />
            </Grid.Column>
            
            <Grid.Column>
              <Checkbox toggle label={'Placeholder'} />
            </Grid.Column>          
          </Grid.Row>

        </Grid>
      </Modal.Header>

      <Modal.Content scrolling>
        { (!campaignDataChecked)
        ? //           
        <Segment style={{width:'96%'}}>
          <FetchingDataMessage />
          <Divider hidden/>
          <LoadingCardGroup />
        </Segment>
        :
        <Card.Group> 
        {(campaignData.length === 0)
        ?
          <Segment style={{width:'96%'}}>
            <NoElementsFoundMessage whatIsBeingLookedFor='Airdrop Campaigns'/>
              <Divider hidden/>
            <LoadingCardGroup />
          </Segment>
        :
          campaignData.map((campaignInfo) => (
            <DeployedCampaignCard 
            key={Number(campaignInfo.campaignID['_hex'])}
            campaignInfo={ campaignInfo }
            instanceToken={ instanceToken }
            isCampaignActive={ isCampaignActive }
            tokenSymbol={ tokenSymbol }
            cleanAddress={ cleanAddress }
            getHumanDate={ getHumanDate }
            checkedBalance={ checkedBalance }
            setIsLoading= { setIsLoading }
            tokenBalance={ tokenBalance }
            setTokenBalance={ setTokenBalance }
            />

          ))}

      </Card.Group>
        }
       
      </Modal.Content>

      <Modal.Actions>
        <Popup
          open={ popUpOpen }
          onClose={() => setPopUpOpen(false)}
          onOpen={() => setPopUpOpen(true)}
          trigger={ 
          <Button 
          color={(tokenBalance === 0 && etherBalance === 0)?'violet':'yellow'} 
          floated='left'>
            {(tokenBalance === 0 && etherBalance === 0)?'No assets to manage':'Manage assets'}
          </Button> 
          }
          content={ <ManageAssetsPopup
            setPopUpOpen={ setPopUpOpen }
            accounts={ accounts } 
            network={ network } 
            instanceAddress={ instanceAddress } 
            instanceToken={ instanceToken }
            isLoading={ isLoading }
            setIsLoading={ setIsLoading }
            etherBalance={ etherBalance }
            setEtherBalance={ setEtherBalance }
            userTokenBalance={ userTokenBalance }
            tokenBalance= { tokenBalance }
            setTokenBalance= { setTokenBalance }
            setCheckedBalance={ setCheckedBalance } /> }
          on='click'
          position='top right' />

        <Button color='red' onClick={() => handleClose()}>
          Close
        </Button>

        <NewAirdropModal
          instanceAddress={ instanceAddress } 
          instanceToken={ instanceToken }
          tokenBalance={ tokenBalance }
          setTokenBalance={ setTokenBalance }
          tokenSymbol={ tokenSymbol }
          setIsLoading={ setIsLoading }
          isLoading={ isLoading }
          setCampaignDataChecked={ setCampaignDataChecked }
        />
        
      </Modal.Actions>
    </Modal>
  );
}