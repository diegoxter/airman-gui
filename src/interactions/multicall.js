import { ethers } from "ethers";
import { getMulticallAddress } from ".";

import multicallAbi from './../assets/abis/MulticallV2.json';

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);

export const multicall = async (abi, calls, chainId) => {
    const multi = new ethers.Contract(getMulticallAddress(chainId), multicallAbi, provider);
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => (
      {
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params)
    }));

    const { returnData } = await multi.callStatic.aggregate(calldata);
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));
    return res;
};