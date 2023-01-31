import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react'
import styled from 'styled-components';
import Metamask from '../../interactions/Metamask';

import { 
  ETC_ICON_URL, 
  NOVA_ICON_URL, 
  LOCALHOST_ICON_URL 
} from './data/iconURI'
  
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

  const networkOptions = [
    {
      key: 'ETC',
      text: 'ETC',
      value: '61',
      image: { className:"ui mini image", src: ETC_ICON_URL },
    },
    {
      key: 'Nova Network',
      text: 'Nova Network',
      value: '87',
      image: { className:"ui mini image", src: NOVA_ICON_URL },
    },
    {
      key: 'localhost',
      text: 'localhost',
      value: 'localhost',
      image: { className:"ui mini image", src: LOCALHOST_ICON_URL },
    },
  ]

  function displayActiveNetwork() {
    const i = networkOptions.findIndex(e => e.value === network.toString());

    if (i >= 0 ) {
      return networkOptions[i].value
    } else {
      return false
    }
  }

  if (network === '') {
    return false
  } else {
    if (displayActiveNetwork() !== false) {
      return (
        <Dropdown 
          selection
          simple option
          options={networkOptions}
          onChange={handleChange} 
          defaultValue={displayActiveNetwork()}
        />
      )
    } else {
      console.log('no soportado')  // TO DO show a dropdown asking the user to change to a supported network
    }

  }

}
