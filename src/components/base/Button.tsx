import React from 'react'

export const Button = (btnProps: {
  name: string,
  id: string,
  onClick: () => void,
}) => {
  const { name, id, onClick } = btnProps;
  return (
    <div className='button-area'>
      <button id={id} onClick={onClick}>{name}</button>
    </div>
  )
}


