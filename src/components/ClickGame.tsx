'use client';

import { useState, useEffect, useCallback } from 'react';

const ClickGame = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Calculate target size based on score
  const getTargetSize = useCallback((score: number) => {
    const baseSize = 100; // Start at 100px
    const reduction = Math.floor(score / 20) * 10; // Reduce by 10px every 20 points
    return Math.max(20, baseSize - reduction); // Minimum size of 40px
  }, []);

  // Function to generate random position
  const getRandomPosition = useCallback((size: number) => {
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    };
  }, []);

  // Start game function
  const startGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setTimeLeft(3);
    setGameStarted(true);
    setPosition(getRandomPosition(100)); // Initial size is 100px
  }, [getRandomPosition]);

  // Reset game function
  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setTimeLeft(3);
    setGameStarted(false);
    setPosition(getRandomPosition(100));
  }, [getRandomPosition]);

  // Handle icon click
  const handleClick = useCallback(() => {
    if (!gameOver && gameStarted) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        return newScore;
      });
      const newSize = getTargetSize(score + 1);
      setPosition(getRandomPosition(newSize));
      setTimeLeft(3);
    }
  }, [gameOver, gameStarted, getRandomPosition, highScore, score, getTargetSize]);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, gameStarted]);

  const targetSize = getTargetSize(score);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-zinc-900 to-slate-800">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-lg p-12 rounded-2xl text-center shadow-2xl transform transition-all border border-white/10">
            <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              I SEE YOU
            </h1>
            <p className="text-lg mb-8 text-zinc-400 leading-relaxed max-w-md">
              Test your speed and precision. Target shrinks every 20 points!<br />
              Click within 3 seconds to score.
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-lg text-lg font-medium hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              CATCH ME
            </button>
          </div>
        </div>
      )}

      {gameStarted && (
        <>
          {/* Score Display */}
          <div className="absolute top-6 left-6 flex gap-6">
            <div className="bg-black/50 backdrop-blur px-6 py-3 rounded-lg border border-white/10">
              <div className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Score</div>
              <div className="text-2xl font-bold text-white">{score}</div>
            </div>
            <div className="bg-black/50 backdrop-blur px-6 py-3 rounded-lg border border-white/10">
              <div className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Best</div>
              <div className="text-2xl font-bold text-white">{highScore}</div>
            </div>
          </div>

          {/* Timer Display */}
          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur px-6 py-3 rounded-lg border border-white/10">
            <div className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Time</div>
            <div className="text-2xl font-bold text-white">{timeLeft}s</div>
          </div>

          {/* Clickable Target */}
          <div
            className="absolute cursor-pointer transition-all duration-100"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${targetSize}px`,
              height: `${targetSize}px`,
            }}
            onClick={handleClick}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center transform transition-transform hover:scale-105 relative">
              {/* Outer ring animation */}
              <div className="absolute w-full h-full rounded-full bg-cyan-500/30 animate-ping" />
              
              {/* Main target */}
              <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                {/* Inner rings */}
                <div className="w-3/4 h-3/4 rounded-full border-2 border-white/50 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 rounded-full border-2 border-white/50 flex items-center justify-center">
                    <div className="w-1/4 h-1/4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-black/50 backdrop-blur-lg p-12 rounded-2xl text-center shadow-2xl border border-white/10">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Game Over
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl text-white">
                Final Score: {score}
              </p>
              {score === highScore && score > 0 && (
                <p className="text-cyan-400 text-lg">New High Score!</p>
              )}
              <p className="text-zinc-400">
                {score >= 15 ? 'Impressive reflexes!' : score >= 10 ? 'Getting better!' : 'Keep practicing!'}
              </p>
            </div>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClickGame;