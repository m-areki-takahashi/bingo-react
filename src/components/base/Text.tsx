import React from 'react'

export const Text: React.FC<{
  id: string,
  text: string
}> = ({
  id,
  text,
}) => {
  return (
    <div id={id} className='text'>
      <span>{text}</span>
    </div>
  );
};
