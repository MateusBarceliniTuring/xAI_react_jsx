import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const CalculatorButton = ({ children, onClick, color = 'gray' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      variant="outline"
      className={`rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-all hover:scale-110 ${isHovered ? 'scale-110' : ''} ${color === 'green' ? 'bg-green-500 hover:bg-green-600' : color === 'red' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

function App() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operation, setOperation] = useState(null);

  const handleNumber = (num) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperation = (op) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      calculate();
      setOperation(op);
    }
  };

  const calculate = () => {
    const secondOperand = parseFloat(display);
    let result = 0;
    switch (operation) {
      case '+':
        result = firstOperand + secondOperand;
        break;
      case '-':
        result = firstOperand - secondOperand;
        break;
      case '*':
        result = firstOperand * secondOperand;
        break;
      case '/':
        result = firstOperand / secondOperand;
        break;
      default:
        return;
    }
    setDisplay(String(result));
    setFirstOperand(null);
  };

  const handleEqual = () => {
    if (firstOperand !== null && operation) {
      calculate();
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const handleSign = () => {
    setDisplay(prev => String(-parseFloat(prev)));
  };

  const handlePercent = () => {
    setDisplay(prev => String(parseFloat(prev) / 100));
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg w-full max-w-sm mx-auto mt-10">
      <div className="bg-white p-4 rounded-t-lg text-right text-2xl mb-4">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton onClick={handleClear} color="green">AC</CalculatorButton>
        <CalculatorButton onClick={handleSign} color="green">+/-</CalculatorButton>
        <CalculatorButton onClick={handlePercent} color="green">%</CalculatorButton>
        <CalculatorButton onClick={() => handleOperation('/')} color="green">/</CalculatorButton>
        {[7, 8, 9].map(num => (
          <CalculatorButton key={num} onClick={() => handleNumber(String(num))}>{num}</CalculatorButton>
        ))}
        <CalculatorButton onClick={() => handleOperation('*')} color="green">*</CalculatorButton>
        {[4, 5, 6].map(num => (
          <CalculatorButton key={num} onClick={() => handleNumber(String(num))}>{num}</CalculatorButton>
        ))}
        <CalculatorButton onClick={() => handleOperation('-')} color="green">-</CalculatorButton>
        {[1, 2, 3].map(num => (
          <CalculatorButton key={num} onClick={() => handleNumber(String(num))}>{num}</CalculatorButton>
        ))}
        <CalculatorButton onClick={() => handleOperation('+')} color="green">+</CalculatorButton>
        <div></div>
        <CalculatorButton onClick={() => handleNumber('0')} className="col-span-2 w-auto">0</CalculatorButton>
        <CalculatorButton onClick={() => handleNumber('.')}>.</CalculatorButton>
        <CalculatorButton onClick={handleEqual} color="red">=</CalculatorButton>
      </div>
    </div>
  );
}

export default App;