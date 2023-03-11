import { useState } from 'react';
import { Tab } from 'semantic-ui-react';
import { getInstanceInfoByOwner } from '../interactions/airmanSystem';
import AirdropManagerTab from '../components/AdminPanel';


const Profile = ({ network, accounts, isConnected }) => {
  const [ instances, setInstances ] = useState('');
  const [ checkedInstances, setCheckedInstances ] = useState(false);

  if (network !== '' && accounts !== '' && checkedInstances === false) {
    getInstanceInfoByOwner(network, accounts)
    .then((value) => {
      setInstances(value);
      setCheckedInstances(true);
    })
  }

  const panes = [
  { menuItem: 'Placeholder for campaigns currently active', render: () => <Tab.Pane> Placeholder </Tab.Pane> },
  { menuItem: 'Airdrop Mananager', render: () =>
    <Tab.Pane>
      <AirdropManagerTab
        network={ network }
        accounts={ accounts }
        isConnected={ isConnected }
        checkedInstances={ checkedInstances }
        setCheckedInstances={ setCheckedInstances }
        instances={ instances } />
    </Tab.Pane> },
  { menuItem: 'Coming soon...', render: () => <Tab.Pane>Under construction... </Tab.Pane> },
  ];

  return (
    <Tab panes={panes} style={{width: '96%'}}/>
  );
};

export default Profile;