import { useState, useEffect } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import { getInstanceInformation } from '../../interactions/airmanSystem'

const DeployedAirManCard = ({ 
  projectName, 
  typeOfProject, 
  projectDescription, 
  projectImage,
  instanceAddress,
  instanceToken
}) => {
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

const ExampleComponent = (_accounts) => {
  const [instances, setInstances] = useState([]);
  const account = _accounts.accounts

  useEffect(() => {
    const fetchData = async () => {
      const _instances = await getInstanceInformation(account);
      setInstances(_instances);
    };
    fetchData();
  }, []);

  console.log(instances)
  console.log(typeof instances)


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
              <Card.Header>{instance.id['_hex']}</Card.Header>
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
};

export const DeployedAirManList = ({ network, accounts, isConnected, checkedInstances, setCheckedInstances }) => {  

  return(

    <ExampleComponent accounts={accounts}/>

  )
}
