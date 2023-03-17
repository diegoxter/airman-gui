import { useState, useRef } from 'react';
import { Grid, Card, Segment, Divider, Checkbox, Modal, Button, Form, Popup, Icon, Header, Image } from 'semantic-ui-react';
import { LoadingCardGroup, NotConnectedMessage, RefreshButton, CopyButton } from '../CommonComponents';
import { AdminPanelModal } from './DeployAirmanModal';
import { DeployedAirManList } from './DeployedAirManList';
import { getEtherBalance, cleanAddress, getAdmPanAddress, weiToEther } from '../../interactions';
import { getInstanceInfoByOwner, isAdminAddress, getAirManInstancesMetadata, setNewFee, withdrawEther, getDeployedInstances, getFee } from '../../interactions/airmanSystem';

const AdminModal = ({ network }) => {
  const [ open, setOpen ] = useState(false);
  const [ instanceBalance, setInstanceBalance ] = useState('');
  const [ currentFee, setCurrentFee ] = useState('');
  const [ deployedInstances, setDeployedInstances ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ newFeeInEther, setNewFeeInEther ] = useState('');
  const [ isValidFee, setIsValidFee ] = useState(false);
  const [ newAdminAddress, setNewAdminAddress ] = useState('')
  const [ removeAdminAddress, setRemoveAdminAddress ] = useState('')
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const adminPanelAddress = getAdmPanAddress(network);
  const adminRole = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'

  const onFileChange = (e) => {
    const size = (e.size / 1024 / 1024).toFixed(2);

    if (size > 2) {
      alert("File must be less than 2 MB");
    } else {
      setSelectedFile(e);
    }
  }

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  if (deployedInstances === '') {
    getDeployedInstances(network)
    .then((value) => setDeployedInstances(value))
  }

  if (instanceBalance === '') {
    getEtherBalance(adminPanelAddress)
    .then((value) => {
      setInstanceBalance(value)
    })
  }

  if (currentFee === '') {
    getFee(network)
    .then((value) => {setCurrentFee((weiToEther(value)))})
  }

  const handleFeeChange = (value) => {
    setNewFeeInEther(value)
    setIsValidFee(!isNaN(value) && value !== '')
  }

  const handleNewAdminChange = (value) => {
    setNewAdminAddress(value)
  }

  const handleRemoveAdminChange = (value) => {
    setRemoveAdminAddress(value)
  }

  const handleWithdrawEtherClick = () => {
    setIsLoading(true);
    withdrawEther(network, setIsLoading)
    .then(() => {
      new Promise(r => setTimeout(r, 4500))
      .then(
        setInstanceBalance('')
      )
    })
  }

  const handleSetFeeClick = () => {
    setIsLoading(true);
    setNewFee(network, newFeeInEther, setIsLoading)
    .then((value) => {
      if (value === true) {
        new Promise(r => setTimeout(r, 4500))
        .then(() => {
          setCurrentFee('');
          setIsValidFee(false);
          setNewFeeInEther('');
        })
      }
    })
  }

  const handleDeployFreeAirmanClick = () => {
    console.log('Free AirMan click')
  }

  const handleClose = () => {
    setIsLoading(false);
    setInstanceBalance('');
    setCurrentFee('');
    setNewFeeInEther('');
    setOpen(false);
    setIsValidFee(false);
  }

  const buttonStyle = {
    width: '100%',
    marginTop: '6px',
  };

  return (
    <Modal
      size='tiny'
      onClose={() => handleClose()}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>
        <Grid>
          <Grid.Row>
            <Grid.Column as='h1' floated='left' width={10}>
              Admin Panel management <br/>
              <p style={{fontSize: '12px', marginTop:'20px'}}>
          Instance address: {cleanAddress(adminPanelAddress, 4, 38)} <CopyButton dataToCopy={adminPanelAddress} />
          <br />
          Deployed instances: {Number(deployedInstances)} </p>
            </Grid.Column>

            <Grid.Column floated='right' width={5}>
              Ether held in contract: <br/>
              <Segment textAlign='center'>{instanceBalance} ether</Segment>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </Modal.Header>
      <Modal.Content scrolling>
        <Header as='h4'>
          <Icon name='superpowers' />
          Admin functions
        </Header>
        <Form>
          <Form.Group>
            <Form.Input placeholder='New fee in wei...' inline onChange={(e) => handleFeeChange(e.target.value)}/>
            <Popup content='Click to change the fee' position='top center' trigger={
              <Button
                loading={isLoading}
                disabled={!isValidFee || currentFee === (weiToEther(Number(newFeeInEther)))}
                content={(!isNaN(newFeeInEther) && currentFee === (weiToEther(Number(newFeeInEther))))? 'New fee is equal to current fee':`Current fee: ${currentFee} Ξ`}
                onClick={handleSetFeeClick}
              />
            }
            />
          </Form.Group>
            {(newFeeInEther !== '' && !isNaN(newFeeInEther) && currentFee !== (weiToEther(Number(newFeeInEther))))
            ?
            `New fee in ether: ${weiToEther(Number(newFeeInEther))}`
            :
            `No valid new fee input`
            }
          <Divider hidden/>
          <Form.Group>
            <Form.Input placeholder='Address to add as admin' inline onChange={(e) => handleNewAdminChange(e.target.value)}/>
            <Button
              loading={isLoading}
              disabled={newAdminAddress <= 42}
              content='Add admin'
              onClick={() => console.log('Add new admin click')}
            />
          </Form.Group>

          <Form.Group>
            <Form.Input placeholder='Address to remove admin' inline onChange={(e) => handleRemoveAdminChange(e.target.value)}/>
            <Button
              loading={isLoading}
              disabled={removeAdminAddress <= 42}
              content='Remove admin'
              onClick={() => console.log('Remove admin click')}
            />

          </Form.Group>
          <Divider hidden/>

          <Divider horizontal>
            <Header as='h4'>
              <Icon name='certificate' />
              Deploy a free Airdrop Manager instance
            </Header>
          </Divider>

          {
              (selectedFile === null)
              ?
              <Icon
                size='massive'
                name='cloud upload'
                style={{ display: 'block', margin: 'auto' }}
              />
              :
              <Image
                size='small'
                src={URL.createObjectURL(selectedFile)}
                wrapped
                style={{ display: 'block', margin: 'auto' }}
              />
            }
            <Button style={buttonStyle} content='Attach token logo' onClick={handleButtonClick} fluid/>
            <Button
              disabled={selectedFile === null}
              size='mini'
              fluid
              style={buttonStyle}
              color='red'
              content='Remove image'
              onClick={() => setSelectedFile(null)}
              />

            <input
              style={{ display: "none" }}
              ref={inputRef}
              type="file"
              accept='.png,.jpg,.jpeg,.svg'
              onChange={(e) => onFileChange(e.target.files[0])}
            />
        <Form.Group>
          <Form.Field>
            <label>Owner address</label>
            <input placeholder='0x...' />
          </Form.Field>
          <Form.Field>
            <label>Token address</label>
            <input placeholder='0x...' />
          </Form.Field>
          <Form.Field>
            <label>Initial balance</label>
            <input placeholder='Amount' />
          </Form.Field>
        </Form.Group>
        <Button fluid onClick={handleDeployFreeAirmanClick}>Deploy</Button>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => handleClose()}>
          Close
        </Button>
        <Button
          loading={isLoading}
          content="Withdraw Ether"
          disabled={(Number(instanceBalance) <= 0)}
          color='orange'
          labelPosition='right'
          icon='checkmark'
          onClick={handleWithdrawEtherClick}
        />
      </Modal.Actions>
    </Modal>
  );
}

export const AirdropManagerTab = ({ network, accounts, isConnected }) => {
  const [ isAdmin, setIsAdmin ] = useState('')
  const [ instances, setInstances ] = useState('');
  const [ checkedInstances, setCheckedInstances ] = useState(false);
  const [ instancesImageData, setInstancesImageData ] = useState([]);
  const [ instancesProjectInfo, setInstancesProjectInfo ] = useState([]);
  const [ instancesMetadataChecked, setInstancesMetadataChecked ] = useState(false)

  if (network !== '' && accounts !== '' && checkedInstances === false) {
    getInstanceInfoByOwner(network, accounts)
    .then((value) => {
      setInstances(value);
      setCheckedInstances(true);
    })

    if (isAdmin === '') {
      isAdminAddress(network, accounts)
      .then((value) => setIsAdmin(value))
    }

  }

  if (network !== '' && instances !== '' && instancesMetadataChecked === false ) {
    getAirManInstancesMetadata(network, instances)
    .then((result, i) => {
      const tempImageDataArray = [];
      const tempProjectInfoArray = [];

      for (let index = 0; index < result.length; index++) {
        tempProjectInfoArray[index] = (result[index])[0];
        tempImageDataArray[index] = (result[index])[1];
      }

      setInstancesProjectInfo(tempProjectInfoArray);
      setInstancesImageData(tempImageDataArray);
      setInstancesMetadataChecked(true);
    })
  }

  const handleRefreshClick = () => {
    setInstances('');
    setCheckedInstances(false);
    setInstancesMetadataChecked(false);
  }

  return(
    <Grid divided='vertically'>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Card style={{width: '85%'}}>
            <Grid celled='internally'>
              <Grid.Column width={11}>

                <Card.Content>
                  <Card.Header content='Deploy a new Airdrop Manager'/>
                  <Card.Description>
                    Create a new Airdrop Manager for your community!
                  </Card.Description>
                </Card.Content>
              </Grid.Column>

              <Grid.Column width={5}>
                <AdminPanelModal
                  network={ network }
                  accounts={ accounts }
                  isConnected={ isConnected }
                  setInstances={ setInstances }
                  setCheckedInstances={ setCheckedInstances }
                  setInstancesMetadataChecked={ setInstancesMetadataChecked }
                />
              </Grid.Column>
            </Grid>
          </Card>
        </Grid.Column>

        {(isConnected  && isAdmin)
        ?
        <Grid.Column>
          <Card style={{width: '55%'}}>
            <Grid celled='internally'>
              <Grid.Column width={10}>

                <Card.Content>
                  <Card.Header content='Owner space'/>
                  <Card.Description>
                    Manage the Admin Panel!
                  </Card.Description>
                </Card.Content>
              </Grid.Column>

              <Grid.Column width={5}>
                <AdminModal style={{width: '90%'}} network={ network }/>
              </Grid.Column>
            </Grid>
          </Card>
        </Grid.Column>
        :
        false
        }
      </Grid.Row>

      <Grid.Row columns={'equal'}>
        <Grid.Column>
          <Checkbox toggle label='Show empty'/>
        </Grid.Column>

        <RefreshButton color='blue' execOnClick={handleRefreshClick}/>

      </Grid.Row>

    <Grid.Row>
      {(isConnected)
      ?
      <DeployedAirManList
        network={ network }
        accounts={ accounts }
        isConnected={ isConnected }
        instances={ instances }
        checkedInstances={ checkedInstances }
        instancesImageData={ instancesImageData }
        instancesProjectInfo={ instancesProjectInfo }
      />
      :
      <Grid.Column >
        <Segment>
          <NotConnectedMessage />
          <Divider hidden />
          <LoadingCardGroup />
        </Segment>
      </Grid.Column>
      }

      </Grid.Row>
    </Grid>
  );
}