import { checkAllowance } from '../../interactions/erc20';
import { Button } from 'semantic-ui-react'

import adminPanelAbi from '../../assets/abis/AdminPanel.json'

export const DeployButton = ({ isApproved, contractInputValue, accounts }) => {
  
    const handleClick = () => {
      checkAllowance(accounts, contractInputValue)
    }
  
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
    } else {
      return (
        <Button
          color='blue'
          content="Approve tokens"
          onClick={() => {
            handleClick();
          }}
        />
      )
    }
  }