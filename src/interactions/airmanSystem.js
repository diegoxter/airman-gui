import { ethers } from "ethers";
import { waitForConfirmation, getAdmPanAddress } from ".";
import { multicall } from "./multicall";

import adminPanelAbi from '../assets/abis/AdminPanel.json';
import airdropManagerAbi from '../assets/abis/AirdropManager.json';

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Getter functions
export const getFee = async (_network) => {
  const adminPanelInstance = new ethers.Contract((getAdmPanAddress(_network)), adminPanelAbi, provider);
  const fee = await adminPanelInstance.feeInWei();

  return fee;
}

export const getDeployedInstances = async (_network) => {
  const adminPanelInstance = new ethers.Contract((getAdmPanAddress(_network)), adminPanelAbi, provider);
  const deployedInstances = await adminPanelInstance.instanceIDs();

  return deployedInstances;
}

export const isAdminAddress = async (_network, _account) => {
  const adminRoleHash = '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775';
  const adminPanelInstance = new ethers.Contract((getAdmPanAddress(_network)), adminPanelAbi, provider);

  const isAdmin = await adminPanelInstance.hasRole(adminRoleHash, _account);

  return isAdmin;
};

export const getAirdropCampaignsAddressList = async (_network) => {
  const adminPanelAddress = getAdmPanAddress(_network);
  const adminPanelInstance = new ethers.Contract(adminPanelAddress, adminPanelAbi, provider);
  const airdropCampaignsAddressList = [];
  const getAirManAddressessCalls = [];

  for (let i = 0; i < await adminPanelInstance.instanceIDs(); i++) {
    const getAirManList = {
      abi: adminPanelAbi,
      address: adminPanelAddress,
      name: 'deployedManagersById',
      params: [i],
    };

    getAirManAddressessCalls[i] = getAirManList;
  }

  let airManAddresses
  try {
    airManAddresses = await multicall(adminPanelAbi, getAirManAddressessCalls, _network);
  } catch (e) {
    airManAddresses = 0
  }

  if (airManAddresses.length > 0) {
    await Promise.all(airManAddresses.map(async (airmanData) => {
      const airManInstance = new ethers.Contract(airmanData.instanceAddress, airdropManagerAbi, signer);
      const airManInstanceCampaignList = Number(await airManInstance.showDeployedCampaigns());

      if (airManInstanceCampaignList > 0) {
        const getAirdropListCalls = [];

        for (let i = 0; i < airManInstanceCampaignList; i++) {
          const getAirdropList = {
            abi: airdropManagerAbi,
            address: airmanData.instanceAddress,
            name: 'campaigns',
            params: [i],
          };

          getAirdropListCalls[i] = getAirdropList;
        }

        const airManDataRaw = await multicall(airdropManagerAbi, getAirdropListCalls, _network);

        for (let i = 0; i < (Object.keys(airManDataRaw)).length; i++) {
          airdropCampaignsAddressList[i] = airManDataRaw[i].campaignAddress;
        }
      }
    }))
  }

  return airdropCampaignsAddressList;
}

// Transaction functions
export const deployAirMan = async (_cid, _token, amount, decimals, _setIsLoading, _setOpen, _network) => {
  const adminPanelInstance = new ethers.Contract((getAdmPanAddress(_network)), adminPanelAbi, signer);
  const fee = await getFee(_network);
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

  try {
    const tx = (await adminPanelInstance.connect(signer).newAirdropManagerInstance(
      _cid,
      _token,
      parsedAmount,
      {
        value: fee,
      }
      )
    );

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }
    _setOpen(false);

    return true;
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    return false;
  }
}

export const deployAirdropCampaign = async (
  _instanceAddress,
  uintValues,
  decimals,
  _hasFixedAmount,
  _isPrivate,
  _setIsLoading ) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, signer);
  const parsedAmount = ethers.utils.parseUnits(uintValues[1].toString(), decimals);

  try {
    const tx = await airManInstance.connect(signer).newAirdropCampaign(
      uintValues[0],
      parsedAmount,
      uintValues[2],
      uintValues[3],
      uintValues[4],
      _hasFixedAmount,
      _isPrivate
    );

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    return false
  }
}

export const manageAirmanFunds = async (_instanceAddress, _option, _setIsLoading) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, signer);

  try {
    const tx = (await airManInstance.connect(signer).manageFunds(_option));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true
  } catch (error) {
    console.log('Failure to withdraw tokens');
    _setIsLoading(false);
    return false
  }
}

export const setNewFee = async (_network, _newFee, _setIsLoading) => {
  const adminPanelInstance = new ethers.Contract((getAdmPanAddress(_network)), adminPanelAbi, signer);
  try {
    const tx = (await adminPanelInstance.connect(signer).setFeeInWei(_newFee));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true
  } catch (e) {
    console.log('There has been an error setting the new fee', e)
    _setIsLoading(false)
    return false
  }
}

export const withdrawEther = async (_network, _setIsLoading) => {
  const adminPanelInstance = new ethers.Contract((getAdmPanAddress(_network)), adminPanelAbi, signer);

  try {
    const tx = (await adminPanelInstance.connect(signer).withdrawEther());

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true

  } catch (e) {
    console.log('There has been an error withdrawing the ether', e)
    _setIsLoading(false)
    return false
  }

}

// Draw functions
export const getInstanceInfoByOwner = async (_network, _ownerAddress) => {
  const adminPanelInstance = new ethers.Contract((getAdmPanAddress(_network)), adminPanelAbi, provider);
  const instancesData = await adminPanelInstance.connect(signer).getDeployedInstancesByOwner(_ownerAddress);

  const calls = [];

  instancesData.map(async (instanceData, index) => {
    const getAirmanList = {
      abi: adminPanelAbi,
      address: getAdmPanAddress(_network),
      name: 'deployedByUser',
      params: [_ownerAddress, index],
    };

    calls[index] = getAirmanList;
  })

  let airManListDataRaw

  try {
    airManListDataRaw = await multicall(adminPanelAbi, calls, _network);
  } catch (e) {
    airManListDataRaw = 0
    console.log(`Error getting the deployed AirMan instances`)
  }

  return airManListDataRaw;
}

export const getCampaignInfo = async (_network, _instanceAddress) => {
  const airManInstance = new ethers.Contract(_instanceAddress, airdropManagerAbi, signer);
  let airdropsIds = await airManInstance.showDeployedCampaigns();
  const calls = [];

  for (let i = 0; i < airdropsIds; i++) {
    const getAirDropList = {
      abi: airdropManagerAbi,
      address: _instanceAddress,
      name: 'campaigns',
      params: [i],
    };

    calls[i] = getAirDropList;
  }

  const airdropInfoDataRaw = await multicall(airdropManagerAbi,  calls,  _network);

  return airdropInfoDataRaw;
}