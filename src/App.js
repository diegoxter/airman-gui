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

  function changeNetwork(chainId) {
    setNetwork(chainId)
  }

  const x = (_chainId) => {
    changeNetwork(_chainId)
  }

  window.ethereum.on('chainChanged', (_chainId) => x(_chainId))

  return (
    <Router>
      <Navbar network={ network } changeNetwork={ changeNetwork }/>
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