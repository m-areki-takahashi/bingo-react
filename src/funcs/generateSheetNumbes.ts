import { BingoSheetType } from '../components/BingoSheet';
import { generateRandom } from './common';


const pickUniqueSheetNumber = (rowCount: number, maxNum: number): BingoSheetType[] => {
  const sheetNum = Array.from({length: rowCount}, (_, i)  => {
    const pickKeys = new Set<number>();
    while(pickKeys.size < rowCount){
      pickKeys.add(generateRandom(maxNum, true));
    }
    return Array.from(pickKeys, (col, c) => !(i === 2 && c === 2) ? i * maxNum + col + 1 : 'free')
  })
  return sheetNum.flat();
}

const sortOutputNumbers = (
  pickOutputNumbers: BingoSheetType[],
  rowCount: number
): BingoSheetType[][] => {
  const sheetNumber: BingoSheetType[][] = Array.from({length: rowCount}, (_, r) => {
    const row: BingoSheetType[] = Array.from({length: rowCount}, (_, c) => {
      const key = (c * rowCount) + r;
      return pickOutputNumbers[key];
    })
    return row;
  })
  return sheetNumber;
}

export const prepareSheetNumbers = (rowCount: number, maxColNum: number): BingoSheetType[][] => {
  // 列数*列の条件幅分の配列を作る
  const pickSheetNumber: BingoSheetType[] = pickUniqueSheetNumber(rowCount, maxColNum);
  const sheetNumbers: BingoSheetType[][] = sortOutputNumbers(pickSheetNumber, rowCount);
  return sheetNumbers;
}
