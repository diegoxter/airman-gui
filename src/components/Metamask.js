import React, { Component } from 'react';
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
        <button onClick={() => this.connectToMetamask()}>Connect to Metamask</button>
      )
    } else {
      return (
        <button onClick={() => this.connectToMetamask()}>{this.state.selectedAddress}</button>
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