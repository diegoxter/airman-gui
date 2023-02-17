import { Card, Image } from 'semantic-ui-react';
import { DeployedAirdropModal, LoadingAirManList } from './DeployedElements'


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