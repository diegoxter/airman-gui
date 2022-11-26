import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react'
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
        <div>
          <Button icon size='large' onClick={() => this.connectToMetamask()}>
            <Icon name='lock'></Icon> Connect wallet
          </Button>
        </div>
      )
    } else {
      return (
        <Button icon size='large'>
        <Icon name='user circle'></Icon> {this.state.selectedAddress} 
        </Button>
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
// <a href="https://iconscout.com/icons/metamask" target="_blank">MetaMask Icon</a> by <a href="https://iconscout.com/contributors/icon-mafia" target="_blank">Icon Mafia</a>