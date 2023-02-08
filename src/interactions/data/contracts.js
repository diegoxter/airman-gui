export default function activeNetworkAdminPanelContractAddr(network) {
    let adminPanelContract = ''
    // testTokenContract = '0xd9209ca92E8e468C3f8AD7F3CE6B265AfD92760d'

    switch (network) {
        case 61:
            adminPanelContract = '0';
            break;

        case 87:
            adminPanelContract = '0x700bF227BFf82705A4B1AD099098e4E258cD3570';
            break;

        case 4002:
            adminPanelContract = '3';
            break;
        
        case 31337: // This is for testing/debugging purposes
            adminPanelContract = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
            break;

        default:
            adminPanelContract = 'unsupported';
    }   

    return adminPanelContract
}