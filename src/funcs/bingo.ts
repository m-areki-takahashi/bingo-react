import { BingoAnalyzer } from "./BingoAnalyzer";
import { prepareSheetNumbers } from "./generateSheetNumbes";
import { TGameConfig, TGameStates } from "../components/Bingo";

// useStateのgameConfigを生成する
export const generateGameConfig = (param?: { row: number, max: number }): TGameConfig => ({
    settings: {
        side: param?.row || 5,
        range: param?.max || 15,
    },
    sheetNumbers: prepareSheetNumbers(param?.row || 5, param?.max ||15),
    process: 'playing',
});

// useStateのgameStatesを生成する
export const generateGameStatesInit = (gameConfig: TGameConfig): TGameStates => {
    return {
        allOutputNumber: generateAllOutputNumber(gameConfig),
        now: 0,
        reach: 0,
        bingo: 0
    }
};

// ゲーム進行処理をして、gameStatesを更新
export const updateGameStates = (
    gameStates: TGameStates,
    gameConfig: TGameConfig
): TGameStates  | undefined => {
    const next = gameStates.allOutputNumber.find(({ outputted }) => !outputted)?.output;
    if (!next) return;
    const newAllOutputNumber = gameStates.allOutputNumber
        .map((item) => next === item.output ? { ...item, outputted: true } : item);
    updateHitState(next || 0);
    const newReachBingoCount = new BingoAnalyzer(gameConfig).checkReach_Bingo();
    const ret = {
        allOutputNumber: newAllOutputNumber,
        now: next || gameStates.now,
        reach: newReachBingoCount.reach || gameStates.reach,
        bingo: newReachBingoCount.bingo || gameStates.bingo,
    };
    console.log(ret)
    return ret;
};

// 0 < n <= max か o <= n < maxか選べる乱数生成
export const generateRandom = (max: number, include0: boolean = false): number => (
    include0
    ? max > 3 ? Math.floor(Math.random() * max) : max - 1
    : Math.floor(Math.random() * max) + 1
);

// 出力可能性のある数字をランダムな順序で全て生成する
const generateAllOutputNumber = (gameConfig: TGameConfig) => {
    const { side, range } = gameConfig.settings
    const allOutputCount = side * range;
    const uniqueNumbers = new Set<number>();
    while (uniqueNumbers.size < allOutputCount) {
        uniqueNumbers.add(generateRandom(allOutputCount));
    };
    return Array.from(uniqueNumbers).map((num) => ({
        output: num,
        outputted: false,
    }));
};

// ゲーム終了確認
export const isGameFinished = () => {
    const cells = document.getElementsByClassName('cell');
    return !([...cells].find((cell) => !cell.className.includes('hit')));
};

// 出力数字と一致するシートを削除
const updateHitState = (next: number) => {
    const cells = document.getElementsByClassName('cell');
    for(const cell of cells) {
        cell.textContent === `${next}` && !cell.className.includes('hit')
            && (cell.className += ' hit');
    };
};

// ゲームリスタート時にシートのhit状態をリセット
export const resetHitStateOnBingoSheet = () => (
    [...document.getElementsByClassName('cell')]
        .forEach((cell) => cell.textContent !== 'free' && cell.classList.remove('hit'))
);

// 引数でもらった数字にgameConfig.settingsのside*rangeの桁数に足りてない桁数分先頭に０をつける
const convertNumberToAdd0String = (val: number, setting: { side: number, range: number }) => {
  const { side, range } = setting;
  const maxLength = String(side * range).length;
  const addStr = Array.from({ length: maxLength - String(val).length}).fill('0').join('');
  return addStr + String(val);
};

// <OutBall /> 
export const generateOutBallText = (gameStates: TGameStates, settings: { side: number, range: number }) => (
    `${convertNumberToAdd0String(gameStates.now, settings)}
     [ ${gameStates.allOutputNumber.filter(({outputted}) => outputted).length} / ${gameStates.allOutputNumber.length} ]`
);
