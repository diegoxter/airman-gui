import { ethers } from "ethers";
import { waitForConfirmation } from ".";
import activeNetworkContractAddr from "./data/contracts";
import erc20ABI from '../assets/abis/ERC20.json'

/* TO DO functions
*
* Approve tokens
*
*/
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

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

  // debug
// let tempAdminPanelAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
let network = provider.getNetwork()

const getActiveNetworkContract = async () => {
    const x = await activeNetworkContractAddr((await network).chainId)
    return (x)
}

export const checkBalance = async (account, _contractAddress) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    const check = await tokenInstance.connect(signer).balanceOf(account)

    return (Number(check))
}

export const checkAllowance = async (account, _contractAddress) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    let y = await getActiveNetworkContract()

    const check = await tokenInstance.connect(signer).allowance(account, y)

    return (Number(check))
}

export const approveTokens = async (_account, _contractAddress, amount, _setIsLoading) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    const y = await getActiveNetworkContract()
    const approve = (await tokenInstance.connect(signer).approve(y, Number(amount)))

    waitForConfirmation(approve.hash, provider, 5000, _setIsLoading)
}
