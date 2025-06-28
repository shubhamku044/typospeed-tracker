'use client';

import { generateSentence } from '@/components/utils';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Settings, User, Crown, Info, Zap } from 'lucide-react';

interface CharacterData {
  char: string;
  status: 'correct' | 'incorrect' | 'untyped';
}

interface TestStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  correctChars: number;
  incorrectChars: number;
}

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [testDuration] = useState(60); // 60 seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState<TestStats>({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    correctChars: 0,
    incorrectChars: 0,
  });
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const initializeTest = useCallback(() => {
    const newWords = generateSentence().slice(0, 50); // More words for better text flow
    const text = newWords.join(' ');
    const chars: CharacterData[] = text.split('').map(char => ({
      char,
      status: 'untyped'
    }));

    setWords(newWords);
    setCharacters(chars);
    setCurrentIndex(0);
    setUserInput('');
    setIsActive(false);
    setStartTime(null);
    setTimeLeft(testDuration);
    setIsCompleted(false);
    setShowResults(false);
    setStats({
      wpm: 0,
      accuracy: 100,
      timeElapsed: 0,
      correctChars: 0,
      incorrectChars: 0,
    });
  }, [testDuration]);

  const updateCursorPosition = useCallback(() => {
    if (!textContainerRef.current || !cursorRef.current) return;

    const chars = textContainerRef.current.querySelectorAll('.char');
    if (chars[currentIndex]) {
      const targetChar = chars[currentIndex] as HTMLElement;
      const container = textContainerRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const charRect = targetChar.getBoundingClientRect();
      
      const relativeLeft = charRect.left - containerRect.left;
      const relativeTop = charRect.top - containerRect.top;

      cursorRef.current.style.left = `${relativeLeft}px`;
      cursorRef.current.style.top = `${relativeTop}px`;
      cursorRef.current.style.height = `${charRect.height}px`;
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateCursorPosition();
    }, 50); // Small delay to ensure DOM is updated
    return () => clearTimeout(timer);
  }, [updateCursorPosition, characters, currentIndex]);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsCompleted(true);
            setIsActive(false);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isCompleted]);

  useEffect(() => {
    if (isActive && startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      const correctChars = characters.filter(char => char.status === 'correct').length;
      const incorrectChars = characters.filter(char => char.status === 'incorrect').length;
      const totalChars = correctChars + incorrectChars;
      
      const wpm = elapsed > 0 ? Math.round((correctChars / 5) / (elapsed / 60)) : 0;
      const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

      setStats({
        wpm,
        accuracy,
        timeElapsed: elapsed,
        correctChars,
        incorrectChars,
      });
    }
  }, [characters, isActive, startTime]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (e.key === 'Backspace') {
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        setCharacters(prev => {
          const newChars = [...prev];
          newChars[newIndex] = { ...newChars[newIndex], status: 'untyped' };
          return newChars;
        });
      }
      return;
    }

    if (e.key.length === 1 && currentIndex < characters.length) {
      const typedChar = e.key;
      const expectedChar = characters[currentIndex].char;
      const isCorrect = typedChar === expectedChar;

      setCharacters(prev => {
        const newChars = [...prev];
        newChars[currentIndex] = {
          ...newChars[currentIndex],
          status: isCorrect ? 'correct' : 'incorrect'
        };
        return newChars;
      });

      setCurrentIndex(prev => prev + 1);

      if (currentIndex === characters.length - 1) {
        setIsCompleted(true);
        setIsActive(false);
        setShowResults(true);
      }
    }
  };

  const handleRestart = () => {
    initializeTest();
    inputRef.current?.focus();
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Zap className="size-8 text-blue-400" />
            <span className="font-bold text-2xl text-blue-400">TypoRace</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Settings className="size-5 cursor-pointer text-slate-500 hover:text-slate-300" />
          <Crown className="size-5 cursor-pointer text-slate-500 hover:text-slate-300" />
          <Info className="size-5 cursor-pointer text-slate-500 hover:text-slate-300" />
          <User className="size-5 cursor-pointer text-slate-500 hover:text-slate-300" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center px-8">
        
        {/* Test Options */}
        {!isActive && !showResults && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate-500">@</span>
                <span className="text-slate-500">punctuation</span>
                <span className="text-slate-500">#</span>
                <span className="text-slate-500">numbers</span>
                <span className="rounded bg-blue-500 px-3 py-1.5 text-sm font-medium text-white">time</span>
                <span className="text-slate-500">words</span>
                <span className="text-slate-500">quote</span>
                <span className="text-slate-500">zen</span>
                <span className="text-slate-500">custom</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6">
              <span className="text-slate-500">15</span>
              <span className="text-slate-500">30</span>
              <span className="rounded bg-blue-500 px-4 py-2 font-medium text-white">60</span>
              <span className="text-slate-500">120</span>
            </div>
          </motion.div>
        )}

        {/* Stats Display (during test) */}
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center"
          >
            <div className="mb-3 text-lg text-slate-400">{timeLeft}s</div>
            <div className="flex gap-8 text-lg">
              <span className="text-blue-400 font-semibold">{stats.wpm} WPM</span>
              <span className="text-emerald-400 font-semibold">{stats.accuracy}%</span>
            </div>
          </motion.div>
        )}

        {/* Typing Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-5xl"
        >
          <div
            ref={textContainerRef}
            onClick={focusInput}
            className="relative cursor-text select-none rounded-xl bg-slate-800/50 p-8 font-mono text-3xl leading-relaxed"
            style={{ 
              lineHeight: '1.8',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {/* Animated Cursor */}
            <motion.div
              ref={cursorRef}
              className="absolute z-10 w-1 bg-blue-400 transition-all duration-150 ease-out"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isActive || currentIndex > 0 ? [1, 0, 1] : 0,
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1,
                ease: 'easeInOut'
              }}
            />

            {/* Text Characters */}
            <div className="relative z-0">
              {characters.map((charData, index) => (
                <span
                  key={index}
                  className={`char transition-colors duration-150 ${
                    charData.status === 'correct' 
                      ? 'text-slate-200' 
                      : charData.status === 'incorrect'
                        ? 'rounded bg-red-500/20 text-red-400'
                        : index < currentIndex
                          ? 'text-red-400'
                          : 'text-slate-600'
                  }`}
                >
                  {charData.char === ' ' ? '\u00A0' : charData.char}
                </span>
              ))}
            </div>

            {/* Focus Overlay */}
            {!isActive && currentIndex === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/90"
              >
                <div className="text-center">
                  <Zap className="mx-auto mb-6 size-16 text-blue-400 opacity-60" />
                  <p className="mb-3 text-xl text-slate-300">Click here or start typing to begin</p>
                  <p className="text-lg text-slate-500">Press Tab to restart at any time</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Hidden Input */}
          <input
            ref={inputRef}
            value={userInput}
            onChange={() => {}}
            onKeyDown={handleKeyPress}
            className="pointer-events-none absolute opacity-0"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </motion.div>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <button
            onClick={handleRestart}
            className="flex items-center gap-3 px-6 py-3 text-slate-400 transition-colors hover:text-blue-400"
          >
            <RotateCcw className="size-5" />
            <span className="text-lg">restart test</span>
          </button>
        </motion.div>

        {/* Results Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="mx-4 w-full max-w-lg rounded-xl bg-slate-800 p-10"
              >
                <h2 className="mb-8 text-center text-3xl font-bold text-blue-400">
                  Test Complete!
                </h2>
                
                <div className="mb-8 grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400">{stats.wpm}</div>
                    <div className="text-lg text-slate-400">WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400">{stats.accuracy}%</div>
                    <div className="text-lg text-slate-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400">{stats.correctChars}</div>
                    <div className="text-lg text-slate-400">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-400">{stats.incorrectChars}</div>
                    <div className="text-lg text-slate-400">Incorrect</div>
                  </div>
                </div>
                
                <button
                  onClick={handleRestart}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-500 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-400"
                >
                  <RotateCcw className="size-5" />
                  Try Again
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="rounded bg-slate-800 px-3 py-2">tab</span>
            <span>+</span>
            <span className="rounded bg-slate-800 px-3 py-2">enter</span>
            <span>- restart test</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
