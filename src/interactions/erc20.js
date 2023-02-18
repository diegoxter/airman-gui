import { ethers } from "ethers";
import { waitForConfirmation } from ".";

import erc20ABI from '../assets/abis/ERC20.json';


const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

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

export const getTokenSymbol = async (_address) => {
  const tokenInstance = new ethers.Contract(_address, erc20ABI, provider);
  const symbol = await tokenInstance.connect(signer).symbol();

  return symbol;
}

export const checkBalance = async (account, _tokenContractAddress) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);
  const check = await tokenInstance.connect(signer).balanceOf(account);
  
  return (Number(check));
}

export const checkAllowance = async (account, _tokenContractAddress, _targetAddress) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);
  const check = await tokenInstance.connect(signer).allowance(account, _targetAddress);
  
  return (Number(check));
}

export const approveTokens = async (_account, _tokenContractAddress, _targetAddress, amount, _setIsLoading) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);

  try {
      const approve = (await tokenInstance.connect(signer).approve(_targetAddress, Number(amount)));

      waitForConfirmation(approve.hash, provider, 5000, _setIsLoading);
  } catch (e) {
    if (e.code === 'ACTION_REJECTED') {
        console.log(`rejected transaction`);
        _setIsLoading(false);
    } else {
      console.log(`error was ${e.code}`);
      _setIsLoading(false);
    }
  }
}

export const sendTokens = async (_account, _tokenContractAddress, _targetAddress, amount, _setIsLoading) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);

  try {
      const approve = (await tokenInstance.connect(signer).transfer(_targetAddress, Number(amount)));

      waitForConfirmation(approve.hash, provider, 5000, _setIsLoading);
  } catch (e) {
      console.log(`erro while sending tokens`);
  }
}

export const checkIfHasEnoughTokens = async (_accounts, _contractInputValue, _amountInputValue, _setEnoughTokens) => {
  if (await checkBalance(_accounts, _contractInputValue) < Number(_amountInputValue)) {
    _setEnoughTokens(false);
  } else {
    _setEnoughTokens(true);
  }
}