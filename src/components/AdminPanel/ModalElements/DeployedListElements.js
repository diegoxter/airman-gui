import { useState } from 'react';
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { deployAirdropCampaign, getCampaignInfo, manageAirmanFunds } from '../../../interactions/airmanSystem';
import { withdrawCampaignTokens, addUserList, banUser, getOwnerTokenWithdrawDate } from '../../../interactions/airdropSystem';
import { getEtherBalance, weiToEther, cleanAddress } from '../../../interactions';
import { checkBalance, sendTokens, getTokenInfo } from '../../../interactions/erc20';
import {
  LoadingCardGroup,
  NoElementsFoundMessage,
  FetchingDataMessage,
  CopyButton,
  RefreshButton
} from '../../CommonComponents';
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
    Icon,
    Item
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
      .then(() => setEtherBalance('0.0'))
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
          {(parseInt(tokenBalance) > 0)
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
              {(Number(etherBalance) > 0)?etherBalance+' ETH': '0 ETH'}
            </Segment>
          <Divider hidden />
          <Button
            fluid
            size='tiny'
            color={(etherBalance === 0 || etherBalance==='')?'grey':'orange'}
            content='Withdraw Ether' onClick={handleWithdrawEtherClick}
            disabled={(etherBalance === 0 || etherBalance === '')}
          />
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
  setCampaignDataChecked,
  getHumanDate
  }) => {
  const [open, setOpen] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState('');
  const [hasValidTimeAmounts, setHasValidTimeAmounts] = useState(false);
  const [amountToAirdrop, setAmountToAirdrop] = useState('');
  const [hasValidAmounts, setHasValidAmounts] = useState(false);
  const [whitelistFee, setWhitelistFee] = useState('0');
  const [hasValidFeeAmounts, setHasValidFeeAmounts] = useState(false);
  const [hasFixedAmount, setHasFixedAmount] = useState(false);
  const [amountPerParticipant, setAmountPerParticipant] = useState('');
  const [hasValidAmountPerParticipant, setHasValidAmountPerParticipant] = useState(false);
  const [maxParticipantAmount, setMaxParticipantAmount] = useState('');
  const [hasValidMaxParticipantAmount, setHasValidMaxParticipantAmount] = useState(false);

  const handleClose = () => {
    setHasValidTimeAmounts(false);
    setHasValidAmounts(false);
    setHasValidFeeAmounts(false);
    setHasValidAmountPerParticipant(false);
    setHasValidMaxParticipantAmount(false);
    setTimeInSeconds('');
    setAmountToAirdrop('');
    setTokenBalance('');
    setWhitelistFee('0');
    setOpen(false);
  }

  const handleCheckboxChange = () => {
    setHasFixedAmount(!hasFixedAmount);
  }

  const handleTimeChange = (value) => {
    setTimeInSeconds(Number(value));
    setHasValidTimeAmounts(!isNaN(value) && Number(value) > 0);
  }

  const handleAmountToAirdropChange = (value) => {
    setAmountToAirdrop(Number(value));
    setHasValidAmounts(!isNaN(value) && Number(value) > 0);
  }

  const handleWhitelistFeeChange = (value) => {
    setWhitelistFee(value);
    setHasValidFeeAmounts(!isNaN(value) && value !== '');
  }

  const handleAmountPerParticipantChange = (value) => {
    setAmountPerParticipant(Number(value));
    setHasValidAmountPerParticipant(!isNaN(value) && Number(value) > 0 && Number(value) < amountToAirdrop);
  }

  const handleMaxParticipantAmountChange = (value) => {
    setMaxParticipantAmount(Number(value));
    setHasValidMaxParticipantAmount(
      !isNaN(value) &&
      Number(value) > 0 &&
      value !== '' &&
      (amountToAirdrop / Number(value) === amountPerParticipant)
    );
  }

  const handleDeployClick = () => {
    setIsLoading(true);
    let parsedAmountPerParticipant = 0;

    if (hasFixedAmount) {
      parsedAmountPerParticipant = Number(amountPerParticipant);
    }

    deployAirdropCampaign(
      instanceAddress,
      [ Number(timeInSeconds),
      Number(amountToAirdrop),
      whitelistFee,
      parsedAmountPerParticipant,
      Number(maxParticipantAmount) ],
      hasFixedAmount,
      setIsLoading)
    .then(() => {
      handleClose();
      setCampaignDataChecked(false);
    })
  }

  const getFeeAmount = () => {
    if (!isNaN(whitelistFee) && whitelistFee !== '') {
      return ethers.utils.formatEther(ethers.utils.parseUnits(whitelistFee, 'wei'))
    } else {
      return '0'
    }
  }

  const getHumanDateWrapper = () => {
    if (timeInSeconds !== '') {
      return getHumanDate((Date.now() + (timeInSeconds*1000))/1000)
    } else {
      return 'No data'
    }
  }

  const withdrawalDate = () => {
    if (timeInSeconds !== '') {
      return getHumanDate((Date.now() + ((timeInSeconds*1000)*2))/1000)
    } else {
      return 'No data'
    }
  }

  return (
    <Modal
      style={{width: '41%'}}
      closeIcon
      open={open}
      trigger={<Button color='olive'> Deploy new airdrop </Button>}
      onClose={() => handleClose()}
      onOpen={() => setOpen(true)}
    >
      <Header> Tokens held in AirMan: <u>{parseInt(tokenBalance).toLocaleString('en-US')} {tokenSymbol}</u></Header >

      <Modal.Content scrolling>
        <Form>
          <Form.Field
            error={(!hasValidTimeAmounts)}
            onChange={(e) => handleTimeChange(e.target.value)}>
            <label>Time (in seconds) to end the campaign <br />Campaign end date: <u>{getHumanDateWrapper()}</u> <br />
            Withdrawal eligibility date: <u>{withdrawalDate()}</u></label>
            <input placeholder='Seconds to end the campaign...' />
          </Form.Field>

          <Form.Field
            error={(!hasValidAmounts || Number(amountToAirdrop) > Number(tokenBalance))}
            onChange={(e) => handleAmountToAirdropChange(e.target.value)} >
            <label>Total amount to airdrop </label>
            <input placeholder='Tokens to airdrop...' />
          </Form.Field>

          <Form.Field
            error={(!hasValidFeeAmounts)}
            onChange={(e) => handleWhitelistFeeChange(e.target.value)} >
            <label>
              Whitelist fee in Wei (can be 0) <br /> [value in Ether: <u>{getFeeAmount()}</u>]:
              </label>
            <input placeholder='Fee in Wei...' />
          </Form.Field>

          <Form.Field>
            <Checkbox
            label='Has fixed amount per user?'
            onChange={() => handleCheckboxChange()}
            />
          </Form.Field>

          {(hasFixedAmount)
          ?
          <div>
          <Form.Field
            onChange={(e) => handleAmountPerParticipantChange(e.target.value)}
            error={!hasValidAmountPerParticipant}>
            <label>Amount for each participant</label>
            <input placeholder='Amount...' />
          </Form.Field>

          <Form.Field
            onChange={(e) => handleMaxParticipantAmountChange(e.target.value)}
            error={!hasValidMaxParticipantAmount}>
            <label>Max. participant amount</label>
            <input placeholder='Amount...' />
          </Form.Field>
          </div>
          :
          <div>
          <Form.Field disabled>
            <label>Amount for each participant</label>
            <input placeholder='Amount...' />
          </Form.Field>

          <Form.Field disabled>
            <label>Max. participant amount</label>
            <input placeholder='Amount...' />
          </Form.Field>
          </div>

          }
        </Form>
      </Modal.Content>

      <Modal.Actions>
        <Button color='red' onClick={() => handleClose()}>
          Cancel
        </Button>
        {
        (!hasValidAmounts || !hasValidTimeAmounts || (hasFixedAmount && (!hasValidAmountPerParticipant || !hasValidMaxParticipantAmount)))
        ?
        <Button
        color='grey'
        disabled
        content='Insert amount' />
        :
        <Button
        loading={isLoading}
        color={
          ((amountToAirdrop > tokenBalance || !hasValidFeeAmounts || !hasValidAmounts || !hasValidTimeAmounts || (hasFixedAmount && !hasValidAmountPerParticipant)))
          ? 'red' : 'green'}
        disabled={
          ((amountToAirdrop > tokenBalance || !hasValidFeeAmounts || !hasValidAmounts || !hasValidTimeAmounts|| (hasFixedAmount && !hasValidAmountPerParticipant)))
          ? true : false}
        content={
          ((amountToAirdrop > tokenBalance || !hasValidFeeAmounts || !hasValidAmounts || !hasValidTimeAmounts))
          ? 'Invalid data' : 'Deploy'}
        onClick={() => handleDeployClick()} />
        }
      </Modal.Actions>
    </Modal>
  );
}

const AddUsersPopup = ({ instanceAddress, isLoading, setIsLoading }) => {
  const [userListInput, setUserListInput] = useState('');
  const [userList, setUserList] = useState([]);
  const [isListPopupOpen, setIsListPopupOpen] = useState(false);
  const [duplicatedAddress, setDuplicatedAddress] = useState(false);

  const handleAddToListClick = () => {
    const newItems = [...userList, userListInput.toLowerCase()];
    setUserList(newItems);
    setUserListInput('');
  }

  const handleDeleteLastElementClick = (index) => {
    const newArray = [...userList];
    newArray.splice(index, 1);
    setUserList(newArray);
  }

  const handleUserListChange = (address) => {
    setUserListInput(address);
    setDuplicatedAddress(userList.indexOf(address.toLowerCase()) !== -1);
  }

  const handleAddClick = () => {
    setIsLoading(true);
    addUserList(instanceAddress, userList, setIsLoading)
    .then(() => {
      const newItems = [];
      setUserList(newItems);
    })
  }

  const switchPopup = () => {
    setIsListPopupOpen(!isListPopupOpen)
  }

  return (
    <div>
      <Segment.Group horizontal>
        <Segment>
          Address count: {userList.length}
        </Segment>

        <Segment>
          <Popup
            on='click'
            closeOnDocumentClick={false}
            closeOnEscape={false}
            position='right center'
            trigger={
              <Button icon color='grey' size='mini' onClick={switchPopup}>
                <Icon name={(isListPopupOpen)? 'close':'arrow right'} />
              </Button>
            }
            content={
              <div>
                <Header > List </Header>
                  {
                    (userList.length === 0)
                    ?
                    'No addressess'
                    :
                    <div style={{height: '200px', overflowY: 'auto'}}>
                      <Segment.Group style={{marginRight: '7px'}}>
                      {userList.map((address, index) => (
                        <Segment.Group key={address} horizontal size='tiny'>
                          <Segment>
                            {cleanAddress(address, 8, 34)}
                          </Segment>

                          <Segment>
                            <Button icon color='red' size='mini' onClick={() => {handleDeleteLastElementClick(index)}}>
                              <Icon name='delete' />
                            </Button>
                          </Segment>
                        </Segment.Group>
                      ))}
                    </Segment.Group>
                  </div>
                  }


              </div>
            }
          />
        </Segment>

        </Segment.Group>


        <Divider />

        <Form>
          <Form.Field
          error={(duplicatedAddress)}>
            <label>Insert the addresses one by one</label>
            <input
              placeholder='Addressess'
              value={userListInput}
              onChange={(e) => handleUserListChange(e.target.value)}
            />
          </Form.Field>
        </Form>

        <Divider hidden />

        <div className='ui two buttons'>
          <Button
            disabled={userListInput.length < 42 || duplicatedAddress}
            fluid
            color={(duplicatedAddress)? 'red' : 'violet'}
            onClick={handleAddToListClick}
            content={(duplicatedAddress)? 'Duplicated address' : 'Add to list'} />

          <Button
            loading={isLoading}
            disabled={userList.length === 0}
            fluid
            color={(userList.length === 0)?'grey':'teal'}
            onClick={handleAddClick}
            content='Send transaction' />
        </div>

    </div>
  )
}

const BanUsersPopup = ({ instanceAddress, isLoading, setIsLoading }) => {
  const [userInput, setUserInput] = useState('');

  const handleBanClick = () => {
    console.log('Test ban button');
    setIsLoading(true);
    // banUser(instanceAddress, userInput, setIsLoading)
  }

  const handleCheckBannedClick = () => {
    console.log('Test check banned button');
  }

  const handleUserChange = (e) => {
    setUserInput(e);
  }

  return (
    <div>
        <Form>
          <Form.Field
            onChange={(e) => handleUserChange(e.target.value)}
          >
            <label>Insert the to-be-banned addresses separated by comma</label>
            <input placeholder='Addressess' />
          </Form.Field>
        </Form>

        <Divider hidden />

        <div className='ui two buttons'>
          <Button disabled={userInput.length !== 42 } loading={isLoading} fluid color='red' onClick={handleBanClick}>
              Ban
          </Button>
          <Button fluid color='blue' onClick={handleCheckBannedClick}>
              Check banned
          </Button>
        </div>
    </div>
  )
}

const DeployedCampaignCard = ({
  campaignInfo,
  instanceToken,
  isCampaignActive,
  tokenSymbol,
  getHumanDate,
  checkedBalance,
  setTokenBalance,
  isLoading,
  setIsLoading
}) => {
  const [campaignBalance, setCampaignBalance] = useState('');
  const [campaignTokenBalance, setCampaignTokenBalance] = useState('');
  const [campaignWithdrawDate, setCampaignWithdrawDate] = useState('');
  const [addPopupOpen, setaddPopupOpen] = useState(false);
  const [banPopupOpen, setBanPopupOpen] = useState(false);

  const date = Date.now();
  //const options = { month: 'short', weekday: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  //const dateString = date.toLocaleString('en-US', options);

  if (campaignBalance === '') {
    getEtherBalance(campaignInfo.campaignAddress)
    .then((value) => setCampaignBalance(value))
  }

  if (campaignWithdrawDate === '') {
    getOwnerTokenWithdrawDate(campaignInfo.campaignAddress)
    .then((value) => setCampaignWithdrawDate(value))
  }

  if (campaignTokenBalance === '' || checkedBalance === false) {
    checkBalance(campaignInfo.campaignAddress, instanceToken)
    .then((result) => setCampaignTokenBalance(result));
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
        {
          (campaignInfo.fee > 0 && isCampaignActive(campaignInfo))
          ?
          <Popup
            flowing
            content='Click to edit the fee'
            trigger={
              <Button size='mini' floated='right'>Fee: <br/> {weiToEther(campaignInfo.fee)+'Ξ'} </Button>
            }
          />
          :
          false
        }
      </Card.Header>

      <Card.Meta>Total amount to airdrop <br/> {`${parseInt(campaignInfo.amountToAirdrop).toLocaleString()} ${tokenSymbol}`}</Card.Meta>
      <Card.Meta>Tokens in contract <br/> {`${parseInt(campaignTokenBalance).toLocaleString()} ${tokenSymbol}`}</Card.Meta>
      <Card.Meta>Ether in contract <br/> {`${(campaignBalance)}`}</Card.Meta>

      <Card.Meta>Campaign address <br/>
      <b>{cleanAddress(campaignInfo.campaignAddress, 4, 38)}</b>
      <CopyButton dataToCopy={campaignInfo.campaignAddress}/>
      </Card.Meta>

      <Card.Description>
      {
          (isCampaignActive(campaignInfo))
          ?
          <Item>
            Claimable after: <br /><u> {getHumanDate(Number(campaignInfo.endDate['_hex']))} </u> <br/>
            Date to withdraw: <br /> <u>{getHumanDate(campaignWithdrawDate)} </u>
          </Item>
          :
          <Item>End date: <u>Expired</u> <br/></Item>
      }
      <br />Participants <br /> Unclaimed
      </Card.Description>
      </Card.Content>

      <Card.Content extra>
        {(date < (campaignWithdrawDate * 1000))
        ?
        <div className='ui two buttons'>
          <Popup
            position='top center'
            content={<AddUsersPopup instanceAddress={ campaignInfo.campaignAddress } isLoading={ isLoading } setIsLoading={ setIsLoading } />}
            on='click'
            closeOnDocumentClick={false}
            closeOnEscape={false}
            pinned
            trigger={
            <Button
            disabled={banPopupOpen}
            basic={banPopupOpen}
            color={(addPopupOpen)? 'orange':'teal'}
            content={(addPopupOpen)? 'Close':'Add users'}
            onClick={() => setaddPopupOpen(!addPopupOpen)} />
          } />

          <Popup // TO DO add this function to the contract
            position='top center'
            content={<BanUsersPopup instanceAddress={ campaignInfo.campaignAddress } isLoading={ isLoading } setIsLoading={ setIsLoading } />}
            on='click'
            closeOnDocumentClick={false}
            closeOnEscape={false}
            pinned
            trigger={
              <Button
              disabled={addPopupOpen}
              basic={addPopupOpen}
              color={(banPopupOpen)? 'orange':'red'}
              content={(banPopupOpen)? 'Close':'Ban users'}
              onClick={() => setBanPopupOpen(!banPopupOpen)}
              /> }
          />
        </div>

        :
        <div>
        <Button
          disabled={campaignTokenBalance === 0}
          color={(campaignTokenBalance === 0)? 'grey': 'teal'}
          fluid
          onClick={handleWithdrawTokens} // TO DO this needs to be shown only if the time for owner to claim is up
          content={(campaignTokenBalance === 0)? 'No assets to withdraw': 'Withdraw leftover assets'}>
        </Button>
      </div>
      }
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
    getEtherBalance(instanceAddress)
    .then((value) => {
      setEtherBalance(value)
    })
  }

  if (userTokenBalance === '') {
    checkBalance(accounts, instanceToken)
    .then((value) => {setUserTokenBalance((parseInt(value)).toLocaleString())})
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
      setTokenBalance((value.balance));
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
    const options = { month: 'short', weekday: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const dateString = date.toLocaleString('en-US', options);

    return dateString.toString();
  }

  const isCampaignActive = (campaignInfo) => {
    return (Number(campaignInfo.endDate['_hex']) * 1000 > Date.now())
  }

  return (
    <Modal
      style={{height: '94%', overflowY: 'auto'}}
      //dimmer='blurring'
      onClose={() => handleClose()}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button fluid color='violet'> Manage Airdrop Campaigns </Button>} >

      <Modal.Header>
        <Grid >
          <Grid.Row>
            <Grid.Column as='h1' floated='left' width={7}>
              Instance #{instanceNumer} <br/>
              Deployed campaigns
              <br/> <p style={{
                fontSize: '12px',
                marginTop:'20px'}}>Instance address: {cleanAddress(instanceAddress, 4, 38)} <CopyButton dataToCopy={instanceAddress} /> <br />
                Token address: {cleanAddress(instanceToken, 4, 38)} <CopyButton dataToCopy={instanceToken} /> </p>
            </Grid.Column>

            <Grid.Column floated='right' width={5}>
              Tokens held in this contract: <br/>
              <Segment textAlign='center'>
                <u>{(parseInt(tokenBalance) > 0)?parseInt(tokenBalance).toLocaleString('en-US'): 0 } {tokenSymbol}</u>
                </Segment>
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

            <RefreshButton />
          </Grid.Row>

        </Grid>
      </Modal.Header>

      <Modal.Content scrolling style={{height: '68%', overflowY: 'auto'}}>
        { (!campaignDataChecked)
        ?
        <Segment style={{width:'96%'}}>
          <FetchingDataMessage />
          <Divider hidden/>
          <LoadingCardGroup />
        </Segment>
        :
        <Card.Group itemsPerRow={3}>
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
            getHumanDate={ getHumanDate }
            checkedBalance={ checkedBalance }
            isLoading={ isLoading }
            setIsLoading={ setIsLoading }
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
          getHumanDate={ getHumanDate }
        />

      </Modal.Actions>
    </Modal>
  );
}