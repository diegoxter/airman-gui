import { Grid, Placeholder, Segment, Message, Button, Icon, Form, TextArea } from 'semantic-ui-react';

export const ProjectInfo = ({ projectInfoSource, drawButton }) => {

  return (
    <div>
    { drawButton ? <Button disabled icon='pencil' floated='right' onClick={() => console.log('click')}/> : false}
    <Form>
      <Form.Group>
        <Form.Input readOnly value={projectInfoSource.projectURL} label='Project page'/>
        <Form.Input readOnly value={projectInfoSource.projectTwitter} label='Twitter'/>
        <Form.Field
          readOnly
          value={projectInfoSource.projectDescription}
          width={12}
          control={TextArea}
          style={{ marginBottom: '5px', height: '150px' }}
          label='About the project'
        />
      </Form.Group>

      <Form.Group style={{ marginTop: '-74px', marginLeft: '-1px' }}>
        <Form.Input readOnly value={projectInfoSource.projectDiscord} label='Discord'/>
        <Form.Input readOnly value={projectInfoSource.projectTelegram} label='Telegram'/>
      </Form.Group>

    </Form>
  </div>
  );
}

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
  );
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
  );
}

export const NoElementsFoundMessage = ({ whatIsBeingLookedFor }) => {
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
  );
}

export const CopyButton = ({ dataToCopy }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(dataToCopy);
  };

  return( <Button circular compact icon='copy' size='mini' onClick={(() => handleCopyClick())}/> );
}

export const RefreshButton = ({ floated, color, execOnClick }) => {
  return(
    <Button
      circular
      icon='refresh'
      color={color}
      floated={floated}
      onClick={()=> execOnClick()}
    />
  );
}