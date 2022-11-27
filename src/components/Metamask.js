import React, { Component } from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react'
import { ethers } from "ethers";

class Metamask extends Component {
  constructor(props) {
    super(props);
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.handleSignerChange = this.handleSignerChange.bind(this);
    this.state = {
      activeChain: '',
      selectedAddress: ''
    };
  }

  handleNetworkChange(e) {
    this.setState({activeChain: e})
  }

  handleSignerChange(e) {
    this.setState({selectedAddress: e})
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    this.handleSignerChange(accounts[0])
    
    const { chainId } = await provider.getNetwork()
    this.handleNetworkChange(chainId)
  }

  renderMetamask() {
    const selectedAddress = this.state.selectedAddress

    const connectedMenuOptions = [
      { key: 'am', value: 'am', flag: 'am', text: selectedAddress },
      { key: 'aw', value: 'aw', flag: 'aw', text: 'Placeholder' },
    ]
    
    if (selectedAddress === '') {
      return (
        <div>
          <Button icon size='large' onClick={() => this.connectToMetamask()}>
            <Icon name='lock'></Icon> Connect wallet
          </Button>
        </div>
      )
    } else {
      return (
        <Dropdown
        button
        className='icon'
        floating
        labeled
        icon='user circle'
        text='Profile'
        options={connectedMenuOptions}
        >
        </Dropdown>
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