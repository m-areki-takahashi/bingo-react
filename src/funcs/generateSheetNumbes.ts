import { BingoSheetType } from '../components/Bingo';
import { generateRandom } from './common';


// シート用数字を生成
const pickUniqueSheetNumber = (rowCount: number, maxNum: number): BingoSheetType[] => {
  const pickKeys = new Set<number>();
  while(pickKeys.size < rowCount){
    pickKeys.add(generateRandom(maxNum, true));
  }
  const median = Math.floor(rowCount / 2);

  const sheetNum = Array.from({length: rowCount}, (_, i)  => (
    rowCount % 2 !== 0
      ? Array.from(pickKeys, (col, c) => !(i === median && c === median) ? i * maxNum + col + 1 : 'free')
      : Array.from(pickKeys, (col, c) => i * maxNum + col + 1)
  ))
  return sheetNum.flat();
}

// １次元で管理してるシート用数字を２次元に並び替え
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

// BingoSheet用数字配列の生成管理
export const prepareSheetNumbers = (rowCount: number, maxColNum: number): BingoSheetType[][] => {
  // 列数*列の条件幅分の配列を作る
  const pickSheetNumber: BingoSheetType[] = pickUniqueSheetNumber(rowCount, maxColNum);
  const sheetNumbers: BingoSheetType[][] = sortOutputNumbers(pickSheetNumber, rowCount);
  return sheetNumbers;
}
