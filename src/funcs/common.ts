// 0 < n <= max か o <= n < maxか選べる乱数生成
export const generateRandom = (max: number, include0: boolean = false): number => (
    include0
    ? max > 3 ? Math.floor(Math.random() * max) : max - 1
    : Math.floor(Math.random() * max) + 1
);

// 引数でもらった数字にgameConfig.settingsのside*rangeの桁数に足りてない桁数分先頭に０をつける
export const convertNumberToString = (val: number, setting: { side: number, range: number }) => {
  const { side, range } = setting;
  const maxLength = String(side * range).length;
  const addStr = Array.from({ length: maxLength - String(val).length}).fill('0').join('');
  return addStr + String(val);
};
