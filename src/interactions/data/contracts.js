export default function activeNetworkContractAddr(network) {
    let adminPanelContract = ''

    switch (network) {
        case 61:
            adminPanelContract = '0';
            break;

        case 87:
            adminPanelContract = '1';
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