import { Card, Image, Segment, Divider } from 'semantic-ui-react';
import { LoadingCardGroup, FetchingDataMessage, NoElementsFoundMessage } from '../CommonComponents';
import { DeployedAirdropModal } from './ModalElements/DeployedListElements';


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
          {instances.map((instance) => (
            <Card key={instance.id} style={{marginLeft: '15px', width: '22%'}}>
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

          <NoElementsFoundMessage whatIsBeingLookedFor='Airdrop Managers'/>
          <Divider hidden/>
          <LoadingCardGroup />

        </Segment>
      );
    }
  } else {
    return (
      <Segment style={{width:'96%'}}>
        <FetchingDataMessage />
        <LoadingCardGroup />
      </Segment>
    );
  }
}