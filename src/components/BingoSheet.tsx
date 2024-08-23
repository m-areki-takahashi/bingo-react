import React, {  useEffect, useState } from 'react'
import { Row } from './Row';
import { Text } from './base/Text';
import { Settings } from './Settings';
import { OutBall } from './OutBall';
import { generateGameConfig, generateGameStatesInit, isGameFinished, resetHitStateOnBingoSheet, updateGameStates } from './default';
import { convertNumberToString } from '../funcs/common';
import './bingo.css'

export type BingoSheetType = (number | 'free');
export type TGameState = {
  now: string,
  reach: number,
  bingo: number,
}
export type TSheetNumber = {
  sheetNumber: BingoSheetType[][],
  allOutputNumber: TAllOutputNumber,
}
export type TAllOutputNumber = {
  outputNum: number;
  isOut: boolean;
}[];

export type TGameConfig = {
  settings: {
    side: number,
    range: number,
  },
  sheetNumbers: (number | 'free')[][],
  process: 'init' | 'playing',
};

export type TGameStates = {
  allOutputNumber: {
    output: number,
    outputted: boolean
  }[],
  now: number,
  reach: number,
  bingo: number,
};

export const BingoSheet: React.FC<{}> = () => {
  const [gameConfig, setGameConfig] = useState<TGameConfig>(generateGameConfig());
  const [gameStates, setGameStates] = useState<TGameStates>(generateGameStatesInit(gameConfig));

  useEffect(() => {
    setGameStates(generateGameStatesInit(gameConfig));
    resetHitStateOnBingoSheet();
  }, [gameConfig])

  const handleGameProgress = () => {
    if (!isGameFinished()){
      const newGameStates = updateGameStates(gameStates, gameConfig)
      newGameStates && setGameStates(newGameStates);
    }
    // eslint-disable-next-line no-restricted-globals
    const retry = isGameFinished() && (confirm('game clear! play one more?'))
    retry && setGameConfig(generateGameConfig({
      row: gameConfig.settings.side,
      max: gameConfig.settings.range,
    }));
  };

  const handleUpdateGameConfig = () => {
    const row = document.getElementById('rows') as HTMLInputElement | null;
    const max = document.getElementById('max') as HTMLInputElement | null;

    const settingsVal = row && max ? { row: Number(row.value), max: Number(max.value) } : null;
    if (!settingsVal) return;

    if (settingsVal.row > settingsVal.max) {
      console.log('max must be more than row');
      return;
    }

    if (settingsVal.row < 3 || settingsVal.max < 3) {
      console.log('row & max more than 3');
      return;
    }

    if (settingsVal.row > 50 || settingsVal.max > 50) {
      console.log('should row & max less than 51');
      return;
    }

    setGameConfig(generateGameConfig(settingsVal));
  }

  return (
    <div>
      <div onClick={()=> setGameConfig({
        ...gameConfig,
        process: gameConfig.process === 'init' ? 'playing' : 'init',
      })}>
        changeProcess! now：{gameConfig.process}
      </div>
      {
        gameConfig.sheetNumbers && (
          <>
            <Settings
              onclick={handleUpdateGameConfig}
            />
            <OutBall
              btnName='Next'
              outball={
                `${convertNumberToString(gameStates.now, gameConfig.settings)}
                [ ${gameStates.allOutputNumber.filter(({outputted}) => outputted).length} / ${gameStates.allOutputNumber.length} ]`
              }
              onclick={handleGameProgress}
            />
            <div className="bingo-sheet">
              <table>
                <tbody>
                  {
                    Array.from<string>({length: gameConfig.settings.side})
                      .map((val, i) => (<th key={i}>{i  + 1}</th>))
                  }
                  <Row
                   sheetNumbers={gameConfig.sheetNumbers}
                  />
                </tbody>
              </table>
            </div>
            <Text
              id='reachBingo'
              text={`reach:${gameStates.reach} bingo:${gameStates.bingo}`}
            />
          </>
        )
      }
    </div>
  );
}
