import React, { Component } from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react'
import { ethers } from "ethers";
import { isSupportedNetwork } from './data/ElementsAndHelpers';


class Metamask extends Component {

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    
    // TO DO This could be optimized
    const { chainId } = await provider.getNetwork()
    this.props.changeNetwork(chainId)
  }

  renderMetamask() {
    const connectedMenuOptions = [
      { key: 'aw', value: 'aw', flag: 'aw', text: this.props.network },
      { key: 'am', value: 'am', flag: 'am', text: this.props.accounts }, 
    ]

    if (this.props.isConnected === false) {
      return ( // TO DO redraw this if the account is not connected
        <div> 
          <Button icon size='large' onClick={() => this.connectToMetamask()}>
            <Icon name='lock'></Icon> Connect wallet
          </Button>
        </div>
      )
    } else {
      // Note: As we already have permission there is no confirmation needed from the user
      this.connectToMetamask()

      if ((isSupportedNetwork(this.props.network)) === false) {
        return (
          <Button negative>Unsupported network</Button>
        )
      } else { // TO DO dont show this is if there is the active account is not connected
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