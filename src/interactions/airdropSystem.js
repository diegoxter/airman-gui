import { ethers } from "ethers";
import { waitForConfirmation } from ".";
import { getAirdropCampaignsAddressList } from "./airmanSystem";
import { multicall } from "./multicall";

import airdropCampaignAbi from './../assets/abis/AirdropCampaign.json';

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Getter functions
export const getWhitelistFee = async (_campaignAddress) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);
  const fee = await airdropCampaignInstance.whitelistFee();

  return fee;
}

export const getAirdropCampaignInfo = async (_network, _account) => {
  const airdropList = await getAirdropCampaignsAddressList(_network);
  const airdropListData = [];
  const airdropParticipantData = [];

  await Promise.all(airdropList.map(async (instanceAddress, index) => {
    const airdropCampaignInstance = new ethers.Contract(instanceAddress, airdropCampaignAbi, provider);

    const tokenAddressCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'tokenAddress',
      params: [],
    };
    const claimableSinceCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'claimableSince',
      params: [],
    };
    const fixedAmountCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'fixedAmount',
      params: [],
    };
    const whitelistFeeCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'whitelistFee',
      params: [],
    };
    const tokenAmountCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'tokenAmount',
      params: [],
    };
    const amountForEachUserCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'amountForEachUser',
      params: [],
    };

    const airdropCampaignDataRaw = await multicall(
      airdropCampaignAbi,
      [
          tokenAddressCalls,
          claimableSinceCalls,
          fixedAmountCalls,
          whitelistFeeCalls,
          tokenAmountCalls,
          amountForEachUserCalls
      ],
      _network);

      airdropListData[index] = {
        campaignAddress: instanceAddress,
        tokenAddress: airdropCampaignDataRaw[0],
        claimableSince: Number(airdropCampaignDataRaw[1]),
        fixedAmount: airdropCampaignDataRaw[2],              // bool
        whitelistFee: Number(airdropCampaignDataRaw[3]),
        tokenAmount: Number(airdropCampaignDataRaw[4]),
        amountForEachUser: Number(airdropCampaignDataRaw[5])
      };

      const participantInfoRawData = await airdropCampaignInstance.participantInfo(_account);
      airdropParticipantData[index] = {
        address: participantInfoRawData['ParticipantAddress'],
        canReceive: participantInfoRawData['canReceive'],
        claimed: participantInfoRawData['claimed']
      };
  }))

  return [ airdropListData, airdropParticipantData ];
}

// Transaction functions
export const joinAirdrop = async (_campaignAddress, _userAddress, _setIsLoading, _setHasJoined) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = (await airdropCampaignInstance.connect(signer).addToPayableWhitelist(
      {
        value: await getWhitelistFee(_campaignAddress),
      }
      )
    );

    let sleep = ms => new Promise(r => setTimeout(r, ms));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }
    _setHasJoined(true);

    return true;
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    _setHasJoined(false);
    return false;
  }
}

export const retireFromAirdrop = async (_campaignAddress, _userAddress, _setIsLoading, _setHasJoined) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).retireFromCampaign();

    let sleep = ms => new Promise(r => setTimeout(r, ms));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }
    _setHasJoined(await checkParticipation(_campaignAddress, _userAddress));

    return true;
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
    return false;
  }
}

export const claimAirdrop = async (_campaignAddress, _userAddress, _setIsLoading, _setHasJoined) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);

  try {
    const tx = await airdropCampaignInstance.connect(signer).receiveTokens();

    let sleep = ms => new Promise(r => setTimeout(r, ms));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }
    _setHasJoined(await checkCanClaim(_campaignAddress, _userAddress));

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

    let sleep = ms => new Promise(r => setTimeout(r, ms));

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

    let sleep = ms => new Promise(r => setTimeout(r, ms));

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

    let sleep = ms => new Promise(r => setTimeout(r, ms));

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

// Helper functions
export const isCampaignActive = (_campaignInfo_claimableSince) => {
  return (Number(_campaignInfo_claimableSince) * 1000 > Date.now());
}

export const checkParticipation = async (_campaignAddress, _userAddress) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);
  const participantInfo = await airdropCampaignInstance.participantInfo(_userAddress);

  return participantInfo[0].toLowerCase() === _userAddress;
}

export const checkCanClaim = async (_campaignAddress, _userAddress) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);
  const participantInfo = await airdropCampaignInstance.participantInfo(_userAddress);

    return ((participantInfo[0]).toLowerCase() === _userAddress && participantInfo[1] === false);
}