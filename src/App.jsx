// App.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatTime(ms) {
  const getSeconds = `0${(ms / 1000) % 60}`.slice(-2);
  const minutes = `0${Math.floor(ms / 60000)}`.slice(-2);
  const hours = `0${Math.floor(ms / 3600000)}`.slice(-2);
  return `${hours}:${minutes}:${getSeconds},${(ms % 1000).toString().slice(0, 2)}`;
}

const StopwatchDisplay = ({ time }) => (
  <div className="text-5xl text-center mb-4">
    {formatTime(time)}
  </div>
);

const ControlButtons = ({ onStart, onStop, onTurn, onClean, show }) => (
  <div className="flex flex-wrap gap-2 justify-center">
    <Button onClick={onStart} className="bg-green-500">Start</Button>
    {show.turn && <Button onClick={onTurn} className="bg-amber-400">Turn</Button>}
    {show.stop && <Button onClick={onStop} className="bg-red-500">Stop</Button>}
    {show.clean && <Button onClick={onClean} className="bg-amber-400">Clean</Button>}
  </div>
);

const TurnsTable = ({ turns }) => (
  <table className="min-w-full divide-y divide-gray-200 mt-4">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turn</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partial Time</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {turns.map((turn, index) => (
        <tr key={index}>
          <td className="px-6 py-4">{index + 1}</td>
          <td className="px-6 py-4">{formatTime(turn.partial)}</td>
          <td className="px-6 py-4">{formatTime(turn.total)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function App() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [turns, setTurns] = useState([]);
  const [showButton, setShowButton] = useState({ turn: false, stop: false, clean: false });

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
    setShowButton({ turn: true, stop: true, clean: false });
  };

  const stopTimer = () => {
    setIsActive(false);
    setShowButton({ turn: false, stop: false, clean: true });
  };

  const addTurn = () => {
    setTurns(prevTurns => [...prevTurns, { partial: time - (prevTurns.length ? prevTurns[prevTurns.length - 1].total : 0), total: time }]);
  };

  const cleanAll = () => {
    setTime(0);
    setIsActive(false);
    setTurns([]);
    setShowButton({ turn: false, stop: false, clean: false });
  };

  return (
    <div className="p-4 sm:p-8 bg-amber-100 min-h-screen flex flex-col items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-amber-700">Stopwatch</CardTitle>
        </CardHeader>
        <CardContent>
          <StopwatchDisplay time={time} />
          <ControlButtons 
            onStart={startTimer} 
            onStop={stopTimer} 
            onTurn={addTurn} 
            onClean={cleanAll}
            show={showButton}
          />
          {turns.length > 0 && <TurnsTable turns={turns} />}
        </CardContent>
      </Card>
    </div>
  );
}