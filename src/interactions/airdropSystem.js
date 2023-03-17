import { ethers } from "ethers";
import { waitForConfirmation } from ".";
import { getAirdropCampaignsAddressList } from "./airmanSystem";
import { multicall } from "./multicall";

import airdropCampaignAbi from './../assets/abis/AirdropCampaign.json';

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Getter functions
export const getWhitelistFee = async (_campaignAddress) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);
  const fee = await airdropCampaignInstance.whitelistFee();

  return fee;
}

export const getBasicAirdropInfo = async (_network, instanceAddress) => {

  const ownerTokenWithdrawDateCall = {
    abi: airdropCampaignAbi,
    address: instanceAddress,
    name: 'ownerTokenWithdrawDate',
    params: [],
  };
  const IsPrivateCall = {
    abi: airdropCampaignAbi,
    address: instanceAddress,
    name: 'isPrivate',
    params: [],
  };
  const whiteListFeeCall = {
    abi: airdropCampaignAbi,
    address: instanceAddress,
    name: 'whitelistFee',
    params: [],
  };
  const participantCall = {
    abi: airdropCampaignAbi,
    address: instanceAddress,
    name: 'participantAmount',
    params: [],
  };
  const unclaimedCall = {
    abi: airdropCampaignAbi,
    address: instanceAddress,
    name: 'unclaimedAirdrops',
    params: [],
  };

  const airdropCampaignDataRaw = await multicall(
    airdropCampaignAbi,
    [
      ownerTokenWithdrawDateCall,
      IsPrivateCall,
      whiteListFeeCall,
      participantCall,
      unclaimedCall
    ],
    _network);

  return airdropCampaignDataRaw
}

export const getDetailedAirdropCampaignInfo = async (_network, _account) => {
  const airdropList = await getAirdropCampaignsAddressList(_network);
  const airdropListData = [];
  const airdropParticipantData = [];

  await Promise.all(airdropList.map(async (instanceAddress, index) => {
    const airdropCampaignInstance = new ethers.Contract(instanceAddress, airdropCampaignAbi, provider);

    const tokenAddressCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'tokenAddress',
      params: [],
    };
    const claimableSinceCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'claimableSince',
      params: [],
    };
    const fixedAmountCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'fixedAmount',
      params: [],
    };
    const whitelistFeeCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'whitelistFee',
      params: [],
    };
    const tokenAmountCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'tokenAmount',
      params: [],
    };
    const amountForEachUserCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'amountForEachUser',
      params: [],
    };
    const isPrivateCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'isPrivate',
      params: [],
    };
    const ownerTokenWithdrawDateCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'ownerTokenWithdrawDate',
      params: [],
    };
    const airManAddressCall = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'airMan',
      params: [],
    };

    const airdropCampaignDataRaw = await multicall(
      airdropCampaignAbi,
      [
          tokenAddressCall,
          claimableSinceCall,
          fixedAmountCall,
          whitelistFeeCall,
          tokenAmountCall,
          amountForEachUserCall,
          isPrivateCall,
          ownerTokenWithdrawDateCall,
          airManAddressCall
      ],
      _network);

      airdropListData[index] = {
        campaignAddress: instanceAddress,
        tokenAddress: airdropCampaignDataRaw[0],
        claimableSince: Number(airdropCampaignDataRaw[1]),
        fixedAmount: airdropCampaignDataRaw[2],              // bool
        whitelistFee: Number(airdropCampaignDataRaw[3]),
        tokenAmount: Number(airdropCampaignDataRaw[4]),
        amountForEachUser: Number(airdropCampaignDataRaw[5]),
        isPrivate: airdropCampaignDataRaw[6],
        ownerTokenWithdrawDateCalls: airdropCampaignDataRaw[7],
        airManAddress: airdropCampaignDataRaw[8]
      };

      const participantInfoRawData = await airdropCampaignInstance.participantInfo(_account);
      airdropParticipantData[index] = {
        address: participantInfoRawData['ParticipantAddress'],
        isBanned: participantInfoRawData['isBanned'],
        claimed: participantInfoRawData['claimed']
      };
  }))

  return [ airdropListData, airdropParticipantData ];
}


// Transaction functions
export const joinAirdrop = async (_campaignAddress, _userAddress, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = (await airdropCampaignInstance.connect(signer).addToPayableWhitelist(
      {
        value: await getWhitelistFee(_campaignAddress),
      }
    ));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    return false;
  }
}

export const retireFromAirdrop = async (_campaignAddress, _userAddress, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).retireFromCampaign();

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    return false;
  }
}

export const claimAirdrop = async (_campaignAddress, _userAddress, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).receiveTokens();

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    return false;
  }
}

export const withdrawCampaignTokens = async (_campaignAddress, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).manageFunds();

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    return false;
  }
}

export const addUserList = async (_campaignAddress, _userList, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).batchAddToWhitelist(_userList);

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log('Failure to batchAdd addressess');
    _setIsLoading(false);
    return false;
  }
}

export const banUser = async (_campaignAddress, _user, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);
  try {
    const tx = await airdropCampaignInstance.connect(signer).toggleParticipation(_user);

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log('Failure to ban user');
    _setIsLoading(false);
    return false;
  }
}

export const updateFee = async (_campaignAddress, _newFee, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).updateFee(_newFee);

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log('Failure to update fee');
    _setIsLoading(false);
    return false;
  }
}

export const toggleIsPrivate = async (_campaignAddress, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).toggleIsPrivate();

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (error) {
    console.log('Failure to update fee');
    _setIsLoading(false);
    return false;
  }
}


// Helper functions
export const isCampaignActive = (_campaignInfo_claimableSince) => {
  return (Number(_campaignInfo_claimableSince) * 1000 > Date.now());
}