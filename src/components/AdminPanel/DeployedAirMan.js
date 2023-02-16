import { Card, Image, Button, Grid, Placeholder, Segment } from 'semantic-ui-react';

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

export const DeployedAirManList = ({ network, accounts, isConnected, instances, checkedInstances }) => {
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
                      <Button color='green'>
                      Placeholder
                      </Button>
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