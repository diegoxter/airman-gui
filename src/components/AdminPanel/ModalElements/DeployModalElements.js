import { approveTokens, getTokenInfo } from '../../../interactions/erc20';
import { getAdmPanAddress, addToIPFS } from '../../../interactions';
import { deployAirMan } from '../../../interactions/airmanSystem';
import { Button, Form } from 'semantic-ui-react';
import { useState } from 'react';

export const DeployButton = ({
  network,
  setOpen,
  checked,
  amountInputValue,
  tokenDecimals,
  contractInputValue,
  accounts,
  isValidContract,
  isValidAmount,
  setCheckedInstances,
  allowance,
  setAllowance,
  handleCancelClick,
  campaignMetadata
}) => {
  const [ isLoading, setIsLoading ] = useState(false);

  const handleLetsDoItClick = () => {
    setIsLoading(true);
    addToIPFS(campaignMetadata[0])
    .then((jsonData) => {
      addToIPFS(campaignMetadata[1])
      .then((value) => {
        //console.log('https://testairdropman.infura-ipfs.io/ipfs/'+value)
        //console.log('https://testairdropman.infura-ipfs.io/ipfs/'+jsonData)
        deployAirMan(
          [jsonData.toString(), value.toString()],
          contractInputValue,
          amountInputValue,
          tokenDecimals,
          setIsLoading,
          setOpen,
          network
        )
        .then((value) => {
          if (value === true) {
            handleCancelClick();
            setCheckedInstances(false);
          } else {
            console.log('Not deployed');
            return false;
          }}
        );
      });
    })
  }

  const handleApproveClick = () => {
    setIsLoading(true);
    approveTokens(
      accounts,
      contractInputValue,
      getAdmPanAddress(network),
      amountInputValue,
      tokenDecimals,
      setIsLoading
    )
      .then((value) => {
        if (value === true) {
          setAllowance(amountInputValue * 10 ** Number(tokenDecimals));
        } else {
          console.log('Not approved');
        }
    });
  }

  const diabledButton = ( <Button content="Verify the information given" disabled/> )

  if (isValidContract && amountInputValue !== '') {
    if (Number(amountInputValue) === 0 || contractInputValue === '') {
      return ( <Button content="Invalid token amount" disabled/> );
    } else if (isLoading) {
      return (
        <Button loading primary size='medium'>
            PLACEH
        </Button>
      );
    } else if (Number(allowance) >= Number(amountInputValue * 10 ** Number(tokenDecimals))) {
      return (
        <Button positive content="Let's do it!" onClick={() => { handleLetsDoItClick() }} disabled={!checked} />
      );
    } else if (isValidAmount) {
      return (
        <Button color='blue' content="Approve tokens" onClick={() => { handleApproveClick() }}/>
      );
    } else if (!isValidAmount) {
      return ( diabledButton );
    }
  } else {
    return ( diabledButton );
  }
}

export const TokenContractInput = ({
  accounts,
  network,
  setIsValidContract,
  contractInputValue,
  contract,
  setContract,
  setAllowance,
  setTokenSymbol,
  symbolCheck,
  setSymbolCheck,
  setTokenDecimals,
  setTokenAmount
}) => {

  const handleContractChange = ( num ) => {
    setContract(num);
    setSymbolCheck(false);
    setTokenSymbol('');
    setAllowance('');
    setIsValidContract(false);
    setTokenAmount('');
  }

  if (contractInputValue.length === 42 && !symbolCheck) {
    let admPanelAddress = getAdmPanAddress(network);

    getTokenInfo(accounts, contractInputValue, admPanelAddress, network)
    .then((value) => {
    if ((typeof value === 'object' && value.symbol !== '') || typeof value.symbol !== 'undefined') {
      setIsValidContract(true);
      setTokenSymbol(value.symbol[0]);
      setSymbolCheck(true);
      setTokenAmount(value.balance);
      setTokenDecimals(value.decimals[0])
      setAllowance((value.allowance).toString());
    } else {
      setIsValidContract(false);
      setSymbolCheck(true);
      setTokenAmount('');
      setTokenSymbol('');
      setAllowance('');
    }
    })
  }

  return (
      <Form.Input
      width={10}
      label='Token contract'
      placeholder='Address: 0x...'
      value={contract}
      onChange={(e) => handleContractChange(e.target.value)}
    />
  );
}