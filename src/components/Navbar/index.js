import React from 'react';
import { Divider, Grid, Icon } from 'semantic-ui-react'
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NetworkDropdown,
  Metamask
} from './NavbarElements';
import 'semantic-ui-css/semantic.min.css'

// check the css properties for fixed bar

const Navbar = ({ network, changeNetwork, isConnected, accounts }) => {
  return (
    <>
      <Nav> 
        <Bars />
          <NavMenu>
            <NavLink to='/' activestyle={true.toString()}>
              <Icon name='home'/>
            </NavLink>

            <NavLink to='/adminPanel' activestyle={true.toString()}>
              Admin Panel
            </NavLink>

            <NavLink to='/about' activestyle={true.toString()}>
              About
            </NavLink>
          </NavMenu>
        <Grid>
          <NavBtn>
            <NetworkDropdown network={ network } accounts={ accounts }/>
          </NavBtn>
          <Divider vertical hidden /> {/* TO DO verify the CSS of the above and below elements*/}
          <NavBtn>
            <Metamask 
              network={ network } 
              changeNetwork={ changeNetwork } 
              isConnected={ isConnected } 
              accounts={ accounts }
            />
          </NavBtn>
        </Grid>
      </Nav>
    </>
  );
};
  
export default Navbar;