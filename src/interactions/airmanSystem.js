import { ethers } from "ethers";
import { waitForConfirmation, getAdmPanAddress } from ".";

import adminPanelAbi from '../assets/abis/AdminPanel.json'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const network = provider.getNetwork()

const getFee = async () => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(network)), adminPanelAbi, provider)
  const fee = await adminPanelInstance.feeInGwei()
  const feeInEther = ethers.utils.formatEther(fee.toString())

  console.log(`The fee is ${fee} Gwei or ${feeInEther} Ether`)
  return fee
}

export const deployAirMan = async (_token, amount, _setIsLoading, _setOpen) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(network)), adminPanelAbi, provider)
  const fee = await getFee()
  const tx = (await adminPanelInstance.connect(signer).newAirdropManagerInstance(
    _token, 
    Number(amount),
    {
      value: fee,
    }
    )
  )

  const deploy = await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading)
  if (deploy) {
    _setOpen(false)
  }

  return true
}



