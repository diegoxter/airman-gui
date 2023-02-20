import {
  checkBalance,
  checkAllowance,
  checkTokenSymbol,
  approveTokens,
  getTokenSymbol, 
} from '../../../interactions/erc20';
import { getAdmPanAddress } from '../../../interactions';
import { deployAirMan } from '../../../interactions/airmanSystem';
import { Button, Form } from 'semantic-ui-react';
import { useState } from 'react';

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
    .then((value) => {  console.log(value)
      if (value === true) {
        handleCancelClick()
        setCheckedInstances(false)
      } else {
        console.log('Not deployed')
        return false
      }}
    )
  }

  const handleApproveClick = async () => {
    setIsLoading(true);
    approveTokens(accounts, contractInputValue, await getAdmPanAddress(network), Number(amountInputValue), setIsLoading)
      .then((value) => {
        if (value === true) {
          setAllowance(Number(amountInputValue))
        } else {
          console.log('Not approved')
        }
    })
  }

  if (contractInputValue.length === 42 && isValidContract && isValidAmount) {
    if (typeof accounts === 'string' && allowance === '') {
      getAdmPanAddress(network)
      .then((value) => {
       checkAllowance(accounts, contractInputValue, value)
          .then((value) => setAllowance(value))
        })
    }
  }

  const diabledButton = (
    <Button
      content="Verify the information given"
      disabled
    />
  )

  if (isValidContract && amountInputValue !== '') {
    if (Number(amountInputValue) === 0  || contractInputValue === '') {
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
  isValidContract,
  setIsValidContract,
  contractInputValue,
  contract,
  setContract,
  tokenSymbol,
  setTokenSymbol,
  symbolCheck, 
  setSymbolCheck,
  setTokenAmount
}) => {

  const tokensHeld = async () => {
    if (contractInputValue === '') {
      return '';
    } else if (isValidContract) {
      return checkBalance(accounts, contractInputValue)
      .then((value) => { 
        let total = value;
        return ` ${total} ${tokenSymbol}` ;
      })
    } else if (!isValidContract) {
      return ' Invalid token';
    }
  }

  if (tokenSymbol === '' && symbolCheck) {
    getTokenSymbol(contractInputValue)
    .then((value) => {
      setTokenSymbol(value);
    })
  }

  const handleContractChange = ( num ) => {
    setContract(num);
    setSymbolCheck(false);
    setIsValidContract(false);
    setTokenAmount('');
  }

  if (isValidContract) {
    tokensHeld()
    .then((value) => {setTokenAmount(value)});
  }


  if (contractInputValue.length === 42 && !symbolCheck) {
    checkTokenSymbol(contractInputValue, symbolCheck, setSymbolCheck, setIsValidContract);
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