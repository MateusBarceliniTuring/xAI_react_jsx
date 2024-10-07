import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [numberToGuess, setNumberToGuess] = useState(generateRandomNumber(1));
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (lives === 0) {
      setIsGameOver(true);
    }
  }, [lives]);

  function generateRandomNumber(level) {
    const number = Math.floor(Math.random() * (level * 10)) + 1;
    console.log('number', number);
    return number;
  }

  const handleGuess = () => {
    if (parseInt(userGuess) === numberToGuess) {
      setIsCorrect(true);
      setLevel(prev => prev + 1);
      setNumberToGuess(generateRandomNumber(level + 1));
    } else {
      setIsCorrect(false);
      setLives(prev => {
        let newLives = prev - 1;
        if (level % 3 === 0) newLives--;
        return newLives;
      });
    }
    setUserGuess('');
  };

  const nextLevel = () => {
    setIsCorrect(null);
  };

  const restartGame = () => {
    setLevel(1);
    setLives(5);
    setNumberToGuess(generateRandomNumber(1));
    setIsCorrect(null);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Header />
      <GameCard 
        level={level} 
        lives={lives} 
        numberRange={level * 10} 
        userGuess={userGuess} 
        setUserGuess={setUserGuess} 
        handleGuess={handleGuess}
      />
      {isCorrect !== null && (
        <MessageModal 
          isCorrect={isCorrect} 
          isGameOver={isGameOver} 
          nextLevel={nextLevel} 
          restartGame={restartGame}
        />
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-blue-600">Guess The Number</h1>
    </div>
  );
}

function GameCard({ level, lives, numberRange, userGuess, setUserGuess, handleGuess }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Level {level}</CardTitle>
        <CardDescription>
          Guess a number between 1 and {numberRange}. You have {lives} {lives === 1 ? 'life' : 'lives'} left.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <div className="bg-amber-200 p-4 rounded-full text-2xl font-bold">?</div>
      </CardContent>
      <CardContent>
        <Input 
          type="number" 
          value={userGuess} 
          onChange={(e) => setUserGuess(e.target.value)} 
          placeholder="Enter your guess"
          className="mb-2"
        />
        <Button onClick={handleGuess}>Check Guess</Button>
      </CardContent>
    </Card>
  );
}

function MessageModal({ isCorrect, isGameOver, nextLevel, restartGame }) {
  return (
    <div className="mt-4 p-4 bg-white shadow-lg rounded-lg text-center">
      {isGameOver ? (
        <>
          <p className="text-red-500 font-bold">Game Over!</p>
          <Button onClick={restartGame} className="mt-2">Play Again</Button>
        </>
      ) : isCorrect ? (
        <>
          <p className="text-green-500">Correct! Moving to next level.</p>
          <Button onClick={nextLevel} className="mt-2">Next Level</Button>
        </>
      ) : (
        <p className="text-red-500">Wrong! Try again.</p>
      )}
    </div>
  );
}