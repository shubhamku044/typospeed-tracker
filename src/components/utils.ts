import { words } from './data';

export const generateSentence = () => {
  const sentenceArr: string[] = [];
  const sentenceArrObj: Record<string, Array<boolean>>[] = [];
  for (let i = 0; i <= 100; i++) {
    const randNo: number = Math.floor(Math.random() * words.length);
    const word: string = words[randNo];
    if (sentenceArr[sentenceArr.length - 1] !== word) {
      sentenceArr.push(word);
      sentenceArrObj.push({ [word]: new Array(word.length).fill(false) });
    }
  }
  return sentenceArr;
};
