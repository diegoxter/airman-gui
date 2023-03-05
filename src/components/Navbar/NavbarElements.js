import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import { Dropdown, Button, Icon } from 'semantic-ui-react'
import styled from 'styled-components';
import { networkOptions } from './data';
import { isSupportedNetwork, handleNetworkChange, convertToHex, cleanAddress } from '../../interactions'
import React, { Component } from 'react';
import { ethers } from "ethers";

export const Nav = styled.nav`
  background: #00238b;
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
  /* Third Nav */
  /* justify-content: flex-start; */
  @media screen and (max-width: 768px) {
    align-items: center;
    display: flex;
  }
`;

export const NavLink = styled(Link)`
  color: #ffffff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #a3a3a3;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #808080;
  @media screen and (max-width: 768px) {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
  /* Second Nav */
  /* margin-right: 24px; */
  /* Third Nav */
  /* width: 100vw;
  white-space: nowrap; */
  @media screen and (max-width: 768px) {
    font-size: 1.8rem;
    display: flex;
    transform: translate(25%, 25%);
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-top: 5px;
  /* Third Nav */
  /* justify-content: flex-end;
  width: 100vw; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: #808080;
  padding: 10px 22px;
  color: #000000;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  /* Second Nav */
  margin-left: 24px;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #808080;
    display: none;
  }
`;

const NetworkDropdown = ({ network, accounts }) => {
  const handleChange = (e, { value }) => {
    handleNetworkChange(value);
  }

  function displayActiveNetwork(_network) {
    const i = networkOptions.findIndex(e => e.value === '0x'+(convertToHex(_network)));

    if (i >= 0 ) {
      return networkOptions[i].value;
    } else {
      return false;
    }
  }

  if (network === '') {
    return false;
  } else {
    if ((isSupportedNetwork(network) === false) && accounts !== '')  {
      return (
        <Dropdown
          text='Please use a supported network'
          options={networkOptions}
          onChange={handleChange}  // TO DO if the user cancels the network change the selected item shouldn't change
          selection
          error
        />
      );
    } else {
      if (accounts.length !== 0) {
        return (
          <Dropdown
            selection
            options={networkOptions}
            onChange={handleChange}
            defaultValue={displayActiveNetwork(network)} // TO DO fix this not redrawing when the network changed
          />
        );
      }
    }
  }
}

class Metamask extends Component {

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const { chainId } = await provider.getNetwork();
    this.props.changeNetwork(chainId);
  }

  handleChange = (e, { value }) => {
    console.log(value);
  }

  renderMetamask() {
    const connectedMenuOptions = [
      { key: 'address', value: 'profile', icon: 'id card outline', text: cleanAddress(this.props.accounts, 3, 38) + ` Check profile` }, 
      { key: 'network', value: 'string', icon: 'server', text: this.props.network },
    ];

    if (this.props.isConnected === false) {
      return (
        <div>
          <Button icon size='large' onClick={() => this.connectToMetamask()}>
            <Icon name='lock'></Icon> Connect wallet
          </Button>
        </div>
      );
    } else {
      // Note: As we already have permission there is no confirmation needed
      this.connectToMetamask();

      if ((isSupportedNetwork(this.props.network)) === false) {
        return ( <Button negative>Unsupported network</Button> );
      } else {
        return (
          <Dropdown
          button
          className='icon'
          floating
          labeled
          onChange={this.handleChange}
          icon='user circle'
          text='Settings'
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
    );
  }
}

export { Metamask, NetworkDropdown };

// <a href="https://iconscout.com/icons/metamask" target="_blank">MetaMask Icon</a> by <a href="https://iconscout.com/contributors/icon-mafia" target="_blank">Icon Mafia</a>