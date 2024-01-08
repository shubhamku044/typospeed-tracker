'use client';
import { generateSentence } from '@/components/utils';
import { useEffect, useState } from 'react';
import { CursorArrowRippleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
  const [isInputFocused, setIsInputFocused] = useState(false);

  const generateInitialWordStatus = (sentenceArr: string[]) => sentenceArr.map(() => []);

  useEffect(() => {
    const newSentence = generateSentence();
    setSentence(newSentence);
    setWordStatus(generateInitialWordStatus(newSentence));

    if (newSentence.length > 0) {
      setWordStatus((prev) => {
        const firstWordStatus = [...(new Array(newSentence[0].length).fill(LetterStatus.UNREACHED))];
        firstWordStatus[0] = LetterStatus.CURRENT;
        return [firstWordStatus, ...prev.slice(1)];
      });
    }
  }, []);

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

    setWordStatus((prev) => [...prev.slice(0, currWordIndex), newWordStatus, ...prev.slice(currWordIndex + 1)]);
  };

  const handleSpacePress = () => {
    // Check correctness of the whole sentence

    // Move to the next word
    setCurrWordIndex((prev) => Math.min(prev + 1, sentence.length - 1));
    setUserInput('');

    // Update the word status
    setWordStatus((prev) => {
      const updatedWordStatus = prev.map((statusArray, index) => {
        if (index === currWordIndex) {
          const indexOfZero = statusArray.indexOf(0);
          if (indexOfZero !== -1) statusArray.fill(LetterStatus.WRONG, indexOfZero);
          return statusArray;
        } else if (index === currWordIndex + 1) {
          const arr = [LetterStatus.CURRENT,
            ...(Array(sentence[currWordIndex + 1].length - 1).fill(LetterStatus.UNREACHED))
          ];
          return arr;
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
        return 'bg-gray-600 text-white';
      case LetterStatus.CORRECT:
        return 'text-white';
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
      <div
        className="relative flex min-h-[12rem] w-full max-w-5xl flex-wrap gap-2 overflow-hidden rounded-lg p-12 text-2xl tracking-wider text-gray-700"
      >
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
        <div
          className={`absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center gap-2 ${isInputFocused ? 'hidden backdrop-blur-0' : 'bg-transparent backdrop-blur-sm'} text-xl text-white`}
        >
          <CursorArrowRippleIcon className="w-6" />
          <p>Click here to start typing</p>
        </div>
        <input
          className="absolute left-0 top-0 z-20 h-full w-full cursor-default border-none bg-transparent text-transparent outline-none"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === ' ') {
              handleSpacePress();
            }
          }}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      </div>
      <button
        className="mt-14 px-4 py-2"
        onClick={() => {
          const newSentence = generateSentence();
          setSentence(newSentence);
          setCurrWordIndex(0);
          setUserInput('');
          setSentenceStatus([]);
          setWordStatus(generateInitialWordStatus(newSentence));
        }}
      >
        <ArrowPathIcon className="w-8 text-gray-200" />
      </button>
    </main >
  );
}
