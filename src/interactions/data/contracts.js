export default function activeNetworkContractAddr(network) {
    let contract = ''
    
    switch (network) {
        case 61:
            contract = '0';
            break;

        case 87:
            contract = '1';
            break;

        case 4002:
            contract = '3';
            break;

        default:
            contract = 'unsupported';
    }
    
    console.log(network)  // debug
    console.log(contract) // debug

    return contract
}