import { useState } from 'react';
import { useDebounce } from "use-debounce";
import { deployAirdropCampaign, fetchCampaignData } from '../../interactions/airmanSystem';
import { checkBalance, getTokenSymbol, checkIfHasEnoughTokens, sendTokens } from '../../interactions/erc20';
import { 
    Card, 
    Button, 
    Grid, 
    Placeholder, 
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


export const LoadingAirManList = () => {
  return (
    <Grid columns={3} stackable>
      <Grid.Column>
        <Segment raised>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length='medium' />
              <Placeholder.Line length='short' />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
  
      <Grid.Column>
        <Segment raised>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length='medium' />
              <Placeholder.Line length='short' />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
  
      <Grid.Column>
        <Segment raised>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length='medium' />
              <Placeholder.Line length='short' />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}


export const SendTokensPopup = ({ accounts, network, instanceAddress, instanceToken, isLoading, setIsLoading, setBalanceChecked }) => {
  const [amount, setAmount] = useState('');
  const [amountInputValue] = useDebounce(amount, 600);
  const [isValidAmount, setIsValidAmount] = useState(undefined);
  const [hasEnoughTokens, setHasEnoughTokens] = useState(false);

  const handleAmountChange = (num) => {
    setAmount(num)
    setIsValidAmount(!isNaN(num))
  }

  const handleSendClick = async () => {
    setIsLoading(true);
    await sendTokens(accounts, instanceToken, instanceAddress, Number(amountInputValue), setIsLoading)
    
    setBalanceChecked(false); // TO DO better handle of this timing 
  }

  if (isValidAmount) {
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
          <h4>Ether in contract</h4>
            <Segment>Lorem Ipsum</Segment>
        </Grid.Column>
      </Grid.Row>
       
        <Grid.Row>
        <Grid.Column>
          <Button fluid size='tiny' color='orange' content='Withdraw Ether' />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}


export const NewAirdropModal = ({
  instanceAddress,
  instanceToken,
  tokenBalance,
  tokenSymbol,
  isLoading,
  setIsLoading,
  setBalanceChecked
  }) => {
  const [open, setOpen] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState('');
  const [amountToAirdrop, setAmountToAirdrop] = useState('');
  const [hasValidAmounts, setHasValidAmounts] = useState(false)
  const [hasFixedAmount, setHasFixedAmount] = useState(false);
  const [amountPerParticipant, setAmountPerParticipant] = useState('');

  const handleClose = () => {
    setOpen(false);
    setTimeInSeconds('')
    setAmountToAirdrop('')
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
  }

  const handleAmountToAirdropChange = (value) => {
    setAmountToAirdrop(value);

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
      .then(() => (
        setBalanceChecked(false)
      ))
    } catch (error) {
      console.log('Falla al hacer el deploy de AirMan ', error);
    }
  }

  const toggleLoading = () => {
    if (isLoading) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
    console.log(isLoading)
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
            error={{
              content: 'Please enter a valid email address',
              pointing: 'above',
            }}
            onChange={(e) => handleTimeChange(e.target.value)}>
            <label>Time (in seconds) to end the campaign:</label>
            <input placeholder='Seconds to end the campaign...' />
          </Form.Field>

          <Form.Field
            error={{
              content: 'Please enter a valid email address',
              pointing: 'below',
            }}
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
        (isLoading)
        ?
        <Button loading primary size='medium'>
            PLACEH
        </Button>
        :
        (amountToAirdrop === 0 || amountToAirdrop === '' || timeInSeconds === '' || timeInSeconds === 0)
        ?
        <Button 
        color='grey'
        disabled={true} // TO DO fix this when the form is empty
        content='Insert amount' />
        :
        <Button 
        color={(amountToAirdrop > tokenBalance)?'red':'green'} 
        disabled={((amountToAirdrop > tokenBalance)?true:false)} // TO DO fix this when the form is empty
        content={(amountToAirdrop > tokenBalance)?'Invalid data':'Deploy'} 
        onClick={() => handleDeployClick()} />
        }
      </Modal.Actions>
    </Modal>
  );
}


export const DeployedAirdropModal = ({ accounts, network, instanceAddress, instanceToken }) => {
  const [open, setOpen] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [campaignDataChecked, setCampaignDataChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('');
  const [balanceChecked, setBalanceChecked] = useState(false)
  const [tokenSymbol, setTokenSymbol] = useState('');


  // 0x6B76e20c5b7E0570B111618F65c0Ab2224c1C7B7
  if (open && !campaignDataChecked) {
    fetchCampaignData(instanceAddress)
    .then((value) => {
      setCampaignData(value);
      setCampaignDataChecked(true)
    })
  }

  if (open && !balanceChecked) {
    checkBalance(instanceAddress, instanceToken)
    .then((value) => {
      setTokenBalance(value);
      setBalanceChecked(true)
    })
  }

  if (tokenSymbol === '') {
    getTokenSymbol(instanceToken)
    .then((value) => {
      setTokenSymbol(value);
    })
  }

  const handleClose = () => {
    setTokenBalance(0)
    setBalanceChecked(false)
    setTokenSymbol('')
    setOpen(false)
    setCampaignDataChecked(false)
    setCampaignData([])
  }

  const getHumanDate = (unixtime) => {
    const date = new Date(unixtime * 1000)
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const dateString = date.toLocaleString('en-US', options);

    return dateString.toString()
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
  ]

  return (
    <Modal
      //dimmer='blurring'
      onClose={() => handleClose()}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color='violet'> Manage Airdrop Campaigns </Button>} >
      
      <Modal.Header>
        <Grid>
          <Grid.Column as='h1' floated='left' width={3}>
            Deployed campaigns
          </Grid.Column>

          <Grid.Column floated='right' width={5}>
            Tokens held in this contract: <br/> <Segment textAlign='center'><u>{tokenBalance} {tokenSymbol}</u></Segment>
          </Grid.Column>
        </Grid>
      </Modal.Header>

      <Modal.Content scrolling>
        { (campaignData.length === 0)
        ?
        <Grid columns={3} stackable>
            <Grid.Column>
              <Segment raised>
                <Placeholder>
                  <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                  <Placeholder.Paragraph>
                    <Placeholder.Line length='medium' />
                    <Placeholder.Line length='short' />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment raised>
                <Placeholder>
                  <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                  <Placeholder.Paragraph>
                    <Placeholder.Line length='medium' />
                    <Placeholder.Line length='short' />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment raised>
                <Placeholder>
                  <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                  <Placeholder.Paragraph>
                    <Placeholder.Line length='medium' />
                    <Placeholder.Line length='short' />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            </Grid.Column>
          </Grid>
        :
        <Card.Group> 
        {campaignData.map((campaignInfo) => ( //// aqui
          <Card key={Number(campaignInfo.campaignID['_hex'])}>
            <Card.Content>

            <Card.Header>{'Campaign #'+Number(campaignInfo.campaignID['_hex'])}</Card.Header>

            <Card.Meta>{'Amount to airdrop ' + campaignInfo.amountToAirdrop+' '+tokenSymbol}</Card.Meta>

            <Card.Description>
                End date: <strong>{getHumanDate(Number(campaignInfo.endDate['_hex']))}</strong>
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
          trigger={ 
          <Button 
          disabled={campaignData.length === 0} 
          color={(campaignData.length === 0)?'grey':'yellow'} 
          floated='left'>
            {(campaignData.length === 0)?'No active campaigns':'Manage assets'}
          </Button> 
          }
          content={ <SendTokensPopup 
            accounts={ accounts } 
            network={ network } 
            instanceAddress={ instanceAddress } 
            instanceToken={ instanceToken }
            isLoading={ isLoading }
            setIsLoading={ setIsLoading }
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
          tokenSymbol={ tokenSymbol }
          setIsLoading={ setIsLoading }
          isLoading={ isLoading }
          setBalanceChecked={ setBalanceChecked }
        />
        
      </Modal.Actions>
    </Modal>
  );
}