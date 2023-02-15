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

  let sleep = ms => new Promise(r => setTimeout(r, ms));

  while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
    sleep(2500)
  }
    _setOpen(false)
}


// Draw functions
export const getInstanceInformation = async (_address) => {
  const adminPanelInstance = new ethers.Contract((await getAdmPanAddress(network)), adminPanelAbi, signer)
  let instancesData = await getDeployedAirManList(_address)
  const instances = []

  instancesData.map(async (instanceData, index) => {
    let temp = await adminPanelInstance.connect(signer).deployedManagers(instanceData)

    instances[index] = temp
  });

  return instances
}
