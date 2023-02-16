import { ethers } from "ethers";
import { waitForConfirmation, getAdmPanAddress } from ".";

import erc20ABI from '../assets/abis/ERC20.json';


const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
let network = provider.getNetwork();

export const getTokenSymbol = async (_address) => {
  const tokenInstance = new ethers.Contract(_address, erc20ABI, provider);
  const symbol = await tokenInstance.connect(signer).symbol();

  return symbol;
}

export const checkTokenSymbol = async (_address, _symbolCheck, _setSymbolCheck, _setIsValidContract) => {
  const tokenInstance = new ethers.Contract(_address, erc20ABI, provider);
  let symbol = '';

  if (!_symbolCheck) {
      try {
          symbol = await tokenInstance.connect(signer).symbol();
      } catch (e) {
          console.log('hubo error');
          console.log(e);
      }
      _setIsValidContract(symbol !== '');
      _setSymbolCheck(symbol !== '');
  }

  return symbol !== '';
}

export const checkBalance = async (account, _tokenContractAddress) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);
  const check = await tokenInstance.connect(signer).balanceOf(account);
  
  return (Number(check));
}

export const checkAllowance = async (account, _contractAddress) => {
  const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider);
  const check = await tokenInstance.connect(signer).allowance(account, (await getAdmPanAddress(network)));
  
  return (Number(check));
}

export const approveTokens = async (_account, _contractAddress, amount, _setIsLoading) => {
  const tokenInstance = new ethers.Contract(_contractAddress, erc20ABI, provider);
  let approve = '';
  try {
      approve = (await tokenInstance.connect(signer).approve(await getAdmPanAddress(network), Number(amount)));
  } catch (e) {
      console.log(`fallo ${e}`);
  }

  waitForConfirmation(approve.hash, provider, 5000, _setIsLoading);
}
