import { Tab } from 'semantic-ui-react';
import AirdropManagerTab from '../components/AdminPanel';


const Profile = ({ network, accounts, isConnected }) => {

  const panes = [
  { menuItem: 'Placeholder for campaigns currently active', render: () => <Tab.Pane> Placeholder </Tab.Pane> },
  { menuItem: 'Airdrop Mananager', render: () =>
    <Tab.Pane>
      <AirdropManagerTab
        network={ network }
        accounts={ accounts }
        isConnected={ isConnected }
      />
    </Tab.Pane> },
  { menuItem: 'Coming soon...', render: () => <Tab.Pane>Under construction... </Tab.Pane> },
  ];

  return (
    <Tab panes={panes} style={{width: '96%'}}/>
  );
};

export default Profile;