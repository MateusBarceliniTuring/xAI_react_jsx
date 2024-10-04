import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Helper function to get random choice for computer
const getComputerChoice = () => ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];

// Determine the winner
const determineWinner = (player, computer) => {
  if (player === computer) return 'tie';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'scissors' && computer === 'paper') ||
    (player === 'paper' && computer === 'rock')
  ) return 'player';
  return 'computer';
};

const Header = () => (
  <div className="bg-blue-600 p-4 text-center">
    <h1 className="text-white text-2xl">Rock Paper Scissors</h1>
  </div>
);

const GameTab = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);

  const playGame = () => {
    setComputerChoice(getComputerChoice());
    setPlayerChoice(null);
  };

  const choose = (choice) => {
    setPlayerChoice(choice);
    const winResult = determineWinner(choice, computerChoice);
    setResult(winResult === 'player' ? 'You Win!' : winResult === 'computer' ? 'You Lose!' : 'It\'s a Tie!');
  };

  return (
    <div className="p-4">
      {!playerChoice && <Button onClick={playGame}>Start Game</Button>}
      {computerChoice && !playerChoice && (
        <div className="mt-4 space-x-2">
          <Button onClick={() => choose('rock')}>Rock</Button>
          <Button onClick={() => choose('paper')}>Paper</Button>
          <Button onClick={() => choose('scissors')}>Scissors</Button>
        </div>
      )}
      {result && (
        <p className={`mt-4 ${result === 'You Win!' ? 'text-green-500' : 'text-red-500'}`}>{result}</p>
      )}
    </div>
  );
};

const ScoreTab = ({ scores, history }) => (
  <div className="p-4">
    <Card>
      <CardHeader>
        <CardTitle>Score</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Player: {scores.player}</p>
        <p>AI: {scores.ai}</p>
      </CardContent>
    </Card>
    <Accordion type="single" collapsible className="mt-4">
      {history.map((game, idx) => (
        <AccordionItem value={`item-${idx}`} key={idx}>
          <AccordionTrigger>Game {idx + 1}</AccordionTrigger>
          <AccordionContent>
            {game.result === 'player' ? 'You won this round!' : 
             game.result === 'computer' ? 'AI won this round!' : 'This round was a tie!'}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default function App() {
  const [tab, setTab] = useState('play');
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [history, setHistory] = useState([]);

  const updateGame = (result) => {
    const newScores = { ...scores };
    if (result === 'player') newScores.player++;
    else if (result === 'computer') newScores.ai++;
    setScores(newScores);
    setHistory([...history, { result }]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Tabs defaultValue={tab} className="w-full p-4">
        <TabsList>
          <TabsTrigger value="play" onClick={() => setTab('play')}>Play</TabsTrigger>
          <TabsTrigger value="score" onClick={() => setTab('score')}>Score</TabsTrigger>
        </TabsList>
        <TabsContent value="play">
          <GameTab updateGame={updateGame} />
        </TabsContent>
        <TabsContent value="score">
          <ScoreTab scores={scores} history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}