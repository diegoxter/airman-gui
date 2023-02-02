import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react'
import styled from 'styled-components';
import Metamask from '../../interactions/Metamask';
import { networkOptions, isSupportedNetwork } from './data/NetworkDropdownElements';

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

export const NetworkDropdown = ({ network }) => {
  const meta = new Metamask()

  const handleChange = (e, { value }) => {
    meta.handleNetworkChange(value)
  }

  function displayActiveNetwork() {
    const i = networkOptions.findIndex(e => e.value === network);

    if (i >= 0 ) {
      return networkOptions[i].value
    } else {
      return false
    }
  }

  if (network === '') {
    return false
  } else {
    if (isSupportedNetwork(network) === false) {
      console.log('no soportado')
      // TO DO don't show this if there are no active accounts passed
      return (
        <Dropdown 
        text='Please use a supported network' 
        options={networkOptions} 
        onChange={handleChange}  // TO DO if the user cancels the network change the selected item shouldn't change
        selection
        error 
        />
      )
    } else {
      console.log('soportado')
      return (
        <Dropdown 
          selection
          simple option
          options={networkOptions}
          onChange={handleChange} 
          defaultValue={displayActiveNetwork()} // TO DO fix this not redrawing
        />
      )
    }

  }

}
