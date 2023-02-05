import { useState } from 'react'
import { Button, Header, Image, Modal, Form, Checkbox, Grid, Input } from 'semantic-ui-react'
import { ethers } from "ethers";
import activeNetworkContractAddr from '../interactions/data/contracts';

import adminPanelAbi from '../assets/abis/AdminPanel.json'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const testInteraction = async (network) => {
  // potential source https://docs.metamask.io/guide/sending-transactions.html#example
  // https://docs.ethers.org/v5/api/
  const adminPanelInstance = new ethers.Contract(activeNetworkContractAddr(network), adminPanelAbi, provider)
  
  console.log(await adminPanelInstance.connect(signer).owner())
}

const AdminPanelModal = ({network}) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(10)

  const handleClick = () => {
    testInteraction(network)
  }

  // TO DO turn this component its own separated file 
  const InputWithApproveButton = ({ approvedamount }) => {
    const [amount, setNewAmount] = useState(undefined)

    function handleChange(event) {
      setNewAmount(event)
    }

    function handleBlur() {
      console.log('test ' +amount)
      console.log('testcito '+approvedamount)
    }

    
    if (amount > 0) {
      console.log(amount)

      return (
        <Input placeholder='Amount' loading icon='user' onBlur={handleBlur()}/>
      )
    } else {
      console.log('pipi '+ amount)

      return (
        <Input
        action={{
          color: 'teal',
          content: 'Approve',
        }}
        actionPosition='right'
        placeholder='Amount'
        onBlur={handleBlur()}
      />
      )
    }
  }

  // TO DO Draw the content we actually want
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button 
        style={{
            width: '20%',
            position: 'absolute',
            top: '19px',
            right: '22px',
          }}
            basic color='green'
      >
        Deploy
    </Button>}
    >
      <Modal.Header>Lorem Ipsum</Modal.Header>
      <Modal.Content image>

        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
              <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
            </Grid.Column>

            <Grid.Column>
              <Form>
                <Grid.Row>
                
                <Form.Field>
                  <label>Project name</label>
                  <input placeholder='Name' />
                </Form.Field>

                <Form.Field>
                  <label>Token info</label>
                  <input placeholder='Address: 0x...' />
                </Form.Field>
                
                <Form.Field>
                  <InputWithApproveButton amountset={amount} approvedamount={100} />
                </Form.Field>

                <Form.Field>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                  <Button type='submit'>Submit</Button>

                </Grid.Row>
              </Form>
            </Grid.Column>

            </Grid.Row>
        </Grid>
  </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Let's do it!"
          onClick={() => {
            handleClick();
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default AdminPanelModal