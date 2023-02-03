import { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react'
import activeNetworkContractAddr from '../interactions/data/contracts';


class AirdropList extends Component {

  airdropCard() { 
    activeNetworkContractAddr(this.props.network)
    return (
      <Card
        href='#card-example-link-card'
        header='Elliot Baker'
        meta='Friend'
        description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
      />
    )
  }

  render() {
    return(
      <Grid>
        {this.airdropCard()}
      </Grid>
    )
  }

}


export default AirdropList;