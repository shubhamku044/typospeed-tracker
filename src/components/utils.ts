import { words } from './data';

export const generateSentence = () => {
  const sentenceArr: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const randNo: number = Math.floor(Math.random() * words.length);
    const word: string = words[randNo];
    if (sentenceArr[sentenceArr.length - 1] !== word) sentenceArr.push(word);
  }
  return sentenceArr;
};
