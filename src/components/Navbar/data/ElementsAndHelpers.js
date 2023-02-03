import { 
  ETC_ICON_URL, 
  NOVA_ICON_URL, 
  LOCALHOST_ICON_URL 
} from '../../iconURI'

export const networkOptions = [
    {
      key: 'ETC',
      text: 'ETC',
      value: '0x3d',
      image: { className:"ui mini image", src: ETC_ICON_URL },
    },
    {
      key: 'Nova Network',
      text: 'Nova Network',
      value: '0x57',
      image: { className:"ui mini image", src: NOVA_ICON_URL },
    },
    {
      key: 'localhost',
      text: 'localhost',
      value: 'localhost',
      image: { className:"ui mini image", src: LOCALHOST_ICON_URL },
    },
]

export function isSupportedNetwork(chainId) {
  const supportedNetworks = [ '0x3d', '0x57' ]
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
    return i
  }
}

export const convert = (integer) => {
  let str = Number(integer).toString(16);
  
  return str.length === 1 ? "0" + str : str;
};

export async function handleNetworkChange(chainID) {

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x'+ convert(chainID) }],
    });

    this.props.changeNetwork(chainID)
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
          let url = ''
          let name = ''

          switch (chainID) {
            case '3d':
              url = 'https://www.ethercluster.com/etc';
              name = 'Ethereum Classic'

              break;

            case '57':
              url = 'https://dev.rpc.novanetwork.io';
              name = 'Nova Network'

              break;

            case 'localhost':
              url = 'Test';
              name = 'Reserva'

              break;
            
            default:
              url = 'https://etc.wallet.coinbase.com/api/';
              name = 'Ethereum Classic'
          }

        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x'+chainID,
              chainName: name,
              rpcUrls: [ url ],
              // TO DO add the native currency
            },
          ],
        });

        this.props.changeNetwork(convert(chainID))
      } catch (addError) {
        // handle "add" error
      }
    }
    //console.log(this.props.network)
    // handle other "switch" errors
  }
}