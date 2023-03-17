import { useState } from 'react';
import { Card,
  Image,
  Segment,
  Divider,
  Modal,
  Button,
  Grid,
  Popup,
  Checkbox,
  Accordion
} from 'semantic-ui-react';
import { cleanAddress, readJSONFromIPFS, getEtherBalance } from '../../interactions';
import { checkBalance, getTokenInfo } from '../../interactions/erc20';
import { getCampaignInfo } from '../../interactions/airmanSystem';
import {
  LoadingCardGroup,
  FetchingDataMessage,
  NoElementsFoundMessage,
  ProjectInfo,
  CopyButton,
  RefreshButton
} from '../CommonComponents';
import { DeployedCampaignCard, NewAirdropModal, ManageAssetsPopup } from './ModalElements/DeployedListElements';

const DeployedAirdropModal = ({
  accounts,
  network,
  instanceNumer,
  instanceAddress,
  instanceToken,
  instancesProjectInfo
}) => {
  const [ open, setOpen ] = useState(false);
  const [ popUpOpen, setPopUpOpen ] = useState(false);
  const [ campaignData, setCampaignData ] = useState([]);
  const [ campaignDataChecked, setCampaignDataChecked ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false);
  const [ userTokenBalance, setUserTokenBalance ] = useState('')
  const [ etherBalance, setEtherBalance ] = useState('');
  const [ tokenBalance, setTokenBalance ] = useState('');
  const [ tokenDecimals, setTokenDecimals ] = useState('')
  const [ tokenSymbol, setTokenSymbol ] = useState('');
  const [ checkedBalance, setCheckedBalance ] = useState(false);
  const [ projectInfoJSON, setProjectInfoJSON ] = useState('');

  if (projectInfoJSON === '') {
    readJSONFromIPFS(instancesProjectInfo)
    .then((json) => {
      setProjectInfoJSON(json);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const panels = [
    {
      key: 'project-metadata',
      title: 'Project information',
      content: {
        content: [
          <Segment>
            <ProjectInfo  key={'info'} projectInfoSource={ projectInfoJSON } drawButton={true}/>
          </Segment>
      ]},
    }
  ]

  if (etherBalance === '') {
    getEtherBalance(instanceAddress)
    .then((value) => {
      setEtherBalance(value)
    })
  }

  if (userTokenBalance === '') {
    checkBalance(accounts, instanceToken)
    .then((value) => {setUserTokenBalance((parseFloat(value)))})
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
      setTokenDecimals(value.decimals);
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

  const handleRefreshClick = () => {
    setCampaignDataChecked(false);
    setCampaignData([]);
  }

  return (
    <Modal
      style={{height: '94%', overflowY: 'auto'}}
      dimmer='inverted'
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
                <u>{(parseFloat(tokenBalance) > 0)?(parseFloat(tokenBalance)  / 10 ** Number(tokenDecimals)).toLocaleString('en-US'): 0 } {tokenSymbol}</u>
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

            <RefreshButton color='blue' execOnClick={handleRefreshClick}/>
          </Grid.Row>

        </Grid>
      </Modal.Header>

      <div>
        <Accordion fluid styled panels={panels}></Accordion>
      </div>

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
              network={ network }
              campaignInfo={ campaignInfo }
              instanceToken={ instanceToken }
              isCampaignActive={ isCampaignActive }
              tokenSymbol={ tokenSymbol }
              tokenDecimals={ tokenDecimals }
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
          on='click'
          position='top right'
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
            tokenDecimals={ tokenDecimals }
            setTokenBalance= { setTokenBalance }
            setCheckedBalance={ setCheckedBalance } /> }
          />

        <Button color='red' onClick={() => handleClose()}>
          Close
        </Button>

        <NewAirdropModal
          instanceAddress={ instanceAddress }
          instanceToken={ instanceToken }
          tokenBalance={ tokenBalance }
          setTokenBalance={ setTokenBalance }
          tokenSymbol={ tokenSymbol }
          tokenDecimals={ tokenDecimals }
          setIsLoading={ setIsLoading }
          isLoading={ isLoading }
          setCampaignDataChecked={ setCampaignDataChecked }
          getHumanDate={ getHumanDate }
        />

      </Modal.Actions>
    </Modal>
  );
}

export const DeployedAirManList = ({
  network,
  accounts,
  instances,
  checkedInstances,
  instancesImageData,
  instancesProjectInfo
}) => {

  if (checkedInstances) {
    if (instances.length > 0 && instancesImageData.length > 0) {

      return (
        <Card.Group style={{width: '70%'}}>
          {
            instances.map((instance, index) => (
              <Card key={instance.id} style={{marginLeft: '15px', width: '25%'}}>
                <Card.Content>
                  <Image
                    floated='right'
                    size='mini'
                    src={`https://testairdropman.infura-ipfs.io/ipfs/${(instancesImageData[index])}`}  />
                  <Card.Header> {`AirMan instance #${Number(instance.id['_hex'])}`} </Card.Header>
                  <Card.Meta> Address: {cleanAddress(instance.instanceAddress, 4, 38)} </Card.Meta>
                  <Card.Description>
                    Token: {cleanAddress(instance.instanceToken, 4, 38)}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='button'>
                    <DeployedAirdropModal
                      accounts={ accounts }
                      network={ network }
                      instanceNumer={ Number(instance.id) }
                      instanceAddress={ instance.instanceAddress }
                      instanceToken= { instance.instanceToken }
                      instancesProjectInfo={ instancesProjectInfo }
                    />
                  </div>
                </Card.Content>
              </Card>
            ))
          }
        </Card.Group>
      );
    } else {
      return(
        <Segment style={{width:'100%'}}>

          <NoElementsFoundMessage whatIsBeingLookedFor='Airdrop Managers'/>
          <Divider hidden/>
          <LoadingCardGroup />

        </Segment>
      );
    }
  } else {
    return (
      <Segment style={{width:'96%'}}>
        <FetchingDataMessage />
        <LoadingCardGroup />
      </Segment>
    );
  }
}