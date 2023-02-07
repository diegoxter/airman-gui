import { ethers } from "ethers";
import erc20ABI from '../assets/abis/ERC20.json'

/* TO DO functions
*
* Check the allowance 
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
    }

    console.log('no existe')
    return false
  }


export const checkAllowance = async (account, _address) => {
    const tokenInstance = new ethers.Contract(_address, erc20ABI, provider)
    const check = await tokenInstance.connect(signer).allowance(account, '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512')

    console.log(check)
}
