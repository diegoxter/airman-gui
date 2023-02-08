import { checkBalance, checkAllowance, checkTokenSymbol, approveTokens } from '../../interactions/erc20';
import { Button, Form } from 'semantic-ui-react'
import { useState } from 'react';

async function isApprovedAllowance(_accounts, _contractInputValue, _amountInputValue, _setApproved) {
  if (await checkAllowance(_accounts, _contractInputValue) >= Number(_amountInputValue)) {
    _setApproved(true)
  } else {
    _setApproved(false)
  }
}

async function checkIfHasEnoughTokens(_accounts, _contractInputValue, _amountInputValue, _setEnoughTokens) {
  if (await checkBalance(_accounts, _contractInputValue) < Number(_amountInputValue)) {
    _setEnoughTokens(false)
  } else {
    _setEnoughTokens(true)
  }
}

export const DeployButton = ({ 
  isApproved, 
  setApproved, 
  contractInputValue, 
  accounts, 
  isValidContract, 
  amount, 
  amountInputValue,
  hasEnoughTokens,
  setHasEnoughTokens,
  isValidAmount 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleLetsDoItClick = () => {
    console.log('click')
  }
  
  const handleApproveClick = () => {
    try {
      approveTokens(accounts, contractInputValue, amountInputValue, setIsLoading)
    } catch (error) {
      console.log('Falla al aprobar '+ error)
    }
  }

  if (isValidAmount) {
    isApprovedAllowance(accounts, contractInputValue, amountInputValue, setApproved)
    checkIfHasEnoughTokens(accounts, contractInputValue, amountInputValue, setHasEnoughTokens)
  }

  const diabledButton = (
    <Button
      content="Verify the information given"
      disabled
    />
  )

  if (isValidContract && amount !== '') {
    if (Number(amountInputValue) === 0 || !hasEnoughTokens) {
      return (
        <Button
          content="Invalid token amount "
          disabled
        />
      )
    } else if (isLoading) {
      return (
        <Button
          loading 
          primary
          size='medium'>
            PLACEH
        </Button>
      )
    } else if (isApproved) {
      return (
        <Button
          content="Let's do it!"
          onClick={() => {
            handleLetsDoItClick();
          }}
          positive
        />
      )
    } else if (isValidAmount) {
      return (
        <Button
          color='blue'
          content="Approve tokens"
          onClick={() => {
            handleApproveClick();
          }}
        />
      )
    } else if (!isValidAmount) {
      return (
        diabledButton
      )
    }
  } else {
    return (
      diabledButton
    )
  }
}

export const TokenContractInput = ({
  isValidContract, 
  changeIsValidContract,
  contractInputValue,
  contract,
  changeContract
}) => {

  const handleContractChange = ( num ) => {
    changeContract(num)
  }


  if (contractInputValue.length === 42) {
    try { 
      checkTokenSymbol(contractInputValue) 
    } catch (error) {
      console.log(error)
    }
    changeIsValidContract(true)
  } else {
    changeIsValidContract(false)
  }

    return (
        <Form.Input
        label='Token info'       
        placeholder='Address: 0x...'
        value={contract}
        onChange={(e) => handleContractChange(e.target.value)}
      />
    )
  
}