import { ethers } from "ethers";
import { waitForConfirmation } from "../components/Navbar";
import { getDeployedAirmanListInformation } from "./airmanSystem";

import airdropCampaignAbi from './../assets/abis/AirdropCampaign.json'

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const getAirdropCampaignData = async (_network) => {
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

  try {
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

    }));
  } catch (e) {
    console.log('Error getting Airdrop campaign info')
  }

  return airdropListData
}
