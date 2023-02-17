import { ethers } from "ethers";
import { waitForConfirmation, getAdmPanAddress } from ".";

import adminPanelAbi from '../assets/abis/AdminPanel.json';
import airdropManagerAbi from '../assets/abis/AirdropManager.json';
// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const network = provider.getNetwork();

// Getter functions
const getFee = async (_network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, provider);
  const fee = await adminPanelInstance.feeInGwei();

  return fee;
}

export const getDeployedAirManList = async (_address, _network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, provider);
  const list = await adminPanelInstance.connect(signer).getDeployedInstances(_address);

  return list;
}


// Transaction functions
export const deployAirMan = async (_token, amount, _setIsLoading, _setOpen, _network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, signer);
  const fee = await getFee(_network);

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
}

export const deployAirdropCampaign = async (
  _instanceAddress,
  _endsIn,
  _amountForCampaign,
  _hasFixedAmount,
  _amountForEveryUser,
  _setIsLoading ) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, signer);

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
}


// Draw functions
export const getInstanceInformation = async (_address, _network) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(_network)), adminPanelAbi, signer);
  let instancesData = await getDeployedAirManList(_address, _network);
  const instances = [];

  await Promise.all(instancesData.map(async (instanceData, index) => {
    let temp = await adminPanelInstance.deployedManagers(instanceData);
    instances[index] = temp;
  }));

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