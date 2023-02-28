import { approveTokens, getTokenInfo } from '../../../interactions/erc20';
import { getAdmPanAddress } from '../../../interactions';
import { deployAirMan } from '../../../interactions/airmanSystem';
import { Button, Form } from 'semantic-ui-react';
import { useState } from 'react';
import { BigNumber } from 'ethers';

export const DeployButton = ({
  network,
  setOpen,
  contractInputValue,
  accounts,
  isValidContract,
  amountInputValue,
  isValidAmount,
  setCheckedInstances,
  allowance,
  setAllowance,
  handleCancelClick
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLetsDoItClick = () => {
    setIsLoading(true);

    deployAirMan(contractInputValue, amountInputValue, setIsLoading, setOpen, network)
    .then((value) => {
      if (value === true) {
        handleCancelClick();
        setCheckedInstances(false);
      } else {
        console.log('Not deployed');
        return false;
      }}
    )
  }

  const handleApproveClick = async () => {
    setIsLoading(true);
    approveTokens(accounts, contractInputValue, await getAdmPanAddress(network), Number(amountInputValue), setIsLoading)
      .then((value) => {
        if (value === true) {
          setAllowance(Number(amountInputValue));
        } else {
          console.log('Not approved');
        }
    })
  }

  const diabledButton = (
    <Button
      content="Verify the information given"
      disabled
    />
  )

  if (isValidContract && amountInputValue !== '') {
    if (Number(amountInputValue) === 0 || contractInputValue === '') {
      return (
        <Button
          content="Invalid token amount"
          disabled
        />
      );
    } else if (isLoading) {
      return (
        <Button
          loading
          primary
          size='medium'>
            PLACEH
        </Button>
      );
    } else if (Number(allowance) >= Number(amountInputValue) && network !== '') {
      return (
        <Button
          content="Let's do it!"
          onClick={() => {
            handleLetsDoItClick();
          }}
          positive
        />
      );
    } else if (isValidAmount) {
      return (
        <Button
          color='blue'
          content="Approve tokens"
          onClick={() => {
            handleApproveClick();
          }}
        />
      );
    } else if (!isValidAmount) {
      return (
        diabledButton
      );
    }
  } else {
    return (
      diabledButton
    );
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
      setTokenAmount((parseInt(value.balance)).toLocaleString());
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
      label='Token contract'
      placeholder='Address: 0x...'
      value={contract}
      onChange={(e) => handleContractChange(e.target.value)}
    />
  );
}