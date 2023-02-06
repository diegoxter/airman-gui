import React,{ useState, Component } from 'react'
import { Button, Image, Modal, Form, Checkbox, Grid } from 'semantic-ui-react'
import { useDebounce } from "use-debounce";
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
const InputWithApproveButton = () => {
  const [amount, setAmount] = useState('')
  const [isApproved, setApproved] = useState(false)
  const [inputValue] = useDebounce(amount, 1500);

  const handleChange = (num) => {
    setAmount(num)
  }

  // probable source https://stackoverflow.com/questions/36683770/how-to-get-the-value-of-an-input-field-using-reactjs
  // https://dineshigdd.medium.com/how-to-handle-user-input-in-react-functional-component-1cd0cb31d87c
  // see https://react-hook-form.com/get-started
  console.log("test a " + inputValue)
  console.log("test b " + amount)

      return (
          <Form.Input
            placeholder='Amount to airdrop'
            value={amount}
            onChange={(e) => handleChange(e.target.value)} 
            >
          </Form.Input>
        )
   /* } else {
      console.log(this.amount + ' test3')
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
          onBlur={this.handleBlur}
          value={this.amount}
          onChange={this.handleChange} 
          />
      )
    }*/
}


const AdminPanelModal = ({network}) => {
  const [open, setOpen] = useState(false)
  const [name, changeName] = useState('')

  const handleChange = (e, { num }) => {
    console.log(num + ' was typed')
    console.log('type of num '+ (typeof num))
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
                
                <Form.Input
                  label='Project name'       
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => handleChange(e.target.value)}
                >
                </Form.Input>

                <Form.Input
                  label='Token info'       
                  placeholder='Address: 0x...'
                  value={name}
                  onChange={(e) => handleChange(e.target.value)}
                >
                </Form.Input>
                
                <InputWithApproveButton/>

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