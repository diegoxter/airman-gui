import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
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
  const [open, setOpen] = React.useState(false)

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
        <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
        <Modal.Description>
          <Header>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</Header>
          <p> 
          Aenean commodo ligula eget dolor. Aenean massa strong. 
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          </p>
          <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</p>
        </Modal.Description>
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