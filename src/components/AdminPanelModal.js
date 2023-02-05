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

// TO DO turn this component its own separated file 
const InputWithApproveButton = ({amount, isApproved, handleChange}) => {
  const handleBlur = () => {
    console.log('test0 ' +amount)
  }
  console.log(amount + ' test1')
  
  if (amount !== '') {
    console.log('test2 '+ amount)
    return (
        <Form.Input
          placeholder='Amount'
          value={amount}
          onChange={handleChange} 
          >
        </Form.Input>
      )
  } else {
    console.log(amount + ' test3')
    return (
        <Form.Input 
        action={{
          color: 'teal',
          labelPosition: 'left',
          icon: 'cart',
          content: 'Approve',
        }}
        actionPosition='right'
        placeholder='Amount' 
        onBlur={handleBlur}
        value={amount}
        onChange={handleChange} 
        />
    )
  }
}


const AdminPanelModal = ({network}) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isApproved, setApproved] = useState(false)

  const handleChange = (e, { num }) => {
    setAmount(num) 
    console.log('you typed '+ num + ' type of num '+ (typeof num))
  }

  const handleClick = () => {
    testInteraction(network)
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

        <Grid columns={2} divided>
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
                  <InputWithApproveButton 
                  amount={amount} 
                  isApproved={isApproved} 
                  handleChange={handleChange} 
                  />
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