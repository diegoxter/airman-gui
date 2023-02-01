import { 
  ETC_ICON_URL, 
  NOVA_ICON_URL, 
  LOCALHOST_ICON_URL 
} from './iconURI'

export const networkOptions = [
    {
      key: 'ETC',
      text: 'ETC',
      value: '61', // TO DO get .toHex() this
      image: { className:"ui mini image", src: ETC_ICON_URL },
    },
    {
      key: 'Nova Network',
      text: 'Nova Network',
      value: '87', // TO DO get .toHex() this
      image: { className:"ui mini image", src: NOVA_ICON_URL },
    },
    {
      key: 'localhost',
      text: 'localhost',
      value: 'localhost', // TO DO get .toHex() this
      image: { className:"ui mini image", src: LOCALHOST_ICON_URL },
    },
]

export function isSupportedNetwork(chainId) {
  const supportedNetworks = [ 61, 87 ]

  const i = supportedNetworks.find(e => e === chainId);

  if ((typeof i) !== 'number') {
    return false
  } else {
    return i
  }

}
