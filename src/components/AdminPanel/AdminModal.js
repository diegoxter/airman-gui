import { useState } from 'react';
import { Button, Form, Modal, Grid, Segment, Popup, Header, Icon, Divider } from 'semantic-ui-react';
import { useDebounce } from "use-debounce";
import { getEtherBalance, cleanAddress, getAdmPanAddress, weiToEther } from '../../interactions';
import { getFee, getDeployedInstances } from '../../interactions/airmanSystem';
import { CopyButton } from '../CommonComponents';

export const AdminModal = ({network}) => {
  const [open, setOpen] = useState(false);
  const [instanceBalance, setInstanceBalance] = useState('');
  const [currentFee, setCurrentFee] = useState('');
  const [deployedInstances, setDeployedInstances] = useState('');
  const adminPanelAddress = getAdmPanAddress(network);
  const newFeeInEther = 'Placeholder'
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
    .then((value) => {setCurrentFee(parseInt(weiToEther(value)).toLocaleString())})
  }

  const handleWithdrawEtherClick = () => {
    console.log('Withdraw Ether click')
  }

  const handleSetFeeClick = () => {
    console.log('Set fee click')
  }

  const handleDeployFreeAirmanClick = () => {
    console.log('Free AirMan click')
  }

  return (
    <Modal
      size='tiny'
      onClose={() => setOpen(false)}
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
      <Modal.Content>
        <Form>
          <Form.Group>
            <Form.Input placeholder='New fee in wei...' inline/>
            <Popup content='Click to change the fee' position='top center' trigger={
              <Button content={`Current fee: ${currentFee} Ξ`} onClick={handleSetFeeClick} />
            }
            />
          </Form.Group>
          New fee in ether {newFeeInEther}
          <Divider horizontal>
          <Header as='h4'>
            <Icon name='certificate' />
            Deploy a free Airdrop Manager instance
          </Header>
        </Divider>
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
        <Button color='red' onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button
          content="Withdraw Ether"
          disabled={!(Number(instanceBalance) > 0)}
          color='orange'
          labelPosition='right'
          icon='checkmark'
          onClick={() => handleWithdrawEtherClick()}
        />
      </Modal.Actions>
    </Modal>
  );
}