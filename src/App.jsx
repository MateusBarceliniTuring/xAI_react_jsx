import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [turns, setTurns] = useState([]);
  const [lastTurnTime, setLastTurnTime] = useState(0);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  const startStop = () => {
    setRunning(!running);
    if (!running) {
      setLastTurnTime(time);
    }
  };

  const addTurn = () => {
    const partialTime = time - lastTurnTime;
    setTurns([...turns, { number: turns.length + 1, partial: partialTime, total: time }]);
    setLastTurnTime(time);
  };

  const cleanAll = () => {
    setTime(0);
    setRunning(false);
    setTurns([]);
    setLastTurnTime(0);
  };

  const formatTime = (timeInMs) => {
    const pad = (num, size) => ('000' + num).slice(size * -1);
    const time = parseFloat(timeInMs).toFixed(2);
    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time.slice(-2);

    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(milliseconds, 2)}`;
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <Card className="w-full max-w-lg bg-amber-100">
        <CardHeader>
          <CardTitle className="text-amber-800 text-2xl">Stopwatch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl text-center mb-4">{formatTime(time)}</div>
          <div className="flex justify-center space-x-2">
            <Button onClick={startStop} className={`${running ? 'bg-red-500' : 'bg-green-500'} ${running ? 'hidden' : ''}`}>
              {running ? 'Stop' : 'Start'}
            </Button>
            <Button onClick={addTurn} className={`${running ? '' : 'hidden'} bg-amber-500`}>Turn</Button>
            <Button onClick={cleanAll} className={`${running ? 'hidden' : ''} bg-amber-500`}>Clean</Button>
          </div>
        </CardContent>
      </Card>
      <TurnsTable turns={turns} />
    </div>
  );
}

function TurnsTable({ turns }) {
  return (
    <div className="mt-4 w-full max-w-lg">
      {turns.length > 0 && (
        <Card>
          <CardContent>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Turn</th>
                  <th scope="col" className="px-6 py-3">Partial Time</th>
                  <th scope="col" className="px-6 py-3">Total Time</th>
                </tr>
              </thead>
              <tbody>
                {turns.map(turn => (
                  <tr key={turn.number} className="bg-white border-b">
                    <td className="px-6 py-4">{turn.number}</td>
                    <td className="px-6 py-4">{formatTime(turn.partial)}</td>
                    <td className="px-6 py-4">{formatTime(turn.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function App() {
  return <Stopwatch />;
}