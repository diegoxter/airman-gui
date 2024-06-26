import { Card, Image, Segment, Divider } from 'semantic-ui-react';
import { cleanAddress } from '../../interactions';
import { LoadingCardGroup, FetchingDataMessage, NoElementsFoundMessage } from '../CommonComponents';
import { DeployedAirdropModal } from './ModalElements/DeployedListElements';


export const DeployedAirManList = ({ network, accounts, instances, checkedInstances, }) => {

  if (checkedInstances) {
    if (instances.length > 0) {
      return (
        <Card.Group style={{width: '70%'}}>
          {instances.map((instance) => (
            <Card key={instance.id} style={{marginLeft: '15px', width: '25%'}}>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header> {`AirMan instance #${Number(instance.id['_hex'])}`} </Card.Header>
                <Card.Meta> Address: {cleanAddress(instance.instanceAddress, 4, 38)} </Card.Meta>
                <Card.Description>
                  Token: {cleanAddress(instance.instanceToken, 4, 38)}
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