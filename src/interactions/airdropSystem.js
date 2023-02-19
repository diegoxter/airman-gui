import { ethers } from "ethers";
import { waitForConfirmation } from ".";
import { getDeployedAirmanListInformation } from "./airmanSystem";

import airdropCampaignAbi from './../assets/abis/AirdropCampaign.json'

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const getAirdropCampaignData = async (_network) => {
  const airdropList = await getDeployedAirmanListInformation(_network)

  return airdropList
}
