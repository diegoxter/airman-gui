import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// Contract storing
export const getAdmPanAddress = (_network) => {
  let adminPanelContract = '';

  switch (_network) {
    case 61:
      adminPanelContract = '0';
      break;

    case 4002:
      // test token 0x7B76ce0b863e161D3024c1553300e5937EB83Ea0
      adminPanelContract = '0xD6A6E95870352d55b1D16C1AE0463550952E5618'; // previous '0x21f77B2eE7040Bc6647f36517463fB8F628061D2';
      break;

    case 87:
      // testTokenContract = 0xd9209ca92E8e468C3f8AD7F3CE6B265AfD92760d
      adminPanelContract = '0x553BB0B2C069Bbb1f117E272c4bCc7393Cade860'; // previous 0x700bF227BFf82705A4B1AD099098e4E258cD3570
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

export const getMulticallAddress = (_network) => {
  let multicallContract = '';

  switch (_network) {
    case 61:
      multicallContract = '0';
      break;

    case 4002:
      multicallContract = '0xb83853b065b4fEE34c7352E2b3ad1B5d867eB76E';
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

export const getAdminAddress = (_network) => {
  let adminAddress = '';

  switch (_network) {
    case 61:
      adminAddress = '0';
      break;

    case 4002:
      adminAddress = '0x162072bC30A66E240c5DEef918F83E8f280e6063';
      break;

    case 87:
      adminAddress = '1';
      break;

    case 31337: // This is for testing/debugging purposes
      adminAddress = '2';
      break;

    default:
      adminAddress = 'unsupported';
      break;
  }

  return adminAddress;
};

// Utils
export const convertToHex = (integer) => {
  let str = Number(integer).toString(16);

  return str.length === 1 ? "0" + str : str;
};

export const weiToEther = (value) => {
  const parsedValue = ethers.utils.formatEther(ethers.utils.parseUnits((value).toString(), 'wei'));

  return parsedValue;
}

// Network related functions
export const isSupportedNetwork = (chainId) => {
  const supportedNetworks = [ '0x3d', '0xfa2', '0x57', '0x7a69' ];

  if (typeof chainId === 'number') {
    chainId = '0x' + Number(chainId).toString(16).padStart(2, '0');
  }

  return typeof chainId === 'string' && supportedNetworks.includes(chainId);
};

export const getEtherBalance = async (address) => {
  const balance = ethers.utils.formatEther(await provider.getBalance(address));

  return balance;
}

export const handleNetworkChange = async (chainID) => {
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


export const waitForConfirmation = async (txHash, provider, interval, _setIsLoading) => {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (receipt === null) {
    setTimeout(() => {
      waitForConfirmation(txHash, provider, interval, _setIsLoading);
    }, interval);
    return false;
  } else {
    setTimeout(() => {}, interval);
    _setIsLoading(false);
    return true;
  }
}