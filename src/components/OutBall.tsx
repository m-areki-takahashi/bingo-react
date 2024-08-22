import React from 'react'
import { Button } from './base/Button'
import { Text } from './base/Text'

export const OutBall: React.FC<{
    btnName: string,
    outball: string,
    onclick: () => void
}> = ({ btnName, outball, onclick }) => (
  <div className='outBall'>
    <Text id ='outballNum' text={outball} />
    <Button id='outballBtn' onClick={onclick} name={btnName} />
  </div>
);

