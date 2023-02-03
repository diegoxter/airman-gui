import React from 'react';
import AirdropList from '../components/AirdropList';

const Home = ({ network }) => {

// TO DO bring the list here

/*
  const NoContent = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'Center',
        alignItems: 'Right',
        height: '100vh'
      }}
    >
      <h1>GeeksforGeeks is a Computer Science portal for geeks.</h1>
    </div>
  )
*/

  return (
    <AirdropList network={ network }/>
  );
};
  
export default Home;