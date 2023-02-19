import { Card, Button, Accordion } from 'semantic-ui-react'
import { getAirdropCampaignData } from '../interactions/airdropSystem';

const AirdropCampaignCard = () => {
  const panels = [
    {
      key: 'content',
      title: {
        content: 'Lorem ipsum',
      },
      content: {
        content: (
          <span>
            dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
        ),
      },
    },
  ];

  return(
    <Card>
      <Card.Content>

      <Card.Header>
        Placeholder
      </Card.Header>

      <Card.Meta>Placeholder</Card.Meta>
      <Card.Meta>Campaign address <b>Placeholder</b></Card.Meta>

      <Card.Description>
        Placeholder
      </Card.Description>
      </Card.Content>

      <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green'>
            Approve
          </Button>
          <Button basic color='red'>
            Decline
          </Button>
        </div>
        <Accordion panels={panels}/>

      </Card.Content>
    </Card>
  )
}

export const AirdropList = (network, accounts) => {
  getAirdropCampaignData(network.network)
  .then((result) => {
    console.log(result)
  })

    return(
      <Card.Group itemsPerRow={3}>
        <AirdropCampaignCard />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
          <Card
            href='#card-example-link-card'
            header='Placeholder'
            meta='Placeholder'
            description='Placeholder'
          />
      </Card.Group>
    )


}


export default AirdropList;