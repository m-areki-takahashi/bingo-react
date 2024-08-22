import { generateRandom } from "../funcs/common";
import { BingoAnalyzer } from "../funcs/gameManage";
import { prepareSheetNumbers } from "../funcs/generateSheetNumbes";
import { TGameConfig, TGameStates } from "./BingoSheet";

export const generateGameConfig = (param?: { row: number, max: number }): TGameConfig => ({
    settings: {
        side: param?.row || 5,
        range: param?.max || 15,
    },
    sheetNumbers: prepareSheetNumbers(param?.row || 5, param?.max ||15),
    process: 'playing',
});

export const generateGameStatesInit = (gameConfig: TGameConfig): TGameStates => {
    return {
        allOutputNumber: generateAllOutputNumber(gameConfig),
        now: 0,
        reach: 0,
        bingo: 0
    }
};

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

export const isGameFinished = () => {
    const cells = document.getElementsByClassName('cell');
    return !([...cells].find((cell) => !cell.className.includes('hit')));
};

const updateHitState = (next: number) => {
    const cells = document.getElementsByClassName('cell');
    for(const cell of cells) {
        cell.textContent === `${next}` && !cell.className.includes('hit')
            && (cell.className += ' hit');
    };
};

export const resetHitStateOnBingoSheet = () => {
    const cells = document.getElementsByClassName('cell');
    [...cells].forEach((cell) => (
        // cell.className = cell.textContent !== 'free' ? 'cell' : 'cell hit'
        cell.textContent !== 'free' && cell.classList.remove('hit')
    ))
}