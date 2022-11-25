import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';
import Metamask from '../Metamask';
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  MenuLink,
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
  
        <NavMenu>
          <NavLink to='/about' activestyle="true">
            Element 1
          </NavLink>
          <NavLink to='/events' activestyle="true">
            Element 2
          </NavLink>
          <NavLink to='/annual' activestyle="true">
            Element 3
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <Menu>
      <MenuButton
      className="button-primary"
      style={{ boxShadow: "2px 2px 2px hsla(0, 0%, 0%, 0.25)", color: "blue"}}
      
      >Network</MenuButton>
      <MenuList>
        <MenuItem>Element 1</MenuItem>
        <MenuLink to="view">Element 2</MenuLink>
      </MenuList>
    </Menu>
        <NavBtn>
          <Metamask />
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;