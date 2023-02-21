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
    const isActiveCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'isActive',
      params: [],
    };
    const acceptPayableWhitelistCalls = {
      abi: airdropCampaignAbi,
      address: instanceAddress,
      name: 'acceptPayableWhitelist',
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
          isActiveCalls, 
          acceptPayableWhitelistCalls,
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
        isActive: airdropCampaignDataRaw[2],                 // bool
        acceptPayableWhitelist: airdropCampaignDataRaw[3],   // bool
        fixedAmount: airdropCampaignDataRaw[4],              // bool
        whitelistFee: Number(airdropCampaignDataRaw[5]),
        tokenAmount: Number(airdropCampaignDataRaw[6]),
        amountForEachUser: Number(airdropCampaignDataRaw[7])
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
export const joinAirdrop = async (_campaignAddress, _setIsLoading) => {
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
  } catch (error) {
    console.log(error);
    _setIsLoading(false);
  }

}

// Helper functions
export const isCampaignActive = (_campaignInfo_claimableSince) => {
  return (Number(_campaignInfo_claimableSince) * 1000 > Date.now());
}