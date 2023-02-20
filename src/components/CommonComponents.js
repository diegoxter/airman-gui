import { 
    Grid, 
    Placeholder, 
    Segment,
    Message,
    Icon
} from 'semantic-ui-react';

export const LoadingCardGroup = () => {

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

export const FetchingDataMessage = () => {

  return(
    <div>
      <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content style={{textAlign: 'center'}}>
          <Message.Header>Just one second</Message.Header>
          Fetching blockchain content.
        </Message.Content>
      </Message>

      <LoadingCardGroup />  
    </div>
  )
}

export const NotConnectedMessage = () => {

  return (
    <div>
      <Message negative style={{textAlign: 'center'}}>
        <Message.Header >
          Not Connected
        </Message.Header>
        <p>Please connect your wallet</p>
      </Message>
    </div>
  )
}

export const NoElementsFoundMessage = ({whatIsBeingLookedFor}) => {

  return(
    <div>
      <Message warning icon style={{textAlign: 'center'}}>
        <Icon name='exclamation'/>
        <Message.Content>
          <Message.Header>No {whatIsBeingLookedFor} found!</Message.Header>
          <p>How about deploying one today? ;)</p>
        </Message.Content>
      </Message>
    </div>
  )
}