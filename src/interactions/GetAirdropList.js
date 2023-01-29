import React, { Component } from 'react';
import Metamask from './Metamask';

const meta = new Metamask()

class AirdropList extends Component {
  constructor(props) {
    super(props);
      this.state = {
        activeChain: meta.state.activeChain,
      };
    }

  async getAirdropList() {
    console.log('Pene '+ await meta.state.activeChain)

    console.log('Pito '+this.activeChain)
  }

}


export default AirdropList;
