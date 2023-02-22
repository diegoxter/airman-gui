import { useState } from 'react';
import { Button, Image, Modal, Form, Checkbox, Grid } from 'semantic-ui-react';
import { useDebounce } from "use-debounce";
import { isSupportedNetwork } from '../../interactions';
import { DeployButton, TokenContractInput } from './ModalElements/DeployModalElements';

export const AdminPanelModal = ({ network, accounts, isConnected, setCheckedInstances }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameInputValue] = useDebounce(name, 1500);
  const [isValidContract, setIsValidContract] = useState(undefined);
  const [contract, setContract] = useState('');
  const [contractInputValue] = useDebounce(contract, 1000);
  const [symbolCheck, setSymbolCheck] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [amountInputValue] = useDebounce(amount, 600);
  const [tokenAmount, setTokenAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(undefined);
  const [allowance, setAllowance] = useState('');

  // Testing purposes
  const testChange = () => {
    console.log(`test is ${isValidAmount}`);
  }

  const handleNameChange = (num) => {
    console.log(num + ' was typed');
    console.log('type of num '+ (typeof num));
    setName(num);
  }

  const handleAmountChange = (num) => {
    setAmount(num);
    setIsValidAmount((Number(num) > 0) && !isNaN(num));
  }

  const handleCancelClick = () => {
    setOpen(false);
    setIsValidAmount(false);
    setSymbolCheck(false);
    setAllowance('');
    setContract('');
    setAmount('');
    setName('');
    setTokenAmount('');
    setTokenSymbol('');
  }

  const divStyle = {
    marginLeft: '10px',
    marginTop: '9px',
  };

  const buttonStyle = {
    marginLeft: '25%',
    marginTop: '8px',
  };

  // TO DO Draw the content we actually want
  return (
    (isSupportedNetwork(network) && isConnected) 
    ?
    <Modal
      onClose={() => handleCancelClick()}
      onOpen={() => setOpen(true)}
      open={ open }
      trigger={<Button style={divStyle} color='yellow' content='Deploy'/>
      }
    >
      <Modal.Header>Lorem Ipsum</Modal.Header>
      <Modal.Content image>

        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column >
              <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
              <Button style={buttonStyle} content='Attach token logo' />
            </Grid.Column>

            <Grid.Column>
              <Form>
                <Grid.Row>
                  <Form.Input
                    label='Project name'       
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />

                  <TokenContractInput 
                    accounts={ accounts }
                    network={ network }
                    setIsValidContract= { setIsValidContract }
                    contract={ contract }
                    setContract={ setContract }
                    contractInputValue={ contractInputValue }
                    symbolCheck={ symbolCheck }
                    setAllowance= { setAllowance }
                    setTokenSymbol={ setTokenSymbol }
                    setSymbolCheck={ setSymbolCheck }
                    setTokenAmount={ setTokenAmount }
                  />
                
                  <Form.Input
                    label={`Tokens held: ${tokenAmount} ${tokenSymbol}`}
                    placeholder='Amount for AirMan to manage'
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)} 
                  />

                  <Form.Field>
                    <Checkbox label='Placeholder' />
                  </Form.Field>

                  <Button type='submit' onClick={testChange} content='Submit' />

                </Grid.Row>
              </Form>
            </Grid.Column>

            <Grid.Column>
              <Form>
                <Form.Field label='Project description' control='textarea' rows='12' />
              </Form>
            </Grid.Column>


            </Grid.Row>
        </Grid>
  </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => handleCancelClick()}>
          Cancel
        </Button>
        <DeployButton
          network={ network }
          setOpen={ setOpen }
          amount={ amount }
          amountInputValue={ amountInputValue }
          contractInputValue={ contractInputValue } 
          accounts={ accounts }
          isValidContract={ isValidContract }
          isValidAmount={ isValidAmount }
          setCheckedInstances={ setCheckedInstances }
          allowance={ allowance }
          setAllowance={ setAllowance }
          handleCancelClick={ handleCancelClick }
        />
      </Modal.Actions>
    </Modal>
    :
    <div>
      <Button 
            style={{
                right: '22px',
              }}
                color='red'
            >
            Not connected
      </Button>
    </div>
  );
}