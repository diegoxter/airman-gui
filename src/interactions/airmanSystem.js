import { ethers } from "ethers";
import { waitForConfirmation, getAdmPanAddress } from ".";

import adminPanelAbi from '../assets/abis/AdminPanel.json'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const network = provider.getNetwork()

// Getter functions
const getFee = async () => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(network)), adminPanelAbi, provider)
  const fee = await adminPanelInstance.feeInGwei()

  return fee
}

export const getDeployedAirManList = async (_address) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(network)), adminPanelAbi, provider)
  const list = await adminPanelInstance.connect(signer).getDeployedInstances(_address)

  return list
}


// Transaction functions
export const deployAirMan = async (_token, amount, _setIsLoading, _setOpen) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(network)), adminPanelAbi, signer)
  const fee = await getFee()
  console.log('lanzando')

  const tx = (await adminPanelInstance.connect(signer).newAirdropManagerInstance(
    _token, 
    Number(amount),
    {
      value: fee,
    }
    )
  )

    console.log('comprobando')
  //const deploy = await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading)
  waitForConfirmation(tx.hash, provider, 5000, _setIsLoading)
  .then(r => {
    _setOpen(false)
    console.log('cerrado')
  })
}


// Draw functions
export const getInstanceInformation = async (_address) => {
  let instances = await getDeployedAirManList(_address)

  console.log(instances)
}
