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
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
  
        <NavMenu>
          <NavLink to='/about' activestyle="true">
            About
          </NavLink>
          <NavLink to='/events' activestyle="true">
            Events
          </NavLink>
          <NavLink to='/annual' activestyle="true">
            Annual Report
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        </NavBtn>
        <NavBtn>
          <Metamask />
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;