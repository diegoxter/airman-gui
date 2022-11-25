import React from 'react';
import { Divider, Grid, Icon } from 'semantic-ui-react'
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NetworkDropdown,
} from './NavbarElements';
import Metamask from '../Metamask';
import 'semantic-ui-css/semantic.min.css'


const Navbar = () => {
  return (
    <>
      <Nav> {/* TO DO reformat this to semantic-ui-react*/}
        <Bars />
  
        <NavMenu>
          <NavLink to='/' activestyle="true">
            <Icon name='home'/>
          </NavLink>

          <NavLink to='/about' activestyle="true">
            Home
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
        <NavBtn>
          <Grid>
            <NetworkDropdown />
            <Divider vertical hidden /> {/* TO DO verify the CSS of the above and below elements*/}
            <Metamask />
          </Grid>
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;