import { useState, useEffect } from 'react';
import { getCampaignInformation } from '../../interactions/airmanSystem'
import { checkBalance } from '../../interactions/erc20';
import { 
  Card, 
  Image, 
  Button, 
  Grid, 
  Placeholder, 
  Segment,
  Modal,
  Header,
  Form,
  Checkbox
} from 'semantic-ui-react';

const LoadingAirManList = () => {
  return (
    <Grid columns={3} stackable>
      <Grid.Column>
        <Segment raised>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length='medium' />
              <Placeholder.Line length='short' />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
  
      <Grid.Column>
        <Segment raised>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length='medium' />
              <Placeholder.Line length='short' />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
  
      <Grid.Column>
        <Segment raised>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length='medium' />
              <Placeholder.Line length='short' />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

async function checkContractBalance(_instanceAddress, _tokenContractAddress) {
  const x = await checkBalance(_instanceAddress, _tokenContractAddress);

  return x;
}

const NewAirdropModal = ({ instanceAddress, instanceToken }) => {
  const [open, setOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [hasFixedAmount, setHasFixedAmount] = useState(false);

  if (open && tokenBalance === 0) {
    checkContractBalance(instanceAddress, instanceToken)
    .then((value) => {
      setTokenBalance(value);
    })
  }

  const handleClose = () => {
    setOpen(false);
    setTokenBalance(0);
  }

  const handleCheckboxChange = () => {
    if (hasFixedAmount) {
      setHasFixedAmount(false);
    } else {
      setHasFixedAmount(true);
    }
  }

  return (
    <Modal
      closeIcon
      size='tiny'
      open={open}
      trigger={<Button color='olive'> Deploy new airdrop </Button>}
      onClose={() => handleClose()}
      onOpen={() => setOpen(true)}
    >
      <Header icon='archive' > Tokens held in AirMan: {tokenBalance}</Header >

      <Modal.Content>
        <Form>
          <Form.Field      
          error={{
            content: 'Please enter a valid email address',
            pointing: 'above',
          }}>
            <label>Time (in seconds) to end the campaign:</label>
            <input placeholder='Seconds to end the campaign...' />
          </Form.Field>
          <Form.Field
          error={{
            content: 'Please enter a valid email address',
            pointing: 'below',
          }}>
            <label>Total amount to airdrop</label>
            <input placeholder='Tokens to give...' />
          </Form.Field>
          <Form.Field>
            <Checkbox 
            label='Has fixed amount per user?'
            onChange={() => handleCheckboxChange()} 
            />
          </Form.Field>
          {(hasFixedAmount)
          ?
          <Form.Field
          error={{
            content: 'Please enter a valid email address',
            pointing: 'above',
          }}>
            <label>Amount for each participant</label>
            <input placeholder='Amount...' />
          </Form.Field>
          :
          <Form.Field disabled>
          <label>Amount for each participant</label>
          <input placeholder='Amount...' />
          </Form.Field>}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button color='green' onClick={() => setOpen(false)}>
          Deploy
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

async function fetchCampaignData(_instanceAddress) {
  const data = await getCampaignInformation(_instanceAddress);

  return data;
}

const DeployedAirdropModal = ({ instanceAddress, instanceToken }) => {
  const [open, setOpen] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (open) {
    fetchCampaignData(instanceAddress)
    .then((value) => {
      console.log(value);
    })
  }

  const handleCreateNewCampaign = () => {

  }

  return (
    <Modal
      //dimmer='blurring'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color='violet'> Manage Airdrop Campaigns </Button>}
    >
      <Modal.Header>Deployed campaigns</Modal.Header>
      <Modal.Content image scrolling>
        <Card.Group>
          <Card>
            <Card.Content>
              <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
              />
              <Card.Header>Steve Sanders</Card.Header>
              <Card.Meta>Friends of Elliot</Card.Meta>
              <Card.Description>
                Steve wants to add you to the group <strong>best friends</strong>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className='ui two buttons'>
                <Button basic color='green'>
                  Approve
                </Button>
                <Button basic color='red'>
                  Decline
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => setOpen(false)}>
          Close
        </Button>
        <NewAirdropModal
          instanceAddress={ instanceAddress } 
          instanceToken= { instanceToken }
        />
      </Modal.Actions>
    </Modal>
  );
}

export const DeployedAirManList = ({ 
  network, 
  accounts, 
  isConnected, 
  instances, 
  checkedInstances, 
  setCheckedInstances 
}) => {
  const cleanAddress = (_address) => {
    let firstHalf = _address.substr(0, 3);
    let secondHalf = _address.substr(38, 4);

    return firstHalf+'...'+secondHalf;
  }

  if (checkedInstances) {
    if (instances.length > 0) {
      return (
        <Card.Group>
          {instances.map((instance) => (
              <Card key={instance.id}>
                <Card.Content>
                  <Image
                      floated='right'
                      size='mini'
                      src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                  />
                  <Card.Header>{`AirMan instance #${Number(instance.id['_hex'])}`}</Card.Header>
                  <Card.Meta>Address: {cleanAddress(instance.instanceAddress)}</Card.Meta>
                  <Card.Description>
                    Token: {cleanAddress(instance.instanceToken)}
                  </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                  <div className='button'>
                      <DeployedAirdropModal 
                      instanceAddress={ instance.instanceAddress } 
                      instanceToken= { instance.instanceToken }
                      />
                  </div>
                </Card.Content>
              </Card>        
          ))}
        </Card.Group>
    ); 
  } else { // TO DO there should be some text here like "Deploy your own"
    return( <LoadingAirManList /> );
  }
  } else {
    return( <LoadingAirManList /> );
  }
}