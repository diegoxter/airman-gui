import { useState } from 'react';
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { deployAirdropCampaign, fetchCampaignData, fetchEtherBalance, manageAirmanFunds } from '../../../interactions/airmanSystem';
import { checkBalance, getTokenSymbol, checkIfHasEnoughTokens, sendTokens } from '../../../interactions/erc20';
import { LoadingCardGroup, NoElementsFoundMessage } from '../../CommonComponents';
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

export const ManageAssetsPopup = ({
  setPopUpOpen,
  accounts,
  instanceAddress,
  instanceToken,
  setIsLoading,
  tokenBalance,
  setBalanceChecked }) => {
  const [amount, setAmount] = useState('');
  const [etherBalance, setEtherBalance] = useState('');
  const [amountInputValue] = useDebounce(amount, 600);
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [hasEnoughTokens, setHasEnoughTokens] = useState(false);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const handleAmountChange = (num) => {
    setAmount(num);
    setIsValidAmount(!isNaN(num) && num > 0);
    setHasEnoughTokens(false);
  }

  const handleSendClick = () => {
    setIsLoading(true);
    sendTokens(accounts, instanceToken, instanceAddress, Number(amountInputValue), setIsLoading)
    .then(() => {
      setPopUpOpen(false);

      sleep(3500)
      .then(() => setBalanceChecked(false))
    })
  }

  const handleWithdrawTokensClick = () => {
    manageAirmanFunds(instanceAddress, 1, setIsLoading)
    .then(() => {
      setPopUpOpen(false);

      sleep(3500)
      .then(() => setBalanceChecked(false))
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

  if (etherBalance === '') {
    fetchEtherBalance(instanceAddress)
    .then((value) => {
      setEtherBalance(Number(value['_hex']))
    })
  }

  if (isValidAmount && amountInputValue > 0 && amountInputValue !== '') {
    if (typeof accounts === 'string') {
      checkIfHasEnoughTokens(accounts, instanceToken, amountInputValue, setHasEnoughTokens);
    }
  }

  return (
    <Grid divided='vertically'>
      <Grid.Row>
        <Grid.Column>
          <h4>Refill tokens</h4>
          <Input fluid placeholder='Amount to send...' onChange={(e) => handleAmountChange(e.target.value)}/>
          <Divider hidden />
          {(Number(amountInputValue) === 0 || !hasEnoughTokens || !isValidAmount)
          ?
          <Button fluid size='tiny' content="Invalid token amount" disabled />
          :
          <Button fluid size='tiny' color='green' content='Send' onClick={() => {handleSendClick();}} />
          }
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <h4>Withdraw tokens</h4>
          <Divider hidden />
          {(tokenBalance > 0)
          ?
          <Button fluid size='tiny' color='red' content='Withdraw' onClick={() => {handleWithdrawTokensClick()}} />
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
  instanceToken,
  tokenBalance,
  setTokenBalance,
  tokenSymbol,
  isLoading,
  setIsLoading,
  setBalanceChecked,
  setCampaignDataChecked
  }) => {
  const [open, setOpen] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState('');
  const [hasValidTimeAmounts, setHasValidTimeAmounts] = useState(false);
  const [amountToAirdrop, setAmountToAirdrop] = useState('');
  const [hasValidAmounts, setHasValidAmounts] = useState(false);
  const [hasFixedAmount, setHasFixedAmount] = useState(false);
  const [amountPerParticipant, setAmountPerParticipant] = useState('');

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
    setTimeInSeconds(value);

    if (!isNaN(value) || value === '') {
      setHasValidTimeAmounts(false);
    } else {
      setHasValidTimeAmounts(true);
    }
  }

  const handleAmountToAirdropChange = (value) => {
    setAmountToAirdrop(value);

    if (!isNaN(value) || value === '') {
      setHasValidAmounts(false);
    } else {
      setHasValidAmounts(true);
    }
  }

  const handleAmountPerParticipantChange = (value) => {
    setAmountPerParticipant(value);
  }

  const handleDeployClick = () => {
    setIsLoading(true);
    try {
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
        setBalanceChecked(false);
        handleClose();
        setCampaignDataChecked(false);
      })
    } catch (error) {
      console.log('Falla al hacer el deploy de AirMan ');
    }
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
            error={(hasValidTimeAmounts)}
            onChange={(e) => handleTimeChange(e.target.value)}>
            <label>Time (in seconds) to end the campaign:</label>
            <input placeholder='Seconds to end the campaign...' />
          </Form.Field>

          <Form.Field
            error={(hasValidAmounts)}
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
            error={{
              content: 'Please enter a valid email address',
              pointing: 'above',
            }}>
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
        (amountToAirdrop === 0 || amountToAirdrop === '' || timeInSeconds === '' || timeInSeconds === 0)
        ?
        <Button
        color='grey'
        disabled={true} // TO DO fix this when the form is empty
        content='Insert amount' />
        :
        <Button
        loading={isLoading}
        color={(amountToAirdrop > tokenBalance)?'red':'green'} 
        disabled={((amountToAirdrop > tokenBalance)?true:false)} // TO DO fix this when the form is empty
        content={(amountToAirdrop > tokenBalance)?'Invalid data':'Deploy'} 
        onClick={() => handleDeployClick()} />
        }
      </Modal.Actions>
    </Modal>
  );
}


export const DeployedAirdropModal = ({ accounts, network, instanceNumer, instanceAddress, instanceToken }) => {
  const [open, setOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [campaignDataChecked, setCampaignDataChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('');
  const [balanceChecked, setBalanceChecked] = useState(false)
  const [tokenSymbol, setTokenSymbol] = useState('');

  let sleep = ms => new Promise(r => setTimeout(r, ms));

  const cleanAddress = (_address) => {
    let firstHalf = _address.substr(0, 4);
    let secondHalf = _address.substr(38, 4);

    return firstHalf+'...'+secondHalf;
  }

  // 0x6B76e20c5b7E0570B111618F65c0Ab2224c1C7B7
  if (open && !campaignDataChecked) {
    fetchCampaignData(instanceAddress)
    .then((value) => {
      setCampaignData(value);
      setCampaignDataChecked(true);
    })
  }

  if (open && !balanceChecked) {
    sleep(2500)
    .then(() => {
      checkBalance(instanceAddress, instanceToken)
      .then((value) => {
        setTokenBalance(value);
        setBalanceChecked(true);
      })
    })
  }

  if (tokenSymbol === '') {
    getTokenSymbol(instanceToken)
    .then((value) => {
      setTokenSymbol(value);
    })
  }

  const handleClose = () => {
    setTokenBalance('');
    setBalanceChecked(false);
    setTokenSymbol('');
    setOpen(false);
    setCampaignDataChecked(false);
    setCampaignData([]);
  }

  const getHumanDate = (unixtime) => {
    const date = new Date(unixtime * 1000);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const dateString = date.toLocaleString('en-US', options);

    return dateString.toString();
  }

  // TO DO finish this
  const panels = [
    {
      key: 'content',
      title: {
        content: 'Lorem ipsum',
      },
      content: {
        content: (
          <span>
            dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
        ),
      },
    },
  ];

  //console.log(campaignData)

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
        <Grid>
          <Grid.Column as='h1' floated='left' width={7}>
            Instance #{instanceNumer} <br/>Deployed campaigns
            <br/> <p style={{
              fontSize: '12px',
              marginTop:'20px'}}>Instance address: {cleanAddress(instanceAddress)} </p>
          </Grid.Column>

          <Grid.Column floated='right' width={5}>
            Tokens held in this contract: <br/> <Segment textAlign='center'><u>{(tokenBalance > 0)?tokenBalance: 0 } {tokenSymbol}</u></Segment>
          </Grid.Column>
        </Grid>
      </Modal.Header>

      <Modal.Content scrolling>
        { (campaignData.length === 0)
        ?
        <Segment style={{width:'96%'}}>
          <NoElementsFoundMessage whatIsBeingLookedFor='Airdrop Campaigns'/>
          <Divider hidden/>
          <LoadingCardGroup />
        </Segment>

        :
        <Card.Group> 
        {campaignData.map((campaignInfo) => (
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

            <Card.Meta>{`Amount to airdrop ${campaignInfo.amountToAirdrop} ${tokenSymbol}`}</Card.Meta>
            <Card.Meta>Campaign address <b>{cleanAddress(campaignInfo.campaignAddress)}</b></Card.Meta>

            <Card.Description>
            {
                (isCampaignActive(campaignInfo))
                ?
                `End date: ${getHumanDate(Number(campaignInfo.endDate['_hex']))}`
                :
                `End date: Expired`
            }
            </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <div className='ui two buttons'>
                <Button basic color='green'>
                  Approve
                </Button>
                <Button basic color='red'>
                  Decline
                </Button>
              </div>
              <Accordion panels={panels}/>

            </Card.Content>
          </Card>
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
          disabled={campaignData.length === 0} 
          color={(campaignData.length === 0)?'grey':'yellow'} 
          floated='left'>
            {(campaignData.length === 0)?'No active campaigns':'Manage assets'}
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
            tokenBalance= { tokenBalance }
            setBalanceChecked={ setBalanceChecked } /> }
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
          setBalanceChecked={ setBalanceChecked }
          setCampaignDataChecked={ setCampaignDataChecked }
        />
        
      </Modal.Actions>
    </Modal>
  );
}