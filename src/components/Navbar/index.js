import React from 'react';
import { Divider, Grid, Icon } from 'semantic-ui-react'
import { Nav, NavLink, Bars, NavMenu, NavBtn, NetworkDropdown, Metamask } from './NavbarElements';
import 'semantic-ui-css/semantic.min.css';

// TO DO check the css properties for fixed bar

const Navbar = ({ network, changeNetwork, isConnected, accounts }) => {
  return (
    <div>
      <Nav>
        <Bars />
          <NavMenu>
            <NavLink to='/'>
              <Icon name='home'/>
            </NavLink>

            <NavLink to='/profile'>
              Profile
            </NavLink>

            <NavLink to='/about'>
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
    </div>
  );
};

export default Navbar;