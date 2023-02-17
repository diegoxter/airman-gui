import {
  checkBalance,
  checkAllowance,
  checkTokenSymbol,
  approveTokens,
  getTokenSymbol 
} from '../../../interactions/erc20';
import { getAdmPanAddress } from '../../../interactions';
import { deployAirMan } from '../../../interactions/airmanSystem';
import { Button, Form } from 'semantic-ui-react';
import { useState } from 'react';

async function getAdmPanAddr(_network) {
  const x = await getAdmPanAddress(_network)

  return x
}

async function isApprovedAllowance(_accounts, _contractInputValue, _amountInputValue, _setApproved, _network) {
  if (await checkAllowance(_accounts, _contractInputValue, getAdmPanAddr(_network)) >= Number(_amountInputValue)) {
    _setApproved(true);
  } else {
    _setApproved(false);
  }
}

async function checkIfHasEnoughTokens(_accounts, _contractInputValue, _amountInputValue, _setEnoughTokens) {
  if (await checkBalance(_accounts, _contractInputValue) < Number(_amountInputValue)) {
    _setEnoughTokens(false);
  } else {
    _setEnoughTokens(true);
  }
}

async function getSymbol(_tokenContractAddress) {
  const x = await getTokenSymbol(_tokenContractAddress);

  return x;
}

export const DeployButton = ({
  network,
  setOpen, 
  isApproved, 
  setApproved, 
  contractInputValue, 
  accounts, 
  isValidContract, 
  amount, 
  amountInputValue,
  hasEnoughTokens,
  setHasEnoughTokens,
  isValidAmount,
  setCheckedInstances
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLetsDoItClick = () => {
    setIsLoading(true);
    try {
      console.log('lanzamiento');
      deployAirMan(contractInputValue, amountInputValue, setIsLoading, setOpen, network)
      .then(() => {
        new Promise(r => setTimeout(r, 2500))
        .then(()=> setCheckedInstances(false))
      })
    } catch (error) {
      console.log('Falla al hacer el deploy de AirMan ', error);
    }
  }

  const handleApproveClick = async () => {
    setIsLoading(true);
    approveTokens(accounts, contractInputValue, getAdmPanAddr(network), Number(amountInputValue), setIsLoading);
  }

  if (contractInputValue.length === 42 && isValidContract && isValidAmount) {
    if (typeof accounts === 'string') {
      isApprovedAllowance(accounts, contractInputValue, amountInputValue, setApproved, network);
      checkIfHasEnoughTokens(accounts, contractInputValue, amountInputValue, setHasEnoughTokens);
    }
  }

  const diabledButton = (
    <Button
      content="Verify the information given"
      disabled
    />
  )

  if (isValidContract && amountInputValue !== '') {
    if (Number(amountInputValue) === 0 || !hasEnoughTokens) {
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
    } else if (isApproved && network !== '') {
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
    getSymbol(contractInputValue)
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