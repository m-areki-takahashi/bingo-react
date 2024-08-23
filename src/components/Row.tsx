import React from 'react';
import { BingoSheetType } from './Bingo';

type TRow = {
  sheetNumbers: BingoSheetType[][],
}

export const Row: React.FC<TRow> = ({ sheetNumbers }) => (
  <>
    {sheetNumbers.map((row, r) => (
      <tr key={r}>
        {row.map((col, c) => (
          <td className={col !== 'free' ? 'cell' : 'cell hit'}  key={c}>{col}</td>
        ))}
      </tr>
    ))}
  </>
);
