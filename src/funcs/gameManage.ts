import { TGameConfig } from "../components/Bingo";

type HitSheet = string[][];
type RBcount = number[];
type CheckHit = {
  hitSheet: HitSheet,
  counts: RBcount
}

export class BingoAnalyzer {

    // 正方形２次元配列の横幅
    private _gameConfig: TGameConfig;
    private _sideLength: number;

    constructor(gameConfig: TGameConfig) {
        this._gameConfig = gameConfig;
        this._sideLength = this._gameConfig.settings.side;
    }

    // 現在のビンゴシートのヒット状態を取得する
    private getHitState =(): HitSheet => [...document.getElementsByTagName('tr')].slice(1)
        .map((row) => [...row.children].map((col) => col.classList.contains('hit') ? 'h' : ''))

    // 行視点でリーチとビンゴ数を算出
    private getReachBingoCount = (arg: CheckHit) => {
        const {hitSheet, counts} = arg;

        const rowHitCounts = hitSheet
            .map((row) => row.filter((col) => col === 'h').length);
        const reachOrBingo = rowHitCounts.filter((row) => row >= this._sideLength - 1);
        const newCounts: RBcount = [
            counts[0] + reachOrBingo.filter((row) => row === this._sideLength - 1).length,
            counts[1] + reachOrBingo.filter((row) => row === this._sideLength).length,
        ];
        return newCounts;
    }

    //横列のビンゴチェック
    private checkHitRow =(arg: CheckHit) => this.getReachBingoCount(arg)

    // ビンゴシートの縦方向チェックのために列視点を行視点で見れるように整形する
    private convertHitSheetForColumn = (hitSheet: HitSheet): HitSheet => (
        Array.from({ length: this._sideLength}, (_, r) => (
            Array.from({ length: this._sideLength}, (_, c) => hitSheet[c][r])
        ))
    );

    //縦列のビンゴチェック
    private checkHitCol =(arg: CheckHit) => {
        const {hitSheet} = arg;
        const hitSheetForColumn = this.convertHitSheetForColumn(hitSheet);
        console.log(hitSheetForColumn)

        return this.getReachBingoCount({ ...arg, hitSheet: hitSheetForColumn });
    }

    //ななめのビンゴチェック
    private checkHitCross = (state: CheckHit): RBcount => {
        const { hitSheet, counts } = state
        const crossHitState = hitSheet.map((row, r) => ({
                slash: row[r],
                bSlash: row.slice().reverse()[r],
            })
        )
        const crossCount = [
            crossHitState.filter((hitState) => hitState.slash === 'h').length,
            crossHitState.filter((hitState) => hitState.bSlash === 'h').length,
        ];
        const convertToHitCount = [
            crossCount.filter((count) => count === hitSheet.length - 1).length + counts[0],
            crossCount.filter((count) => count === hitSheet.length).length + counts[1],
        ]
        return convertToHitCount;
    }

    // 縦・横・斜めのリーチ数とビンゴ数を算出
    private getAllRBCounts = (arg: CheckHit): RBcount => {
        const row: RBcount = this.checkHitRow(arg);
        const col: RBcount = this.checkHitCol({...arg, counts: row});
        const x: RBcount = this.checkHitCross({...arg, counts: col});
        console.log(row)
        console.log(col)
        console.log(x)
        return x;
    }


    checkReach_Bingo = () => {
        // [reach, bingo]
        const counts: RBcount = [0, 0];

        // ビンゴシートと同配置 && hitしてる箇所には'h'が入った２次元配列
        const hitSheet: HitSheet = this.getHitState();
        console.log(hitSheet)

        //縦横斜めのリーチとビンゴを精査
        const results: RBcount = this.getAllRBCounts({ hitSheet, counts })

        return {reach: results[0], bingo: results[1]}
    }
}