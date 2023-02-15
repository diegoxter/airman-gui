import { Card, Image, Button, Grid, Placeholder, Segment } from 'semantic-ui-react'

export const DeployedAirManList = ({ network, accounts, isConnected, instances, checkedInstances }) => {  

  if (checkedInstances && instances.length !== 0) {
    return (
      <Card.Group>
        {instances.map((instance) => (
          <div key={instance.id}>
            <Card>
              <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{`AirMan instance #${Number(instance.id['_hex'])}`}</Card.Header>
                <Card.Meta>{instance.instanceAddress}</Card.Meta>
                <Card.Description>
                  {instance.instanceToken}
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
          </div>
        ))}
        </Card.Group>
    );
  } else {
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
    )
  }
}