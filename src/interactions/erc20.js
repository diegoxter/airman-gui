import { ethers } from "ethers";
import { waitForConfirmation, getAdmPanAddress } from ".";

import erc20ABI from '../assets/abis/ERC20.json'


const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
let network = provider.getNetwork()

export const checkTokenSymbol = async (_address) => {
    const tokenInstance = new ethers.Contract(_address, erc20ABI, provider)
    // TO DO rework this to use a try {} catch structure
    const symbol = await tokenInstance.connect(signer).symbol()
    
    if (symbol !== '') {
        return true;
    } else {
        return false
    }
}

export const checkBalance = async (account, _contractAddress) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    const check = await tokenInstance.connect(signer).balanceOf(account)

    return (Number(check))
}

export const checkAllowance = async (account, _contractAddress) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)

    const check = await tokenInstance.connect(signer).allowance(account, (await getAdmPanAddress(network)))

    return (Number(check))
}

export const approveTokens = async (_account, _contractAddress, amount, _setIsLoading) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    const approve = (await tokenInstance.connect(signer).approve(await getAdmPanAddress(network), Number(amount)))

    waitForConfirmation(approve.hash, provider, 5000, _setIsLoading)
}
