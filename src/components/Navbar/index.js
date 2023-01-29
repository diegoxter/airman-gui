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
import Metamask from '../../interactions/Metamask';
import 'semantic-ui-css/semantic.min.css'


const Navbar = () => {
  return (
    <>
      <Nav> 
        <Bars />
          <NavMenu>
            <NavLink to='/' activestyle={true.toString()}>
              <Icon name='home'/>
            </NavLink>

            <NavLink to='/about' activestyle={true.toString()}>
              About
            </NavLink>

            <NavLink to='/events' activestyle={true.toString()}>
              Events
            </NavLink>
            
          </NavMenu>
        <Grid>
          <NavBtn>
            <NetworkDropdown />
          </NavBtn>
          <Divider vertical hidden /> {/* TO DO verify the CSS of the above and below elements*/}
          <NavBtn>
            <Metamask />
          </NavBtn>
        </Grid>
      </Nav>
    </>
  );
};
  
export default Navbar;