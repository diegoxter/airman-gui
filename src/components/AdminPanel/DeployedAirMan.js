import { Card, Image, Button } from 'semantic-ui-react'
import { getInstanceInformation } from '../../interactions/airmanSystem'

const DeployedAirManCard = ({ projectName, typeOfProject, projectDescription, projectImage }) => {
  return ( 
    <Card>
        <Card.Content>
            <Image
                floated='right'
                size='mini'
                src={projectImage}
            />
            <Card.Header>{projectName}</Card.Header>
            <Card.Meta>{typeOfProject}</Card.Meta>
            <Card.Description>
              {projectDescription}
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
  )
}

export const DeployedAirManList = ({ network, accounts, isConnected }) => {
  if (accounts !=='' && typeof accounts === 'string') {
    // getInstanceInformation(accounts) // testing
  }
  return(
    <Card.Group>
      <DeployedAirManCard 
        projectName='Placeholder' 
        typeOfProject='Placeholder' 
        projectDescription='Placeholder' 
        projectImage='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
      />
      <DeployedAirManCard 
        projectName='Placeholder' 
        typeOfProject='Placeholder' 
        projectDescription='Placeholder' 
        projectImage='https://react.semantic-ui.com/images/avatar/large/molly.png'
      />
      <DeployedAirManCard 
        projectName='Placeholder' 
        typeOfProject='Placeholder' 
        projectDescription='Placeholder' 
        projectImage='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
      />
    </Card.Group>
  )
}
