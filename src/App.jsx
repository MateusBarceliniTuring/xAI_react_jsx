import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CalculatorButton = ({ children, onClick, className = '' }) => (
  <Button
    variant="outline"
    className={`border-none w-full h-16 text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 ${className}`}
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
  const mainOperators = ['+', '-', '*', '/'];
  const otherOperators = ['AC', '+/-', '%'];

  const [expression, setExpression] = useState('');
  const [expressionToCalc, setExpressionToCalc] = useState('');
  const [result, setResult] = useState('');

  const [lastClickOperator, setLastClickOperator] = useState(false);
  const [lastClickEqual, setLastClickEqual] = useState(false);

  const handleButtonClick = useCallback((value) => {
    if (value === '=') {
      if (lastClickEqual) return;
      setLastClickEqual(true);
      setLastClickOperator(false);

      try {
        // Using eval for simplicity; in production, use a safer method or library for calculation
        const calculatedResult = eval(expressionToCalc);
        setResult(calculatedResult.toString());
        setExpression(prev => `${prev} = ${calculatedResult}`);
      } catch (e) {
        setResult('Error');
      }
    } else if (otherOperators.includes(value)) {
        if (value === 'AC') {
          setExpressionToCalc('');
          setExpression('');
          setResult('');
        } else if (value === '+/-') {
          setExpressionToCalc(prev => {
            if (prev[0] === '-') return prev.slice(1);
            else return `-${prev}`;
          });
          setExpression(expressionToCalc);
        } else if (value === '%') {
          if (lastClickOperator) return;
          setExpressionToCalc(prev => prev + '/100');
          setExpression(prev => prev + value);
        }

        setLastClickEqual(false);
        setLastClickOperator(false);
    } else if (mainOperators.includes(value)) {
      if (lastClickOperator) return;

      if (lastClickEqual) {
        setExpressionToCalc(result);
        setExpression(result);
        if (result !== '') setResult('');
      }

      setExpressionToCalc(prev => prev + value);
      setExpression(prev => prev + value);

      setLastClickEqual(false);
      setLastClickOperator(true);
    } else {
      if (lastClickEqual) {
        setExpressionToCalc('');
        setExpression('');
        setResult('');
      }

      setLastClickEqual(false);
      setLastClickOperator(false);

      setExpressionToCalc(prev => prev + value);
      setExpression(prev => prev + value);

      if (result !== '') setResult('');
    }
  }, [expression, result]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900">
      <Card className="w-full max-w-sm p-7 bg-gray-700 shadow-xl">
        <CardContent className="p-0 space-y-2">
          <Display expression={expression} result={result} />
          <div className="grid grid-cols-4 gap-5">
            {['AC', '+/-', '%', '/',
              '7', '8', '9', '*',
              '4', '5', '6', '-',
              '1', '2', '3', '+',
              '(', '0', ')', '='].map(btn => (
                <CalculatorButton
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  className={
                    btn === '=' ? 'bg-red-400 text-white' :
                    mainOperators.includes(btn) ? 'bg-amber-500 text-white' :
                    otherOperators.includes(btn) ? 'bg-gray-500 text-white' : 'bg-gray-300'
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