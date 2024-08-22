import { TGameConfig } from "../components/BingoSheet";
import { getTagName } from "./common";

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

    // ビンゴシート同じ型の２次元配列を生成する
    private generateHitSheet = (): HitSheet => (
      Array.from({ length: this._sideLength }, () => (
        Array.from<string>({ length: this._sideLength }).fill('')
      ))
    );

    // 現在のビンゴシートのヒット状態を取得する
    private getHitState =(): HitSheet => {
        const trs: Element[] = Array.from(getTagName("tr"));
        const hitSheet: HitSheet = this.generateHitSheet();
        trs.forEach((tr, i: number) => {
            if(i !== 0){
                const tds: Element[] = Array.from(tr.children);
                tds.forEach((td, n: number) => {
                    if(td.className === "hit") hitSheet[i-1][n] = "h";
                });
            }
        });
        return hitSheet;
    }

    // 行視点でリーチとビンゴ数を算出
    private getReachBingoCount = (arg: CheckHit) => {
        const {hitSheet, counts} = arg;

        const rowHitCounts = hitSheet.map((row) => (
            row.filter((col) => col === 'h').length
        ));
        const reachOrBingo = rowHitCounts.filter((row) => row >= this._sideLength - 1);
        const newCounts: RBcount = [
            counts[0] + reachOrBingo.filter((row) => row === this._sideLength - 1).length,
            counts[1] + reachOrBingo.filter((row) => row === this._sideLength).length,
        ];
        return newCounts;
    }

    //横列のビンゴチェック
    private checkHitRow =(arg: CheckHit) => {
        const {hitSheet,counts} = arg
        return this.getReachBingoCount({hitSheet,counts});
    }

    // ビンゴシートの縦方向チェックのために列視点を行視点で見れるように整形する
    private convertHitSheetForColumn = (hitSheet: HitSheet): HitSheet => {
        const hitSheetForColumn = Array.from({ length: this._sideLength}, (_, r) => (
            Array.from({ length: this._sideLength}, (_, c) => hitSheet[r][c])
        ));
        return hitSheetForColumn;
    }

    //縦列のビンゴチェック
    private checkHitCol =(arg: CheckHit) => {
        const {hitSheet, counts} = arg;
        const hitSheetForColumn = this.convertHitSheetForColumn(hitSheet);

        return this.getReachBingoCount({hitSheet: hitSheetForColumn, counts: counts});
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
            crossHitState.filter((hitState) => hitState.slash).length,
            crossHitState.filter((hitState) => hitState.bSlash).length,
        ];
        const convertToHitCount = [
            crossCount.filter((count) => count === hitSheet.length - 1).length + counts[0],
            crossCount.filter((count) => count === hitSheet.length).length + counts[1],
        ]
        return convertToHitCount;
    }

    // 縦・横・斜めのリーチ数とビンゴ数を算出
    private getAllRBCounts = (arg: CheckHit): RBcount => {
        const { hitSheet, counts } = arg;
        const row: RBcount = this.checkHitRow({hitSheet,counts});
        const col: RBcount = this.checkHitCol({hitSheet,counts: row});
        const x: RBcount = this.checkHitCross({hitSheet,counts: col});
        return x;
    }


    checkReach_Bingo = () => {
        // [reach, bingo]
        const counts: RBcount = [0, 0];

        // ビンゴシートと同配置 && hitしてる箇所には'h'が入った２次元配列
        const hitSheet: HitSheet = this.getHitState();

        //縦横斜めのリーチとビンゴを精査
        const results: RBcount = this.getAllRBCounts({ hitSheet, counts })

        return {reach: results[0], bingo: results[1]}
    }
}