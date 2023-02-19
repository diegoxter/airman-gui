import { ethers } from "ethers";
import { waitForConfirmation } from ".";
import { getDeployedAirmanListInformation } from "./airmanSystem";
//import { fetchAirdropCampaignData } from "./multicall";

import airdropCampaignAbi from './../assets/abis/AirdropCampaign.json'

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Getter functions
export const getWhitelistFee = async (_campaignAddress) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);
  const fee = await airdropCampaignInstance.whitelistFee();

  return fee;
}
/*
export const testMulticall = async (_network) => {
  const airdropList = await getDeployedAirmanListInformation(_network)
  const tx = await fetchAirdropCampaignData(_network, airdropList, airdropCampaignAbi)

  return tx
}
*/
export const getAirdropCampaignData = async (_network, _account) => {
  const airdropList = await getDeployedAirmanListInformation(_network)
  const airdropListData = [{
    campaignAddress: '',
    tokenAddress: '',
    claimableSince: '',
    isActive: '',                 // bool
    acceptPayableWhitelist: '',   // bool
    fixedAmount: '',              // bool
    whitelistFee: '',
    tokenAmount: '',
    amountForEachUser: ''
  }];
  const airdropParticipantData = [{ campaignAddress: '', address: '', canReceive: '', claimed: '' }];

  try {  // TO DO optimize this with https://github.com/makerdao/multicall/blob/master/src/Multicall2.sol
    await Promise.all(airdropList.map(async (instanceAddress, index) => {
      const airdropCampaignInstance = new ethers.Contract(instanceAddress, airdropCampaignAbi, provider);

      airdropListData[index] = {
        campaignAddress: instanceAddress,
        tokenAddress: await airdropCampaignInstance.tokenAddress(),
        claimableSince: await airdropCampaignInstance.claimableSince(),
        isActive: await airdropCampaignInstance.isActive(),
        acceptPayableWhitelist: await airdropCampaignInstance.acceptPayableWhitelist(),
        fixedAmount: await airdropCampaignInstance.fixedAmount(),
        whitelistFee: await airdropCampaignInstance.whitelistFee(),
        tokenAmount: await airdropCampaignInstance.tokenAmount(),
        amountForEachUser: await airdropCampaignInstance.amountForEachUser()
      };

      airdropParticipantData[index] = {
        campaignAddress: instanceAddress,
        address: (await airdropCampaignInstance.participantInfo(_account))['ParticipantAddress'],
        canReceive: (await airdropCampaignInstance.participantInfo(_account))['canReceive'],
        claimed: (await airdropCampaignInstance.participantInfo(_account))['claimed']
      }

    }));
  } catch (e) {
    console.log(e)
  }

  return [ airdropListData, airdropParticipantData ]
}

// Transaction functions

export const joinAirdrop = async (_campaignAddress, _setIsLoading) => {
  const airdropCampaignInstance = new ethers.Contract(_campaignAddress, airdropCampaignAbi, provider);
console.log(_campaignAddress)
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
    _setIsLoading(false)
  }

}