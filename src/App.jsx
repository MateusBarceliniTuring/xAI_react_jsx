import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  const [numberToGuess, setNumberToGuess] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    const newNumber = Math.floor(Math.random() * (level * 10)) + 1;
    setNumberToGuess(newNumber);
  }, [level]);

  const handleGuess = () => {
    if (parseInt(userGuess) === numberToGuess) {
      if (level % 3 === 0) {
        setLives(prev => Math.max(1, prev - 1));
      }
      setLevel(prev => prev + 1);
      setGameStatus('won');
    } else {
      setLives(prev => prev - 1);
      if (lives - 1 === 0) {
        setGameStatus('lost');
      }
    }
  };

  const resetGame = () => {
    setLevel(1);
    setLives(5);
    setGameStatus('playing');
    setUserGuess('');
  };

  const getLevelDescription = () => {
    return `Guess a number between 1 and ${level * 10}. You have ${lives} ${lives > 1 ? 'lives' : 'life'} left.`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="text-center p-4 bg-blue-600 w-full text-white">
        <h1 className="text-3xl font-bold">Guess The Number</h1>
      </div>
      <Card className="sm:w-96 w-full m-4">
        <CardHeader>
          <CardTitle>Level {level}</CardTitle>
          <CardDescription>{getLevelDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="bg-amber-200 p-4 rounded-lg">
            <span className="text-3xl">?</span>
          </div>
        </CardContent>
        {gameStatus === 'playing' && (
          <CardFooter>
            <Input 
              type="number" 
              value={userGuess} 
              onChange={(e) => setUserGuess(e.target.value)} 
              placeholder="Enter your guess"
            />
            <Button onClick={handleGuess} className="mt-2">Check</Button>
          </CardFooter>
        )}
        {gameStatus !== 'playing' && (
          <CardFooter>
            {gameStatus === 'won' ? 
              <p className="text-green-600">Correct! Moving to next level.</p> :
              <p className="text-red-600">Game Over! The number was {numberToGuess}.</p>
            }
            <Button onClick={resetGame}>{(gameStatus === 'lost') ? 'Play Again' : 'Next Level'}</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default App;