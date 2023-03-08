import { ethers } from "ethers";
import { waitForConfirmation } from ".";
import { multicall } from "./multicall";

import erc20ABI from '../assets/abis/ERC20.json';

let sleep = ms => new Promise(r => setTimeout(r, ms));
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const getTokenInfo = async (_owner, _tokenContractAddress, _targetAddress, _network) => {

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
  const getDecimals = {
    abi: erc20ABI,
    address: _tokenContractAddress,
    name: 'decimals',
    params: [],
  };

  const tokenInfoDataRaw = await multicall(
    erc20ABI,
    [
      getSymbol,
      getAllowance,
      getBalance,
      getDecimals
    ],
    _network);

    const [symbol, allowance, balance, decimals] = tokenInfoDataRaw;

    return { symbol, allowance, balance, decimals };
}

export const approveTokens = async (_account, _tokenContractAddress, _targetAddress, amount, decimals, _setIsLoading) => {
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);

  try {
    const tx = (await tokenInstance.connect(signer).approve(_targetAddress, parsedAmount));

      while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
        sleep(2500);
      }

      return true;
  } catch (e) {
    if (e.code === 'ACTION_REJECTED') {
        console.log(`rejected transaction`);
        _setIsLoading(false);
    } else {
      console.log(e);
      _setIsLoading(false);
    }
    return false;
  }
}

export const sendTokens = async (_account, _tokenContractAddress, _targetAddress, amount, _setIsLoading) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);

  try {
    const tx = (await tokenInstance.connect(signer).transfer(_targetAddress, Number(amount)));

    while (await waitForConfirmation(tx.hash, provider, 5000, _setIsLoading) !== true) {
      sleep(2500);
    }

    return true;
  } catch (e) {
    console.log(`erro while sending tokens`);
    return false;
  }
}

export const checkBalance = async (_targetAddress, _tokenContractAddress) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);
  const check = await tokenInstance.connect(signer).balanceOf(_targetAddress);

  return (Number(check));
}


// These are deprecated
export const getTokenSymbol = async (_address) => {
  const tokenInstance = new ethers.Contract(_address, erc20ABI, provider);
  const symbol = await tokenInstance.connect(signer).symbol();

  return symbol;
}

export const checkAllowance = async (account, _tokenContractAddress, _targetAddress) => {
  const tokenInstance = new ethers.Contract(_tokenContractAddress, erc20ABI, provider);
  const check = await tokenInstance.connect(signer).allowance(account, _targetAddress);

  return (Number(check));
}