export function isSupportedNetwork(chainId) {
    const supportedNetworks = [ '0x3d', '0x57', '0x7a69' ]
    let i = undefined
  
    if ((typeof chainId) === 'number') {
      const inHex = Number(chainId).toString(16).padStart(2, "0");
      i = supportedNetworks.find(e => e === '0x'+inHex);
    } else if ((typeof chainId) === 'string') {
      i = supportedNetworks.find(e => e === chainId);
    }
  
    if (typeof i === 'undefined') {
      return false
    } else {
      return true
    }
  }
  
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
  
      this.props.changeNetwork(chainID)
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
            let url = ''
            let chainName = ''
            let chainSymbol = ''
  
            switch (chainID) {
              case '3d' && '0x3d':
                url = 'https://www.ethercluster.com/etc';
                chainName = 'Ethereum Classic'
                chainSymbol = 'ETC'
  
                break;
  
              case '57' && '0x57' :
                url = 'https://dev.rpc.novanetwork.io';
                chainName = 'Nova Network'
                chainSymbol = 'SNT'
  
  
                break;
  
              case '0x7a69':
                url = 'http://127.0.0.1:8545/';
                chainName = 'localhost'
                chainSymbol = 'ETH'
  
                break;
              
              default:
                url = 'empty';
                chainName = 'empty'
                chainSymbol = 'broken'
   
                break;
            }
  
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
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
      //console.log(this.props.network)
      // handle other "switch" errors
    }
  }