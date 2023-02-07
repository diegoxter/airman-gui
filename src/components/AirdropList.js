import { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react'
import activeNetworkContractAddr from '../interactions/data/contracts';


class AirdropList extends Component {

  airdropCard() { 
    activeNetworkContractAddr(this.props.network)
    return (
      <Card
        href='#card-example-link-card'
        header='Placeholder'
        meta='Placeholder'
        description='Placeholder'
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