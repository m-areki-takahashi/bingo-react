import React from 'react'

type InputT = {
  fn: () => void,
  text: string,
  id: string,
  type: string
};

export const Input: React.FC<InputT> = (params) => {
  const { text, id, fn, type } = params;
  return (
    <div id={id} className='text'>
      <input
        type={type}
        onChange={fn}
        placeholder={text}
      />
    </div>
  );
};
