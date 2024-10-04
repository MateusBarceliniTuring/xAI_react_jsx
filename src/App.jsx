import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function App() {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);
  const [history, setHistory] = useState([]);

  const [computerChoice, setComputerChoice] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resultColor, setResultColor] = useState("text-black");

  const Header = () => {
    return (
      <div className="bg-amber-600 p-4 text-white text-center">
        <header className="text-2xl font-bold">Rock Paper Scissors</header>
      </div>
    );
  }

  const GameTab = () => {
    const choices = ["rock", "paper", "scissors"];

    const playGame = () => {
      setIsPlaying(true);
      setComputerChoice(choices[Math.floor(Math.random() * choices.length)]);
      setUserChoice(null);
      setResult(null);
    };

    const determineWinner = (user, computer) => {
      setUserChoice(user);

      let resultTxt = "", color = "";
      if (user === computer) {
        color = "text-black";
        resultTxt = "It's a tie!";
      } else if (
        (user === "rock" && computer === "scissors") ||
        (user === "paper" && computer === "rock") ||
        (user === "scissors" && computer === "paper")
      ) {
        setPlayerScore(prevScore => prevScore + 1);
        color = "text-green-500";
        resultTxt = "You win!";
      } else {
        setAIScore(aiScore + 1);
        color = "text-red-500";
        resultTxt = "AI wins!";
      }

      setResultColor(color);
      setResult(resultTxt);

      setHistory(prev => [...prev, {
        userChoice: user,
        aiChoice: computer,
        result: resultTxt,
        resultColor: color
      }]);
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Play</CardTitle>
          <CardDescription>Click on Play Game button to start.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            {!isPlaying ? (
              <Button className="bg-amber-500" onClick={playGame}>Play Game</Button>
            ) : (
              <>
                {!userChoice && (
                  choices.map(choice => (
                    <Button
                      key={choice}
                      className="bg-amber-400"
                      onClick={() => determineWinner(choice, computerChoice)}
                      disabled={!!userChoice}
                    >
                      {choice}
                    </Button>
                  ))
                )}

                {userChoice && (
                  <div className="text-center mt-4">
                    <p>Player chose: {userChoice}</p>
                    <p>AI chose: {computerChoice}</p>
                    <p className={resultColor}>{result}</p>
                    <Button className="bg-amber-500 mt-4"  onClick={playGame}>Play Again</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const HistoryTab = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score</CardTitle>
          <CardDescription>Check the score and game history.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Player: {playerScore} x AI: {aiScore}</p>
          <Accordion className="mt-1" type="single" collapsible>
            {history.map((game, index) => (
              <AccordionItem value={`game-${index}`} key={index}>
                <AccordionTrigger>Game {index + 1}</AccordionTrigger>
                <AccordionContent>
                  <p>Player chose: {game.userChoice}</p>
                  <p>AI chose: {game.aiChoice}</p>
                  <p>Result: <span className={game.resultColor}>{game.result}</span></p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    );
  }

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