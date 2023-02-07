import { checkAllowance, checkTokenSymbol } from '../../interactions/erc20';
import { Button, Form } from 'semantic-ui-react'

import adminPanelAbi from '../../assets/abis/AdminPanel.json'

export const DeployButton = ({ isApproved, contractInputValue, accounts, isValidContract, amount, amountInputValue, isValidAmount }) => {
  
  const handleClick = () => {
    checkAllowance(accounts, contractInputValue)
  }
  
  const handleApproveClick = () => {
    checkAllowance(accounts, contractInputValue)
  }

  const diabledButton = (
  <Button
    content="Need more information"
    onClick={() => {
      handleClick();
    }}
    disabled
  />
)
  
  if ((isValidContract && amount !== '')) {
    if (isApproved) {
      return (
        <Button
          content="Let's do it!"
          onClick={() => {
            handleClick();
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
    } else if (!isValidAmount && amountInputValue === '') {
      return (
        diabledButton
      )
    }
  } else if (isValidContract && amount === '') {
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


  if (contractInputValue.length === 42)
  {
    checkTokenSymbol(contractInputValue)
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