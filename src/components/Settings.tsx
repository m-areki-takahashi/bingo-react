import React from 'react'
import { Button } from './base/Button';

export const Settings: React.FC<{
  onclick: () => void,
}> = ({ onclick }) => {
  return (
    <div className='settings'>
      <label htmlFor='rows'>row</label>
      <input
        type='number'
        name='rows'
        id='rows'
        placeholder='列の数'
      />
      <label htmlFor='max'>max</label>
      <input
        type='number'
        name='max'
        id='max'
        placeholder='列の出力幅'
      />
      <Button name='set' id='settingBtn' onClick={onclick} />
    </div>
  )
}
