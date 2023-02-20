import { ethers } from "ethers";
import { getMulticallAddress } from ".";

import multicallAbi from './../assets/abis/MulticallV2.json'

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const multicall = async (abi, calls, chainId) => {
    const multi = new ethers.Contract(getMulticallAddress(chainId), multicallAbi, provider)
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => (
      //console.log(call),
      {
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params)
    }));

    const { returnData } = await multi.callStatic.aggregate(calldata);
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));
    return res;
};
  
/*
export const fetchAirdropCampaignData = async (_network, _airdropList, _airdropCampaignAbi) => {

    const tokenAddressCalls = _airdropList.map((airdropCampaignAddress) => ({
      abi: _airdropCampaignAbi,
      address: airdropCampaignAddress,
      name: 'tokenAddress',
      params: [],
    }))
    const claimableSinceCalls = _airdropList.map((airdropCampaignAddress) => ({
        abi: _airdropCampaignAbi,
        address: airdropCampaignAddress,
        name: 'claimableSince',
        params: [],
    }))
    const isActiveCalls = _airdropList.map((airdropCampaignAddress) => ({
        abi: _airdropCampaignAbi,
        address: airdropCampaignAddress,
        name: 'isActive',
        params: [],
    }))
    const acceptPayableWhitelistCalls = _airdropList.map((airdropCampaignAddress) => ({
        abi: _airdropCampaignAbi,
        address: airdropCampaignAddress,
        name: 'acceptPayableWhitelist',
        params: [],
    }))
    const fixedAmountCalls = _airdropList.map((airdropCampaignAddress) => ({
        abi: _airdropCampaignAbi,
        address: airdropCampaignAddress,
        name: 'fixedAmount',
        params: [],
    }))
    const whitelistFeeCalls = _airdropList.map((airdropCampaignAddress) => ({
        abi: _airdropCampaignAbi,
        address: airdropCampaignAddress,
        name: 'whitelistFee',
        params: [],
    }))
    const tokenAmountCalls = _airdropList.map((airdropCampaignAddress) => ({
        abi: _airdropCampaignAbi,
        address: airdropCampaignAddress,
        name: 'tokenAmount',
        params: [],
    }))
    const amountForEachUserCalls = _airdropList.map((airdropCampaignAddress) => ({
        abi: _airdropCampaignAbi,
        address: airdropCampaignAddress,
        name: 'amountForEachUser',
        params: [],
    }))
    
    const airdropCampaignDataRaw = await multicall(
        _airdropCampaignAbi,
        [
            tokenAddressCalls, 
            claimableSinceCalls, 
            isActiveCalls, 
            acceptPayableWhitelistCalls,
            fixedAmountCalls,
            whitelistFeeCalls,
            tokenAmountCalls,
            amountForEachUserCalls
        ],
        _network)

    //console.log(await airdropCampaignDataRaw)

    /*
    const bnbBalance = tokenBnbBalancesRaw.pop()
    const tokenBalances = fromPairs(tokens.map((token, index) => [token, tokenBnbBalancesRaw[index]]))
  
    const poolTokenBalances = fromPairs(
      nonBnbPools
        .map((pool) => {
          if (!tokenBalances[pool.stakingToken.address]) return null
          return [pool.sousId, new BigNumber(tokenBalances[pool.stakingToken.address]).toJSON()]
        })
        .filter(Boolean),
    )
  
    // BNB pools
    const bnbBalanceJson = new BigNumber(bnbBalance.toString()).toJSON()
    const bnbBalances = fromPairs(bnbPools.map((pool) => [pool.sousId, bnbBalanceJson]))
  
    return { ...poolTokenBalances, ...bnbBalances } 
  }*/