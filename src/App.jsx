import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CalculatorButton = ({ children, onClick, className = '' }) => (
  <Button 
    variant="outline" 
    className={`w-full h-16 text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 ${className}`}
    onClick={onClick}>
    {children}
  </Button>
);

const Display = ({ expression, result }) => (
  <div className="mb-4 p-4 bg-gray-800 text-right rounded-lg shadow-inner">
    <div className="text-amber-500 text-sm mb-1">{expression}</div>
    <div className="text-white text-2xl">{result || expression}</div>
  </div>
);

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = useCallback((value) => {
    if (value === '=') {
      try {
        // Using eval for simplicity; in production, use a safer method or library for calculation
        const calculatedResult = eval(expression);
        setResult(calculatedResult.toString());
        setExpression(prev => `${prev} = ${calculatedResult}`);
      } catch (e) {
        setResult('Error');
      }
    } else if (value === 'AC') {
      setExpression('');
      setResult('');
    } else if (value === '+/-') {
      setExpression(prev => {
        if (prev[0] === '-') return prev.slice(1);
        else return `-${prev}`;
      });
    } else {
      setExpression(prev => prev + value);
      // Clear result if new input after calculation
      if (result !== '') setResult('');
    }
  }, [expression, result]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900">
      <Card className="w-full max-w-sm p-4 bg-gray-700 shadow-xl">
        <CardContent className="p-0 space-y-2">
          <Display expression={expression} result={result} />
          <div className="grid grid-cols-4 gap-2">
            {['AC', '+/-', '%', '/', 
              '7', '8', '9', '*',
              '4', '5', '6', '-',
              '1', '2', '3', '+',
              '(', '0', ')', '='].map(btn => (
              <CalculatorButton 
                key={btn} 
                onClick={() => handleButtonClick(btn)} 
                className={
                  btn === '=' ? 'col-span-2 bg-amber-600 text-white' :
                  ['+', '-', '*', '/'].includes(btn) ? 'bg-amber-500 text-white' : ''
                }>
                {btn}
              </CalculatorButton>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;