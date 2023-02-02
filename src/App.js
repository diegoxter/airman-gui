import { React, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages';
import About from './pages/about';
import Events from './pages/events';
import AnnualReport from './pages/annual';

export const Content = styled.div`
  color: #808080;
  display: flex;
  padding-top: 50px;
  padding-left: 50px;
`;

  
function App() {
  
  const [network, setNetwork] = useState('');
  const [accounts, setAccounts] = useState('') // TO DO this still needs to be better handled
  const [isConnected, setIsConnected] = useState(false)


  function changeNetwork(chainId) {
    setNetwork(chainId)
  }

  function changeAccounts(address) {
    console.log('antes ' + accounts)
    setAccounts(address)
    console.log('despues ' + accounts)

    if (address.length === 0) {
      switchIsConnected(false)
    }
  }

  function switchIsConnected(isIt) {
    setIsConnected(isIt)
  }

  console.log('test ' + accounts)


  window.ethereum.on('chainChanged', (_chainId) => changeNetwork(_chainId))
  window.ethereum.on('accountsChanged', (_account) => changeAccounts(_account))

  async function checkIfConnected() {
    const x = await window.ethereum.request({ method: 'eth_accounts' })

    if(x.length > 0) {
      switchIsConnected(true)
    } 
  }

  checkIfConnected()

  return (
    <Router>
      <Navbar network={ network } changeNetwork={ changeNetwork } isConnected={ isConnected } accounts={ accounts }/>
        <Content>
            <Routes>
              <Route path='/' exact element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/events' element={<Events />} />
              <Route path='/annual' element={<AnnualReport />} />
            </Routes>
        </Content>
    </Router>
  );
}
  
export default App;