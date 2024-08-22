export const generateRandom = (max: number, include0: boolean = false): number => (
    include0
    ? max > 3 ? Math.floor(Math.random() * max) : max - 1
    : Math.floor(Math.random() * max) + 1
);


//乱数生成用の最大値を返す
export const getMaxNum = (key: number ,gMax: number) => {
    return (key + 1) * gMax +1
}

//数字の長さを返す
export const CheckNumberDigits = (num: number): number => num.toString().length;

//一桁の数字の先頭に0を付ける
export const addZero = (target: number | string): string => {
    const strTarget = typeof target === 'number' ? String(target) : target;
    return CheckNumberDigits(parseInt(strTarget)) < 2 ? "0" + strTarget : strTarget;
}

//指定個所に半角空白を付ける
export const addSpace = (target: string, type: number): string => {
    const escape = "&ensp;";
    if(type === 1){
        return escape + target;
    }else if(type === 2){
        return target + escape;
    }else{
        return escape + target + escape;
    };
}

//ビンゴシートに出力する数字の型形成
export const adjustValLength = (target: string): string => {
    const strTarget = target.toString();
    const len = strTarget.length;

    if(len === 1){
        return addSpace(addZero(strTarget),3);
    }else if(len === 2){
        return addSpace(strTarget,3);
    }else{
        return strTarget;
    }
}

//document.getElementById()の省略
export const getId = (idName: string) => {
    return document.getElementById(idName);
}

//document.getElementsByTagName()の省略
export const getTagName = (tagName: string) => {
    return document.getElementsByTagName(tagName);
}

//ビンゴシートが全て終わっているか確認する
export const checkAllBingo =()=> {
    const flg: string[] = [];
    const trs: Element[] = Array.from(getTagName("tr"));
    trs.forEach((tr:Element ,i: number) => {
        if(i !== 0){
            const tds: Element[] = Array.from(tr.children);
            if(tds.some((td) => td.className !== "hit")) flg.push("f");
        };
    });
    return (flg.length === 0);
}

export const convertNumberToString = (val: number, setting: { side: number, range: number }) => {
  const { side, range } = setting;
  const maxLength = String(side * range).length;
  const addStr = Array.from({ length: maxLength - String(val).length}).fill('0').join('');
  return addStr + String(val);
};
