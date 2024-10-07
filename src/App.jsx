import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function GameHeader() {
  return (
    <div className="bg-amber-600 p-4 text-white text-center">
      <header className="text-2xl font-bold">Guess The Number</header>
    </div>
  );
}

function MiniCard({number}) {
  return (
    <div className="bg-amber-300 p-4 rounded-md text-center w-20 h-20 flex items-center justify-center">
      <span className="text-3xl">{number}</span>
    </div>
  );
}

function GuessInput({ onSubmit }) {
  const [guess, setGuess] = useState("");

  const handleSubmit = () => {
    onSubmit(Number(guess));
    setGuess("");
  };

  return (
    <div>
      <Input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Enter your guess" />
      <Button className="bg-amber-500 mt-4 w-full" onClick={handleSubmit}>Check</Button>
    </div>
  );
}

function ResultMessage({ gameStatus, numberToGuess, onNext, onRestart }) {
  return (
    <div>
      <p>
        {gameStatus === "won"
           ? `Congratulations! You guessed it right!`
           : `Game Over! The number was ${numberToGuess}.`
        }
      </p>
      {gameStatus === "won" && <Button className="mt-4 bg-amber-500" onClick={onNext}>Next Level</Button>}
      {gameStatus === "lost" && <Button className="mt-4 bg-amber-500" onClick={onRestart}>Play Again</Button>}
    </div>
  );
}

function generateNumberToGuess(range) {
  const numberToGuess = Math.floor(Math.random() * (range + 10)) + 1;
  return numberToGuess;
}

function generateRange(level) {
  return 10 + ((level - 1) * 10);
}

function generateMaxLives(level) {
  const maxLives = 9 - Math.floor((level - 1) / 3);
  return maxLives > 1 ? maxLives : 1;
}

export default function App() {
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(9);
  const [numberToGuess, setNumberToGuess] = useState(null);
  const [gameStatus, setGameStatus] = useState("playing");
  const [userGuess, setUserGuess] = useState(null);
  const [guessedNumber, setGuessedNumber] = useState("?");
  const [range, setRange] = useState(generateRange(level));
  const [maxLives, setMaxLives] = useState(generateMaxLives(level));

  const generateNewValues = () => {
    setGuessedNumber("?");
    setGameStatus("playing");
    setRange(generateRange(level));
    setMaxLives(generateMaxLives(level));
    setNumberToGuess(generateNumberToGuess(range));
    setLives(generateMaxLives(level));
  }

  useEffect(() => {
    generateNewValues();
  }, [level]);

  const checkGuess = (guess) => {
    setUserGuess(guess);
    if (guess === numberToGuess) {
      setGuessedNumber(guess);
      setGameStatus("won");
    } else if (lives - 1 === 0) {
      setGuessedNumber(numberToGuess);
      setGameStatus("lost");
    } else {
      setLives(lives - 1);
    }
  };

  const nextLevel = () => {
    setLevel(level+1);
  };

  const restartGame = () => {
    setLevel(1);
  };

  return (
    <div className="container mx-auto">
      <GameHeader />

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Level {level}</CardTitle>
          <CardDescription>
            Guess a number between 1 and {range}. You have {lives} lives left.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <MiniCard number={guessedNumber}/>
          </div>
          <div>
            {gameStatus === "playing" && <GuessInput onSubmit={checkGuess} />}
            {gameStatus !== "playing" &&
              <ResultMessage
                gameStatus={gameStatus}
                numberToGuess={numberToGuess}
                onNext={nextLevel}
                onRestart={restartGame}
              />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}