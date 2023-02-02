import React, { Component } from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react'
import { ethers } from "ethers";
import { isSupportedNetwork } from '../components/Navbar/data/ElementsAndHelpers';


class Metamask extends Component {
  constructor(props) {
    super(props);
    // TO DO rework this to better handle in-class states
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.handleSignerChange = this.handleSignerChange.bind(this);
    this.state = {
      activeChain: '',
      selectedAddress: ''
    };
  }

  convert(integer) {
    var str = Number(integer).toString(16);
    return str.length === 1 ? "0" + str : str;
  };

  async handleNetworkChange(chainID) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x'+ this.convert(chainID) }],
      });

      this.props.changeNetwork(chainID)
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
            let url = ''
            let name = ''

            switch (chainID) {
              case '3d':
                url = 'https://www.ethercluster.com/etc';
                name = 'Ethereum Classic'

                break;

              case '57':
                url = 'https://dev.rpc.novanetwork.io';
                name = 'Nova Network'

                break;

              case 'localhost':
                url = '';
                name = ''

                break;
              
              default:
                url = 'https://etc.wallet.coinbase.com/api/';
                name = 'Ethereum Classic'
            }

          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x'+chainID,
                chainName: name,
                rpcUrls: [ url ],
                // TO DO add the native currency
              },
            ],
          });

          this.props.changeNetwork(this.convert(chainID))
          //window.location.reload();
        } catch (addError) {
          // handle "add" error
        }
      }
      //console.log(this.props.network)
      // handle other "switch" errors
    }
  }

  // TO DO probably this has to go as it's already being tracked in App.js
  getNetworkData() {
    return { 
      activeChain: this.state.activeChain, 
      selectedAddress: this.state.selectedAddress
    }
  }

  // TO DO probably this has to go as it's already being tracked in App.js
  handleSignerChange(e) {
    console.log('new signer ' + e)
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    // changeNetwork({activeChain: chainID})
    
    const { chainId } = await provider.getNetwork()
    this.props.changeNetwork(chainId)
  }

  // TO DO Rework this to redraw correctly on network change
  renderMetamask() {
    const connectedMenuOptions = [
      { key: 'aw', value: 'aw', flag: 'aw', text: this.props.network },
      { key: 'am', value: 'am', flag: 'am', text: this.props.accounts }, 
    ]

    if (this.props.isConnected === false) {
      return (
        <div>
          <Button icon size='large' onClick={() => this.connectToMetamask()}>
            <Icon name='lock'></Icon> Connect wallet
          </Button>
        </div>
      )
    } else {  // TO DO If the selected network is not supported we should get an error button
      // As we already have permission there is no confirmation needed
      this.connectToMetamask()

      if ((isSupportedNetwork(this.props.network)) === false) {
        return (
          <Button negative>Unsupported network</Button>
        )
      } else { // TO DO dont show this is there is no account 
        return (
          <Dropdown
          button
          className='icon'
          floating
          labeled
          icon='user circle'
          text='Profile'
          options={connectedMenuOptions} // TO DO redraw this when the network changes
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