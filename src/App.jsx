import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function GameHeader() {
  return (
    <div className="bg-blue-600 text-white p-4 text-center">
      <h1 className="text-2xl font-bold">Guess The Number</h1>
    </div>
  );
}

function MiniCard() {
  return (
    <div className="bg-amber-300 p-4 rounded-md text-center w-16 h-16 flex items-center justify-center">
      <span className="text-3xl">?</span>
    </div>
  );
}

function GameCard({ level, lives, range }) {
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Level {level}</CardTitle>
        <CardDescription>
          Guess a number between 1 and {range}. You have {lives} lives left.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <MiniCard />
      </CardContent>
    </Card>
  );
}

function GuessInput({ onSubmit }) {
  const [guess, setGuess] = useState('');
  
  const handleSubmit = () => {
    onSubmit(Number(guess));
    setGuess('');
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <Input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Enter your guess" />
      <Button onClick={handleSubmit}>Check</Button>
    </div>
  );
}

function ResultMessage({ message, onNext, onRestart }) {
  return (
    <div className="my-4 text-center">
      <p>{message}</p>
      {message.includes('Congratulations') && <Button onClick={onNext}>Next Level</Button>}
      {message.includes('Game Over') && <Button onClick={onRestart}>Play Again</Button>}
    </div>
  );
}

export default function App() {
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [numberToGuess, setNumberToGuess] = useState(Math.floor(Math.random() * 10) + 1);
  const [gameStatus, setGameStatus] = useState('playing');
  const [userGuess, setUserGuess] = useState(null);

  const range = 10 + ((level - 1) * 10);
  const maxLives = 5 - Math.floor((level - 1) / 3);

  const checkGuess = (guess) => {
    setUserGuess(guess);
    if (guess === numberToGuess) {
      setGameStatus('won');
    } else if (lives - 1 === 0) {
      setGameStatus('lost');
    } else {
      setLives(lives - 1);
    }
  };

  const nextLevel = () => {
    setLevel(level + 1);
    setNumberToGuess(Math.floor(Math.random() * (range + 10)) + 1);
    setLives(maxLives);
    setGameStatus('playing');
  };

  const restartGame = () => {
    setLevel(1);
    setLives(5);
    setNumberToGuess(Math.floor(Math.random() * 10) + 1);
    setGameStatus('playing');
  };

  return (
    <div className="container mx-auto p-4">
      <GameHeader />
      <GameCard level={level} lives={lives} range={range} />
      {gameStatus === 'playing' && <GuessInput onSubmit={checkGuess} />}
      {gameStatus !== 'playing' && 
        <ResultMessage 
          message={gameStatus === 'won' ? `Congratulations! You guessed it right!` : `Game Over! The number was ${numberToGuess}.`} 
          onNext={nextLevel} 
          onRestart={restartGame} 
        />}
    </div>
  );
}