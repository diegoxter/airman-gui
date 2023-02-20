import { ethers } from "ethers";
import { waitForConfirmation, getAdmPanAddress } from ".";

import adminPanelAbi from '../assets/abis/AdminPanel.json';
import airdropManagerAbi from '../assets/abis/AirdropManager.json';
// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Getter functions
const getFee = async (_network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, provider);
  const fee = await adminPanelInstance.feeInGwei();

  return fee;
}

export const getDeployedAirManByOwnerList = async (_address, _network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, provider);
  const list = await adminPanelInstance.connect(signer).getDeployedInstances(_address);

  return list;
}

export const fetchEtherBalance = async (_instanceAddress) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, provider);
  const balance = await airManInstance.getEtherBalance();

  return balance;
}

export const fetchCampaignData = async (_instanceAddress) => {
  const data = await getCampaignInformation(_instanceAddress);

  return data;
}

export const getDeployedAirmanListInformation = async (_network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, provider);
  const deployedAirManAmount = await adminPanelInstance.instanceIDs();
  const airMansAddressess = []
  const airdropCampaignsList = []

  const getAirManAddressData = async () => {
    for (let i = 0; i < deployedAirManAmount; i++) {
      let temp = await adminPanelInstance.deployedManagers(i);
      airMansAddressess[i] = temp.instanceAddress;
    }
  }
  await getAirManAddressData();

  try {
    let g = 0
    await Promise.all(airMansAddressess.map(async (airmanAddress) => {
      const airManInstance = new ethers.Contract(airmanAddress, airdropManagerAbi, signer);
      const airManInstanceCampaignList = Number(await airManInstance.showDeployedCampaigns());

      if (airManInstanceCampaignList > 0){
        for (let i = 0; i < airManInstanceCampaignList; i++) {
          let temp = await airManInstance.campaigns(i);
          airdropCampaignsList[g] = temp.campaignAddress;

          g++
        }
      }

    }));
  } catch (e) {
    console.log('falla')
  }

  return airdropCampaignsList
}


// Transaction functions
export const deployAirMan = async (_token, amount, _setIsLoading, _setOpen, _network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, signer);
  const fee = await getFee(_network);

  try {
    const tx = (await adminPanelInstance.connect(signer).newAirdropManagerInstance(
      _token, 
      Number(amount),
      {
        value: fee,
      }
      )
    );
  
    let sleep = ms => new Promise(r => setTimeout(r, ms));
  
    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }
      _setOpen(false);
      
      return true;
  } catch (error) {
    console.log('Falla al hacer el deploy de AirMan ');
    _setIsLoading(false)
    return false
  }
}

export const deployAirdropCampaign = async (
  _instanceAddress,
  _endsIn,
  _amountForCampaign,
  _hasFixedAmount,
  _amountForEveryUser,
  _setIsLoading ) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, signer);

  try {
    const tx = await airManInstance.connect(signer).newAirdropCampaign(
      _endsIn,
      _amountForCampaign,
      _hasFixedAmount,
      _amountForEveryUser
    )

    let sleep = ms => new Promise(r => setTimeout(r, ms));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }
  } catch (error) {
    console.log('campaign deploy failed')
    _setIsLoading(false)
  }
}

export const manageAirmanFunds = async (_instanceAddress, _option, _setIsLoading) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, signer);

  try {
    const tx = (await airManInstance.connect(signer).manageFunds(_option));

    await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading);
  } catch (error) {
    console.log('Failure to withdraw tokens');
    _setIsLoading(false)
  }
}

// Draw functions
export const getInstanceInformationByOwner = async (_address, _network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, signer);
  let instancesData = await getDeployedAirManByOwnerList(_address, _network);
  const instances = [];

  try {
    await Promise.all(instancesData.map(async (instanceData, index) => {
      let temp = await adminPanelInstance.deployedManagers(instanceData);
      instances[index] = temp;
    }));
  } catch (e) {
    console.log('Failure while getting instance information')
  }


  return instances;
}

export const getCampaignInformation = async (_instanceAddress) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, signer);
  let airdropsIds = await airManInstance.showDeployedCampaigns();
  const airdrops = [];

  const getData = async () => {
    for (let i = 0; i < airdropsIds; i++) {
      let temp = await airManInstance.campaigns(i);
      airdrops[i] = temp;
    }
  }
  
  await getData();

  return airdrops;
}