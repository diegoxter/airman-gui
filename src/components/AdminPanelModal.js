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

const AdminPanelModal = ({network, isConnected}) => {
  const [open, setOpen] = useState(false)
  const [name, changeName] = useState('')
  const [nameInputValue] = useDebounce(name, 1500);
  const [contract, changeContract] = useState('')
  const [contractInputValue] = useDebounce(contract, 1500);
  const [amount, setAmount] = useState('')
  const [amountInputValue] = useDebounce(amount, 1500);
  const [isApproved, setApproved] = useState(false)

  const handleAmountChange = (num) => {
    console.log(num + ' was typed')
    console.log('type of num '+ (typeof num))
    setAmount(num)
  }

  const handleNameChange = (num ) => {
    console.log(num + ' was typed')
    console.log('type of num '+ (typeof num))
    changeName(num)
  }

  const handleContractChange = ( num ) => {
    console.log(num + ' was typed')
    console.log('type of num '+ (typeof num))
    changeContract(num)
  }

  const handleClick = () => {
    testInteraction(network)
  }

  // TO DO Draw the content we actually want
  return (
    //(isConnected) 
    //?
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
          </Button>
      }
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
                  onChange={(e) => handleNameChange(e.target.value)}
                >
                </Form.Input>

                <Form.Input
                  label='Token info'       
                  placeholder='Address: 0x...'
                  value={contract}
                  onChange={(e) => handleContractChange(e.target.value)}
                >
                </Form.Input>
                
                <Form.Input
                  placeholder='Amount to airdrop'
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)} 
                  >
                </Form.Input>
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
    /*:
    <Button 
          style={{
              width: '20%',
              position: 'absolute',
              top: '19px',
              right: '22px',
            }}
              color='red'
          >
          Not connected
    </Button>*/
  )
}

export default AdminPanelModal