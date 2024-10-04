import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function formatTime(ms) {
  const hours = `0${Math.floor(ms / 3600000)}`.slice(-2);
  const minutes = `0${Math.floor((ms % 3600000) / 60000)}`.slice(-2);
  const seconds = `0${Math.floor((ms % 60000) / 1000)}`.slice(-2);
  const milliseconds = ms % 1000;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

const Header = () => {
  return (
    <div className="bg-amber-600 p-4 text-white text-center">
      <header className="text-2xl font-bold">Stopwatch</header>
    </div>
  );
}

const StopwatchDisplay = ({ time }) => (
  <div className="text-4xl text-center mb-4">
    {formatTime(time)}
  </div>
);

const ControlButtons = ({ onStart, onStop, onTurn, onClean, show }) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {show.start && <Button onClick={onStart} className="bg-green-500">Start</Button>}
    {show.turn && <Button onClick={onTurn} className="bg-amber-400">Turn</Button>}
    {show.stop && <Button onClick={onStop} className="bg-red-500">Stop</Button>}
    {show.clean && <Button onClick={onClean} className="bg-amber-400">Clean</Button>}
  </div>
);

const TurnsTable = ({ turns }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Turn</TableHead>
        <TableHead>Partial</TableHead>
        <TableHead>Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {turns.map((turn, index) => (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{formatTime(turn.partial)}</TableCell>
          <TableCell>{formatTime(turn.total)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function App() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [turns, setTurns] = useState([]);
  const [showButton, setShowButton] = useState({ 
    start: true,
    turn: false,
    stop: false,
    clean: false
  });

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
    setIsActive(true);
    setShowButton({ start: false, turn: true, stop: true, clean: false });
  };

  const stopTimer = () => {
    setIsActive(false);
    setShowButton({ start: true, turn: false, stop: false, clean: true });
  };

  const addTurn = () => {
    setTurns(prevTurns => [...prevTurns, { partial: time - (prevTurns.length ? prevTurns[prevTurns.length - 1].total : 0), total: time }]);
  };

  const cleanAll = () => {
    setTime(0);
    setIsActive(false);
    setTurns([]);
    setShowButton({ start: true, turn: false, stop: false, clean: false });
  };

  return (
    <div className="w-full">
      <Header />
      <Card className="m-4 p-4">
        <CardContent className="flex flex-col items-center">
          <StopwatchDisplay className="text-6xl mb-4" time={time} />
          <Separator className="mb-4" />
          <ControlButtons
            onStart={startTimer}
            onStop={stopTimer}
            onTurn={addTurn}
            onClean={cleanAll}
            show={showButton}
          />
          <Separator className="mt-4" />
          {turns.length > 0 && <TurnsTable turns={turns} />}
        </CardContent>
      </Card>
    </div>
  );
}