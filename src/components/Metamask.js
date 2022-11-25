import React, { Component } from 'react';
import { Button, Image } from 'semantic-ui-react'
import METAMASK_ICON_URL from './assets/metamask.png'
import { ethers } from "ethers";

class Metamask extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    this.setState({ selectedAddress: accounts[0] })
    const { chainId } = await provider.getNetwork()
    console.log((await provider.getNetwork(chainId)).name)
    //this.setState({selectedNetwork: })
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <Button onClick={() => this.connectToMetamask()}>
          <Image src={METAMASK_ICON_URL} inline size='mini'/> Connect to Metamask
        </Button>
      )
    } else {
      return (
        <Button onClick={() => this.connectToMetamask()}>{this.state.selectedAddress}</Button>
        //<p>Welcome {this.state.selectedAddress}</p>
      );
    }
  }

  render() {
    return(
      <div>
        {this.renderMetamask()}
      </div>
    )
  }
}

export default Metamask;