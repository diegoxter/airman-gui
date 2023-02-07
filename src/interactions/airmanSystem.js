import { ethers } from "ethers";
import adminPanelAbi from '../../assets/abis/AdminPanel.json'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

  // debug
let tempAdminPanelAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'



