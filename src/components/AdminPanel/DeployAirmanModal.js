import React, { useState } from 'react';
import { Button, Image, Modal, Form, Checkbox, Grid, Header, Divider } from 'semantic-ui-react';
import { useDebounce } from "use-debounce";
import { isSupportedNetwork, weiToEther } from '../../interactions';
import { getFee } from '../../interactions/airmanSystem';
import { DeployButton, TokenContractInput } from './ModalElements/DeployModalElements';

export const AdminPanelModal = ({ network, accounts, isConnected, setCheckedInstances }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectURL, setProjectURL] = useState('');
  const [projectTwitter, setProjectTwitter] = useState('');
  const [projectTelegram, setProjectTelegram] = useState('');
  const [projectDiscord, setProjectDiscord] = useState('');
  const [checked, setChecked] = useState(false);
  const [isValidContract, setIsValidContract] = useState(undefined);
  const [contract, setContract] = useState('');
  const [contractInputValue] = useDebounce(contract, 1000);
  const [symbolCheck, setSymbolCheck] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('')
  const [amount, setAmount] = useState('');
  const [amountInputValue] = useDebounce(amount, 600);
  const [tokenAmount, setTokenAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(undefined);
  const [allowance, setAllowance] = useState('');
  const [feeToDeploy, setFeeToDeploy] = useState(0)

  if (feeToDeploy === 0) {
    getFee(network)
    .then((value) => {setFeeToDeploy(weiToEther(Number(value)))})
  }

  // Testing purposes
  const jsonStringify = () => {
    const projectInfo = {
      name,
      projectDescription,
      projectURL,
      projectTwitter,
      projectTelegram,
      projectDiscord
    };

    const json = JSON.stringify(projectInfo);

    return json;
  }

  const handleNameChange = (value) => {
    setName(value);
  }

  const handleProjectDescriptionChange = (value) => {
    setProjectDescription(value);
  }

  const handleProjectURLChange = (value) => {
    setProjectURL(value);
  }

  const handleProjectTwitterChange = (value) => {
    setProjectTwitter(value);
  }

  const handleProjectTelegramChange = (value) => {
    setProjectTelegram(value);
  }

  const handleProjectDiscordChange = (value) => {
    setProjectDiscord(value);
  }

  const handleAmountChange = (num) => {
    setAmount(num);
    setIsValidAmount((Number(num) > 0) && !isNaN(num) && (num * 10 ** Number(tokenDecimals)) <= Number(tokenAmount));
  }

  const handleCheckboxChange = () => {
    setChecked(!checked)
  }

  const handleCancelClick = () => {
    setOpen(false);
    setChecked(false);
    setIsValidAmount(false);
    setSymbolCheck(false);
    setAllowance('');
    setContract('');
    setAmount('');
    setName('');
    setTokenAmount('');
    setTokenSymbol('');
  }

  const buttonStyle = {
    width: '100%',
    marginTop: '6px',
  };

  return (
    (isSupportedNetwork(network) && isConnected)
    ?
    <Modal
      onClose={() => handleCancelClick()}
      onOpen={() => setOpen(true)}
      open={ open }
      trigger={<Button style={buttonStyle} color='yellow' content='Deploy'/>
      }
    >
      <Modal.Header>Deploy your Airdrop Manager instance for {feeToDeploy} ether</Modal.Header>
      <Modal.Content image>

        <Grid celled='internally'>
          <Grid.Row>

            <Grid.Column width={5}>
              <Form>
                <Form.Input
                  label='Project name'
                  placeholder='Enter name'
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </Form>
              <Divider />

              <Image
                size='small'
                src='https://react.semantic-ui.com/images/avatar/large/rachel.png'
                wrapped
                style={{ display: 'block', margin: 'auto' }}
              />
              <Button style={buttonStyle} content='Attach token logo' />

            </Grid.Column>

            <Grid.Column width={6}>
              <Header as='h2'>
                Project data <br/> <p style={{fontSize:'10px'}}>(You can edit this later at a cost)</p>
              </Header>
              <Form>
                <Form.Input
                  placeholder='Project description...'
                  control='textarea'
                  rows='5'
                  onChange={(e) => handleProjectDescriptionChange(e.target.value)}
                />
                <Form.Input placeholder='Project URL...' onChange={(e) => handleProjectURLChange(e.target.value)}/>
                <Form.Input placeholder='Twitter...' onChange={(e) => handleProjectTwitterChange(e.target.value)}/>
                <Form.Input placeholder='Telegram...' onChange={(e) => handleProjectTelegramChange(e.target.value)}/>
                <Form.Input placeholder='Discord...' onChange={(e) => handleProjectDiscordChange(e.target.value)}/>
              </Form>
            </Grid.Column>

            <Grid.Column width={5}>
              <Form>
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
                    setTokenDecimals={ setTokenDecimals }
                    setTokenAmount={ setTokenAmount }
                  />

                  <Form.Input
                    label={`Tokens held: ${((tokenAmount  / 10 ** Number(tokenDecimals)).toLocaleString('en-US'))} ${tokenSymbol}`}
                    placeholder='Amount for AirMan to manage'
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                  />

                  <Form.Field>
                    <Checkbox label="I agree that any changes to these informations will incur a fee" onChange={()=> handleCheckboxChange()}/>
                  </Form.Field>

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
          checked={ checked }
          amountInputValue={ amountInputValue }
          tokenDecimals={ tokenDecimals }
          contractInputValue={ contractInputValue }
          accounts={ accounts }
          isValidContract={ isValidContract }
          isValidAmount={ isValidAmount }
          setCheckedInstances={ setCheckedInstances }
          allowance={ allowance }
          setAllowance={ setAllowance }
          handleCancelClick={ handleCancelClick }
          jsonStringify={ () => jsonStringify() }
        />
      </Modal.Actions>
    </Modal>
    :
    <div>
      <Button style={buttonStyle} color='red' >
          Not connected
      </Button>
    </div>
  );
}