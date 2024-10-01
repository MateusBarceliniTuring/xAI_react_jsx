import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const secondOperand = parseFloat(display);
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': 
        if (secondOperand === 0) {
          alert('Division by zero is not allowed');
          return firstOperand;
        }
        return firstOperand / secondOperand;
      case '%': return firstOperand % secondOperand;
      default: return secondOperand;
    }
  };

  const calculate = () => {
    if (!waitingForOperand) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
      setOperator(null);
    }
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const ButtonComponent = ({ children, onClick, color = 'gray' }) => (
    <Button 
      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-transform transform hover:scale-105 active:scale-95 ${color === 'green' ? 'bg-green-500 hover:bg-green-600' : color === 'red' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'}`}
      onClick={onClick}>
      {children}
    </Button>
  );

  return (
    <div className="bg-gray-700 p-4 rounded-lg w-full max-w-sm mx-auto mt-10">
      <div className="bg-white p-4 rounded-t-lg text-right text-2xl mb-4">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['AC', '+/-', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '=']
          .map(key => {
            let color = 'gray';
            if (['+', '-', '*', '/', '%'].includes(key)) color = 'green';
            if (key === '=') color = 'red';
            if (key === 'AC') color = 'red';

            return (
              <ButtonComponent 
                key={key} 
                onClick={() => {
                  if (key === 'AC') clearDisplay();
                  else if (['+', '-', '*', '/', '%'].includes(key)) handleOperator(key);
                  else if (key === '=') calculate();
                  else if (key === '+/-') toggleSign();
                  else if (key === '.') inputDecimal();
                  else inputDigit(key);
                }}
                color={color}>
                {key}
              </ButtonComponent>
            );
          })}
      </div>
    </div>
  );
};

export default function App() {
  return <Calculator />;
}