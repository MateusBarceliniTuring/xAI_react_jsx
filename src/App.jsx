// App.jsx
import React, { useState } from 'react';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import QuizSetupPage from '@/components/QuizSetupPage';
import QuizPage from '@/components/QuizPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [quizData, setQuizData] = useState([]);

  const navigateTo = (page) => setCurrentPage(page);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onHome={() => navigateTo('home')} />
      {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
      {currentPage === 'setup' && <QuizSetupPage setQuizData={setQuizData} />}
      {currentPage === 'quiz' && <QuizPage quizData={quizData} />}
    </div>
  );
}

// components/Header.jsx
import { Button } from "@/components/ui/button";

export default function Header({ onHome }) {
  return (
    <header className="bg-amber-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl">Quiz App</h1>
        <Button onClick={onHome}>Home</Button>
      </div>
    </header>
  );
}

// components/HomePage.jsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage({ onNavigate }) {
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardContent>
        <p>Choose an option:</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onNavigate('setup')}>Setup Quiz</Button>
        <Button onClick={() => onNavigate('quiz')}>Start Quiz</Button>
      </CardFooter>
    </Card>
  );
}

// components/QuizSetupPage.jsx
// This component would handle adding questions, answers, and editing them
// Implementation omitted for brevity but would include form handling, state for questions, etc.

// components/QuizPage.jsx
import { useState, useEffect } from 'react';
import { AlertDialog } from "@/components/ui/alert-dialog";

export default function QuizPage({ quizData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (currentQuestion < quizData.length - 1) {
      nextQuestion();
    } else {
      finishQuiz();
    }
  }, [timeLeft, currentQuestion]);

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setTimeLeft(20);
    setSelectedAnswer(null);
  };

  const finishQuiz = () => {
    setIsOpen(true);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === quizData[currentQuestion].correctAnswer) setScore(score + 1);
  };

  const getColor = (percentage) => {
    if (percentage < 25) return 'red';
    if (percentage < 50) return 'amber';
    if (percentage < 75) return 'blue';
    return 'green';
  };

  return (
    <div className="p-4">
      <h2>{quizData[currentQuestion]?.question}</h2>
      <div className="space-y-2">
        {quizData[currentQuestion]?.answers.map((answer, idx) => (
          <div key={idx} className="flex items-center">
            <input 
              type="radio" 
              name="answer" 
              value={answer} 
              onChange={() => handleAnswer(answer)}
              checked={selectedAnswer === answer}
            />
            <label className="ml-2">{answer}</label>
          </div>
        ))}
      </div>
      <p>Time left: {timeLeft}</p>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Quiz Completed!</AlertDialogTitle>
          <AlertDialogDescription>
            You scored {score} out of {quizData.length}. 
            Percentage: <span className={`text-${getColor((score / quizData.length) * 100)}`}>
              {((score / quizData.length) * 100).toFixed(2)}%
            </span>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
