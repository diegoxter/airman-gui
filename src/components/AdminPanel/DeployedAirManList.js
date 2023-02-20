import { Card, Image, Segment, Message, Icon } from 'semantic-ui-react';
import { LoadingCardGroup } from '../CommonComponents';
import { DeployedAirdropModal } from './ModalElements/DeployedListElements'


export const DeployedAirManList = ({ 
  network, 
  accounts, 
  instances, 
  checkedInstances, 
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
          {instances.map((instance) => ( // aqui
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
                  accounts={ accounts }
                  network={ network }
                  instanceNumer={ Number(instance.id) }
                  instanceAddress={ instance.instanceAddress } 
                  instanceToken= { instance.instanceToken }
                  />
                </div>
              </Card.Content>
            </Card>        
          ))}
        </Card.Group>
      ); 
    } else {
      return( 
        <Segment style={{width:'100%'}}>
          <Message warning icon style={{textAlign: 'center'}}>
            <Icon name='exclamation'/>
            <Message.Content>
              <Message.Header>No airdrop managers found!</Message.Header>
              <p>How about deploying one today? ;)</p>
            </Message.Content>
          </Message>

          <LoadingCardGroup /> 

        </Segment>
      );
    }
  }
}