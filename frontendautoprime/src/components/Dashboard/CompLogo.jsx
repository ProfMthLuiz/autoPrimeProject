import React from 'react'
import { FireFilled } from '@ant-design/icons'

const CompLogo = ({ darkTheme }) => {
  return (
    <section className={darkTheme ? 'logodark' : 'logolight'}>
      <div className={darkTheme ? 'logo_icondark' : 'logo_iconlight'}>
        <FireFilled />
      </div>
    </section>
  )
}

export default CompLogo
