import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [numberToGuess, setNumberToGuess] = useState(generateNumber(1, 10));
  const [userGuess, setUserGuess] = useState('');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'

  function generateNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    if (gameState === 'playing') {
      setNumberToGuess(generateNumber(1, level * 10));
    }
  }, [level, gameState]);

  const checkGuess = () => {
    if (parseInt(userGuess) === numberToGuess) {
      if (level % 3 === 0) setLives(lives - 1);
      setGameState('won');
    } else {
      setLives(lives - 1);
      if (lives <= 1) setGameState('lost');
    }
  };

  const nextLevel = () => {
    setLevel(level + 1);
    setGameState('playing');
  };

  const restartGame = () => {
    setLevel(1);
    setLives(5 - Math.floor((level - 1) / 3));
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Header />
      <GameCard 
        level={level} 
        lives={lives} 
        gameState={gameState} 
        userGuess={userGuess}
        setUserGuess={setUserGuess}
        checkGuess={checkGuess}
        nextLevel={nextLevel}
        restartGame={restartGame}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-blue-600 w-full p-4 text-center">
      <h1 className="text-2xl text-white">Guess the Number</h1>
    </div>
  );
}

function GameCard({ level, lives, gameState, userGuess, setUserGuess, checkGuess, nextLevel, restartGame }) {
  return (
    <Card className="w-full max-w-sm mt-4">
      <CardHeader>
        <CardTitle>Level {level}</CardTitle>
        <CardDescription>
          Guess a number between 1 and {level * 10}. Lives: {lives}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <MiniCard />
        </div>
        {gameState === 'playing' && (
          <>
            <Input type="number" value={userGuess} onChange={(e) => setUserGuess(e.target.value)} placeholder="Enter your guess" />
            <Button className="mt-4" onClick={checkGuess}>Guess</Button>
          </>
        )}
        {gameState === 'won' && <Message isWin={true} nextLevel={nextLevel} />}
        {gameState === 'lost' && <Message isWin={false} restartGame={restartGame} />}
      </CardContent>
    </Card>
  );
}

function MiniCard() {
  return (
    <div className="bg-amber-400 text-white p-4 rounded text-2xl">?</div>
  );
}

function Message({ isWin, nextLevel, restartGame }) {
  return (
    <div className="text-center">
      <p>{isWin ? "Correct! You guessed it!" : "Game Over! The number was " + numberToGuess}</p>
      <Button onClick={isWin ? nextLevel : restartGame}>
        {isWin ? "Next Level" : "Play Again"}
      </Button>
    </div>
  );
}

export default App;