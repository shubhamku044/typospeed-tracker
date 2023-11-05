'use client';
import { generateSentence } from '@/components/utils';
import { useEffect, useState } from 'react';

enum LetterStatus {
  CURRENT,
  UNREACHED,
  CORRECT,
  WRONG,
};

type TCurrWord = [number, number];

export default function Home() {
  const [sentence, setSentence] = useState<Array<string>>();
  const [typed, setTyped] = useState<Array<string>>();
  const [currWord, setCurrWord] = useState<TCurrWord>([0, 0]);
  const [sentenceStatus, setSentenceStatus] = useState<Array<Array<[number, number, LetterStatus]>>>([]);
  const [currStatus, setCurrStatus] = useState<[number, number, LetterStatus]>([0, 0, LetterStatus.CURRENT]);

  useEffect(() => {
    const ourSentence = generateSentence();
    setSentence(generateSentence);
    setSentenceStatus(new Array(ourSentence.length).fill([]));
  }, []);

  /* const getWordStyle = () => {
    switch (currWord[2]) {
      case LetterStatus.CURRENT:
        return '';
      case LetterStatus.CORRECT:
        return '';
      case LetterStatus.WRONG:
        return 'text-red-500';
      case LetterStatus.UNREACHED:
        return '';
    }
  }; */

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex min-h-[12rem] w-[52rem] flex-wrap gap-2 rounded-lg border-2 border-white p-12 text-2xl tracking-wider">
        {sentence?.map((word, idx) => {
          return (
            <div key={idx}>
              {word.split('').map((l, idx2) => {
                return (
                  <span
                    key={`${idx}.${idx2}`}
                    className={`${(idx === currWord[0] && idx2 === currWord[1]) ? 'bg-gray-800 text-white' : 'text-gray-700'}`}
                  >
                    {l}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      <input
        className="text-black"
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
          const writingWord = [currWord[0], currWord[1], LetterStatus.CURRENT];
          if (e.code === 'Space') setCurrWord(prvWord => [prvWord[0] + 1, 0]);
          if (e.key === (sentence as Array<string>)[currWord[0]][currWord[1]]) {
            setCurrWord(prvWord => [prvWord[0], prvWord[1] + 1]);
          }
        }}
      />
      <button
        className="mt-14 rounded-lg bg-blue-600 px-4 py-2 font-semibold"
        onClick={() => {
          setSentence(generateSentence());
        }}
      >
        Generate
      </button>
    </main>
  );
}
