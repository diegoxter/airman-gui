import React,{ useState } from 'react'
import { Button, Image, Modal, Form, Checkbox, Grid } from 'semantic-ui-react'
import { useDebounce } from "use-debounce";
import { isSupportedNetwork } from '../../interactions';
import { DeployButton, TokenContractInput } from './ModalElements';

const AdminPanelModal = ({ network, accounts }) => {
  const [open, setOpen] = useState(false)
  const [name, changeName] = useState('')
  const [nameInputValue] = useDebounce(name, 1500);
  const [isValidContract, changeIsValidContract] = useState(undefined)
  const [contract, changeContract] = useState('')
  const [contractInputValue] = useDebounce(contract, 1500);
  const [amount, setAmount] = useState('')
  const [amountInputValue] = useDebounce(amount, 600);
  const [hasEnoughTokens, setHasEnoughTokens] = useState(false)
  const [isValidAmount, changeIsValidAmount] = useState(undefined)
  const [isApproved, setApproved] = useState(false)

  // Testing purposes

  const handleNameChange = (num ) => {
    console.log(num + ' was typed')
    console.log('type of num '+ (typeof num))
    changeName(num)
  }

  const handleAmountChange = (num) => {
    setAmount(num)
    if ((Number(num) > 0) && !isNaN(num)) {
      changeIsValidAmount(true)
    } else {
      changeIsValidAmount(false)
    }
  }

  const testChange = () => {
    if (isApproved === false) {
      setApproved(true)
    } else {
      setApproved(false)
    }
  }

  // TO DO Draw the content we actually want
  return (
    (isSupportedNetwork(network)) 
    ?
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={ open }
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

                <TokenContractInput 
                  isValidContract={ isValidContract } 
                  changeIsValidContract= { changeIsValidContract }
                  contract={ contract }
                  changeContract={ changeContract }
                  contractInputValue={ contractInputValue }
                />
                
                <Form.Input
                  placeholder='Amount to airdrop'
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)} 
                  >
                </Form.Input>
                <Form.Field>
                  <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                  <Button 
                    type='submit'
                    onClick={testChange}
                    >
                      Submit
                  </Button>

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
        <DeployButton 
          isApproved={ isApproved }
          setApproved={ setApproved }
          amount={ amount }
          amountInputValue={ amountInputValue }
          hasEnoughTokens={ hasEnoughTokens }
          setHasEnoughTokens={ setHasEnoughTokens }
          contractInputValue={ contractInputValue } 
          accounts={ accounts }
          isValidContract={ isValidContract }
          isValidAmount={ isValidAmount }
        />
      </Modal.Actions>
    </Modal>
    :
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
    </Button>
  )
}

export default AdminPanelModal