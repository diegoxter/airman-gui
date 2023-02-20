import { ethers } from "ethers";
import { waitForConfirmation } from ".";
import { multicall } from "./multicall";

import erc20ABI from '../assets/abis/ERC20.json';

let sleep = ms => new Promise(r => setTimeout(r, ms));
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const checkTokenSymbol = async (_tokenAddress, _symbolCheck, _setSymbolCheck, _setIsValidContract) => {
  const tokenInstance = new ethers.Contract(_tokenAddress, erc20ABI, provider);
  let symbol = '';

  if (!_symbolCheck) {
      try {
          symbol = await tokenInstance.connect(signer).symbol();
      } catch (e) {
          console.log('Error getting the token symbol');
      }
      _setIsValidContract(symbol !== '');
      _setSymbolCheck(symbol !== '');
  }

  return symbol !== '';
}

export const getTokenInfo = async (_owner, _tokenContractAddress, _targetAddress, _network) => {
console.log(_targetAddress)
  const getSymbol = {
    abi: erc20ABI,
    address: _tokenContractAddress,
    name: 'symbol',
    params: [],
  };
  const getAllowance = {
    abi: erc20ABI,
    address: _tokenContractAddress,
    name: 'allowance',
    params: [_owner, _targetAddress],
  };
  const getBalance = {
    abi: erc20ABI,
    address: _tokenContractAddress,
    name: 'balanceOf',
    params: [_owner],
  };

  const tokenInfoDataRaw = await multicall(
    erc20ABI,
    [
      getSymbol, 
      getAllowance, 
      getBalance, 
    ],
    _network)

    const symbol = tokenInfoDataRaw[0]
    const allowance = tokenInfoDataRaw[1]
    const balance = tokenInfoDataRaw[2]

    console.log(symbol, allowance, balance)
}

export const getTokenSymbol = async (_address) => {
  const tokenInstance = new ethers.Contract(_address, erc20ABI, provider);
  const symbol = await tokenInstance.connect(signer).symbol();

  return symbol;
}

export const checkBalance = async (_targetAddress, _tokenContractAddress) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);
  const check = await tokenInstance.connect(signer).balanceOf(_targetAddress);
  
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
      const tx = (await tokenInstance.connect(signer).approve(_targetAddress, Number(amount)));

      while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
        sleep(2500);
      }

      return true
  } catch (e) {
    if (e.code === 'ACTION_REJECTED') {
        console.log(`rejected transaction`);
        _setIsLoading(false);
    } else {
      console.log(`error was ${e.code}`);
      _setIsLoading(false);
    }
    return false
  }
}

export const sendTokens = async (_account, _tokenContractAddress, _targetAddress, amount, _setIsLoading) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);

  try {
      const tx = (await tokenInstance.connect(signer).transfer(_targetAddress, Number(amount)));

      waitForConfirmation(tx.hash, provider, 5000, _setIsLoading);
  } catch (e) {
      console.log(`erro while sending tokens`);
  }
}

export const checkIfHasEnoughTokens = async (_ownerAddress, _targetAddress, _amountInputValue, _setEnoughTokens) => {
  if (await checkBalance(_ownerAddress, _targetAddress) < Number(_amountInputValue)) {
    _setEnoughTokens(false);
  } else {
    _setEnoughTokens(true);
  }
}