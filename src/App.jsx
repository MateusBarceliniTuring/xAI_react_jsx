import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <div className="bg-blue-500 p-4 text-white text-center">
      <h1 className="text-2xl font-bold">Rock Paper Scissors</h1>
    </div>
  );
}

function GameTab() {
  const [computerChoice, setComputerChoice] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const choices = ['rock', 'paper', 'scissors'];

  const playGame = () => {
    setIsPlaying(true);
    setComputerChoice(choices[Math.floor(Math.random() * choices.length)]);
  };

  const determineWinner = (user, computer) => {
    if (user === computer) return "It's a tie!";
    if (
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) return "You win!";
    return "AI wins!";
  };

  const playAgain = () => {
    setIsPlaying(false);
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  return (
    <div className="p-4 space-y-4">
      {!isPlaying ? (
        <Button onClick={playGame}>Play Game</Button>
      ) : (
        <>
          <div className="flex justify-center space-x-4">
            {choices.map(choice => (
              <Button 
                key={choice} 
                onClick={() => {
                  setUserChoice(choice);
                  setResult(determineWinner(choice, computerChoice));
                }}
                disabled={!!userChoice}
              >
                {choice}
              </Button>
            ))}
          </div>
          {userChoice && (
            <div className="text-center mt-4">
              <p>AI chose: {computerChoice}</p>
              <p className={result === "You win!" ? "text-green-500" : "text-red-500"}>{result}</p>
              <Button onClick={playAgain}>Play Again</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function HistoryTab() {
  const [history, setHistory] = useState([]);

  // Here you would typically update history with each game played
  // For simplicity, I'm adding a static example

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Player: 5 | AI: 3</p>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible>
        {history.map((game, index) => (
          <AccordionItem value={`game-${index}`} key={index}>
            <AccordionTrigger>Game {index + 1}</AccordionTrigger>
            <AccordionContent>
              Player chose: {game.userChoice}, AI chose: {game.aiChoice}. Result: {game.result}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Tabs defaultValue="play" className="w-full p-4">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="play">Play</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="play">
          <GameTab />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}