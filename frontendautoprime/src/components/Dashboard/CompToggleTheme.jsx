import React from 'react'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import { Button } from 'antd'

const CompToggleTheme = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle_theme">
      <Button onClick={toggleTheme}>
        {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </div>
  )
}

export default CompToggleTheme
