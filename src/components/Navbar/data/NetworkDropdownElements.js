import { 
  ETC_ICON_URL, 
  NOVA_ICON_URL, 
  LOCALHOST_ICON_URL 
} from './iconURI'

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
  let i = ''

  if ((typeof chainId) === 'number') {
    const inHex = Number(chainId).toString(16).padStart(2, "0");
    i = supportedNetworks.find(e => e === '0x'+inHex);
  } else if ((typeof chainId) === 'string') {
    i = supportedNetworks.find(e => e === chainId);
  }

  return i
}
