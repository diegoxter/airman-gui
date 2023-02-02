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
  const supportedNetworks = [ '0x3d', '0x57' ]
  let i = ''

  // TO DO improve this
  if ((typeof chainId) === 'number') {
    const inHex = Number(chainId).toString(16).padStart(2, "0");
    i = supportedNetworks.find(e => e === '0x'+inHex);
  } else {
    i = supportedNetworks.find(e => e === chainId);
  }

  if ((typeof i) !== 'string') {
    console.log('no paso ' + i)
    return false
  } else {
    console.log('paso')
    return i
  }

}
