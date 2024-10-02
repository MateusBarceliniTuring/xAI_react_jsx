// App.jsx
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const operators = ['AC', '+/-', '%', '/', '*', '-', '+'];
const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
const specialChars = ['(', ')'];

function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    if (value === 'AC') {
      setDisplay('0');
      setExpression('');
      setResult('');
    } else if (value === '=') {
      try {
        const evalResult = evalExpression(expression + display);
        setResult(expression + display);
        setDisplay(evalResult.toString());
        setExpression('');
      } catch (e) {
        setDisplay('Error');
      }
    } else if (value === '+/-') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    } else if (operators.includes(value)) {
      setExpression(prev => prev + display + value);
      setDisplay('0');
    } else {
      setDisplay(prev => (prev === '0' || operators.includes(prev) ? value : prev + value));
      setExpression(prev => prev + value);
    }
  };

  const evalExpression = (expr) => {
    // Simple eval wrapper with error handling
    return Function(`'use strict'; return (${expr})`)();
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-700 shadow-xl">
        <CardContent className="p-4">
          <div className="text-right mb-4">
            <div className="text-gray-400 text-sm">{result}</div>
            <div className="text-amber-500 text-3xl" id="display">{display}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['AC', '+/-', '%', '/', ...numbers, '*', '-', '+', '='].map((btn) => (
              <Button 
                key={btn} 
                variant={operators.includes(btn) ? "outline" : (btn === '=' ? "secondary" : "default")}
                className={`hover:scale-105 transition-transform ${operators.includes(btn) ? 'bg-amber-600 hover:bg-amber-500' : 'bg-gray-200 hover:bg-gray-300 text-black'} h-16 rounded-full shadow-lg`}
                onClick={() => handleButtonClick(btn)}>
                {btn}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;