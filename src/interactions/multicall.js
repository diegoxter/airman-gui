import { ethers } from "ethers";
import { getMulticallAddress } from ".";

import multicallAbi from './../assets/abis/MulticallV2.json'

// TO DO this breaks when changing networks
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
/*
const multicall = async (abi, calls, chainId) => {
    const multi = new ethers.Contract(await getMulticallAddress(chainId), multicallAbi, provider)
    const itf = new ethers.utils.Interface(abi);
    const calldata = []
    const callNames = []

    for (const call of calls) {
        callNames.push(call[0].name)
    }

    try {
        Promise.all(calls.map(async (call) => {
    //console.log(call)

        for (const element of call) {
            calldata.push({
                target: element.address.toLowerCase(),
                callData: itf.encodeFunctionData(element.name, element.params)
            })
        }
        }));
    } catch (e) {
        console.log('Error while getting the calldata information')
    }

    const { returnData } = await multi.callStatic.aggregate(calldata);
    console.log(returnData)

    let g = 0
    const res = returnData.map((call, i) => {
        // itf.decodeFunctionResult(calls[i].name, call)
        if (g<callNames.length) {
            //console.log(g)

            g++
        }}
    );

    //return res;
};
  

export const fetchAirdropCampaignData = async (_network, _airdropList, _airdropCampaignAbi) => {
    //const multicallInstance = new ethers.Contract(await getMulticallAddress(_network), multicallAbi, provider);

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