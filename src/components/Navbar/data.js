import {
  ETC_ICON_URL,
  FANTOM_ICON_URL,
  NOVA_ICON_URL,
  LOCALHOST_ICON_URL
} from '../iconURI';

export const networkOptions = [
    {
      key: 'ETC',
      text: 'ETC',
      value: '0x3d',
      image: { className:"ui mini image", src: ETC_ICON_URL },
    },
    {
      key: 'Fantom Testnet',
      text: 'Fantom Testnet',
      value: '0xfa2',
      image: { className:"ui mini image", src: FANTOM_ICON_URL },
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
      value: '0x7a69',
      image: { className:"ui mini image", src: LOCALHOST_ICON_URL },
    },
];