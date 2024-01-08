'use client';
import { generateSentence } from '@/components/utils';
import { useEffect, useState } from 'react';

enum LetterStatus {
  CURRENT,
  UNREACHED,
  CORRECT,
  WRONG,
};

export default function Home() {
  const [sentence, setSentence] = useState<Array<string>>([]);
  const [currWordIndex, setCurrWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [wordStatus, setWordStatus] = useState<Array<Array<LetterStatus>>>([]);
  const [sentenceStatus, setSentenceStatus] = useState<Array<string>>([]);

  const generateInitialWordStatus = (sentenceArr: string[]) => sentenceArr.map(() => []);

  useEffect(() => {
    const newSentence = generateSentence();
    setSentence(newSentence);
    setWordStatus(generateInitialWordStatus(newSentence));
  }, []);

  useEffect(() => {
    // console.log(currWordIndex, userInput, wordStatus);
  }, [currWordIndex, userInput, wordStatus]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === ' ') return;
    const input = event.target.value;
    setUserInput(input);

    const newWordStatus = sentence[currWordIndex]?.split('').map((letter, i) => {
      if (i === input.length) {
        return LetterStatus.CURRENT;
      } else {
        return i < input.length
          ? letter === input[i]
            ? LetterStatus.CORRECT
            : LetterStatus.WRONG
          : LetterStatus.UNREACHED;
      }
    });
    console.log(newWordStatus);

    setWordStatus((prev) => [...prev.slice(0, currWordIndex), newWordStatus, ...prev.slice(currWordIndex + 1)]);
  };
  const handleSpacePress = () => {
    // Move to the next word
    setCurrWordIndex((prev) => Math.min(prev + 1, sentence.length - 1));
    setUserInput('');

    // Update the word status
    setWordStatus((prev) => {
      const updatedWordStatus = prev.map((statusArray, index) => {
        if (index === currWordIndex) {
          // If the word is correct, mark all letters as correct
          return statusArray.map(
            (status) => (status === LetterStatus.CURRENT ? LetterStatus.UNREACHED : status)
          );
        } else {
          return statusArray;
        }
      });

      return updatedWordStatus;
    });
  };

  const getWordStyle = (letterStatus: LetterStatus): string => {
    switch (letterStatus) {
      case LetterStatus.CURRENT:
        return 'bg-gray-800 text-white';
      case LetterStatus.CORRECT:
        return 'text-green-300';
      case LetterStatus.WRONG:
        return 'text-red-500';
      case LetterStatus.UNREACHED:
        return 'text-gray-700';
      default:
        return '';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex min-h-[12rem] w-[52rem] flex-wrap gap-2 rounded-lg border-2 border-white p-12 text-2xl tracking-wider text-gray-700">
        {sentence?.map((word: string, idx: number) => {
          return (
            <div key={idx}>
              {word.split('').map((l, idx2) => {
                return (
                  <span
                    key={`${idx}.${idx2}`}
                    className={getWordStyle(wordStatus[idx][idx2])}
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
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === ' ') {
            handleSpacePress();
          }
        }}
      />
      <button
        className="mt-14 rounded-lg bg-blue-600 px-4 py-2 font-semibold"
        onClick={() => {
          const newSentence = generateSentence();
          setSentence(newSentence);
          setCurrWordIndex(0);
          setUserInput('');
          setSentenceStatus([]);
          setWordStatus(generateInitialWordStatus(newSentence));
        }}
      >
        Generate
      </button>
    </main>
  );
}
