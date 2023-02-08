import { ethers } from "ethers";
import activeNetworkContractAddr from "./data/contracts";
import { waitForConfirmation } from ".";

import adminPanelAbi from '../../assets/abis/AdminPanel.json'


const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

/*
export const approveTokens = async (_account, _contractAddress, amount, _setIsLoading) => {
  const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
  const y = await getActiveNetworkContract()
  const approve = (await tokenInstance.connect(signer).approve(y, Number(amount)))

  waitForConfirmation(approve.hash, provider, 5000, _setIsLoading)
}*/



