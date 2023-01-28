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

  async handleNetworkChange(chainID) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x'+chainID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
            let url = ''

            switch (chainID) {
              case '61':
                url = 'https://etc.wallet.coinbase.com/api/';
                break;

              case '87':
                url = 'https://dev.rpc.novanetwork.io';
                break;

              case 'localhost':
                url = '';
                break;
              
              default:
                console.log('ups')
            }
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x'+chainID,
                chainName: '...',
                rpcUrls: [url],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  handleSignerChange(e) {
    console.log('new signer ' + e)
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    this.setState({ selectedAddress: accounts[0] })
    
    const { chainId } = await provider.getNetwork()
    this.setState({activeChain: chainId})
  }

  renderMetamask() {

    const connectedMenuOptions = [
      { key: 'aw', value: 'aw', flag: 'aw', text: this.state.activeChain },
      { key: 'am', value: 'am', flag: 'am', text: this.state.selectedAddress },
    ]
    
    if (this.state.selectedAddress === '') {
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