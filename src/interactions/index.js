export function isSupportedNetwork(chainId) {
  const supportedNetworks = [ '0x3d', '0xfa2', '0x57', '0x7a69' ];
  
  if (typeof chainId === 'number') {
    chainId = '0x' + Number(chainId).toString(16).padStart(2, '0');
  } 
  
  return typeof chainId === 'string' && supportedNetworks.includes(chainId);
};


export const getAdmPanAddress = async (_network) => {
  let adminPanelContract = '';

  switch (_network) {
      case 61:
          adminPanelContract = '0';
          break;

      case 4002:
          // test token 0x7B76ce0b863e161D3024c1553300e5937EB83Ea0
          adminPanelContract = '0x10D2B5Bc907a0e0D8EC535e6FD14b0943A52820b'; // previous '0x21f77B2eE7040Bc6647f36517463fB8F628061D2';
          break;

      case 87:
          // testTokenContract = 0xd9209ca92E8e468C3f8AD7F3CE6B265AfD92760d
          adminPanelContract = '0x0536e5eEa687CB7d3B27DF258167581724658297'; // previous 0x700bF227BFf82705A4B1AD099098e4E258cD3570
          break;

      case 31337: // This is for testing/debugging purposes
          adminPanelContract = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
          break;

      default:
          adminPanelContract = 'unsupported';
          break;
  }   

  return adminPanelContract;
};
/*
export const getMulticallAddress = (_network) => {
  let multicallContract = '';

  switch (_network) {
      case 61:
        multicallContract = '0';
          break;

      case 4002:
          multicallContract = '0xcBD78C108821Fd7c51750874681401D1e449a70E';
          break;

      case 87:
          multicallContract = '1';
          break;

      case 31337: // This is for testing/debugging purposes
        multicallContract = '2';
          break;

      default:
          multicallContract = 'unsupported';
          break;
  }   

  return multicallContract;
};
*/
export const convertToHex = (integer) => {
  let str = Number(integer).toString(16);

  return str.length === 1 ? "0" + str : str;
};


export async function handleNetworkChange(chainID) {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x'+ convertToHex(chainID) }],
    });
    this.props.changeNetwork(chainID);
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        let url = '';
        let chainName = '';
        let chainSymbol = '';

        switch (chainID) {
          case '3d' && '0x3d':
            url = 'https://www.ethercluster.com/etc';
            chainName = 'Ethereum Classic';
            chainSymbol = 'ETC';

            break;

          case '4001' && '0xfa2':
            url = 'https://endpoints.omniatech.io/v1/fantom/testnet/public';
            chainName = 'Fantom Testnet';
            chainSymbol = 'FTM';

            break;

          case '57' && '0x57':
            url = 'https://dev.rpc.novanetwork.io';
            chainName = 'Nova Network';
            chainSymbol = 'SNT';

            break;

          case '0x7a69':
            url = 'http://127.0.0.1:8545/';
            chainName = 'localhost';
            chainSymbol = 'ETH';
            
            break;
          
          default:
            url = 'empty';
            chainName = 'empty';
            chainSymbol = 'broken';
            
            break;
        }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: 
        [
          {
            chainId: chainID,
            chainName: chainName,
            nativeCurrency: {
              name: chainName,
              symbol: chainSymbol,
              decimals: 18
            },
            rpcUrls: [ url ],
          },
        ],
      });

      this.props.changeNetwork(convertToHex(chainID))
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}


export async function waitForConfirmation(txHash, provider, interval, _setIsLoading) {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (receipt === null) {
    setTimeout(() => {
      waitForConfirmation(txHash, provider, interval, _setIsLoading);
    }, interval);
    return false;
  } else {
    _setIsLoading(false);
    return true;
  }
}