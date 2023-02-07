import { ethers } from "ethers";
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
        console.log('existe')
        return true;
    } else {
        console.log('no existe')
        return false
    }


}

  // debug
let tempAdminPanelAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

export const checkBalance = async (account, _contractAddress) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    const check = await tokenInstance.connect(signer).balanceOf(account)

    return (Number(check))
}

export const checkAllowance = async (account, _contractAddress) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    const check = await tokenInstance.connect(signer).allowance(account, tempAdminPanelAddress)

    return (Number(check))
}

export const approveTokens = async (_contractAddress, tempAdminPanelAddress, amount) => {
    const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider)
    const approve = (await tokenInstance.connect(signer).approve(tempAdminPanelAddress, Number(amount)))

    console.log(`${Number(amount)} es del tipo ${typeof  Number(amount)}`)

    console.log(await approve)
}
