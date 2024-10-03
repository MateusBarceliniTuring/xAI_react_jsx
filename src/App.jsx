import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@/components/ui/alert-dialog";

function Header({ title }) {
  return (
    <header className="bg-amber-400 p-4 mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button variant="outline" asChild>
        <a href="/">Home</a>
      </Button>
    </header>
  );
}

function Home() {
  return (
    <Card>
      <CardContent>
        <Button asChild>
          <a href="/register">Register Questions</a>
        </Button>
        <Button asChild>
          <a href="/quiz">Start Quiz</a>
        </Button>
      </CardContent>
    </Card>
  );
}

function QuestionForm({ question, setQuestion, onSubmit, isEditing = false }) {
  const [localQuestion, setLocalQuestion] = useState(question || { question: '', answers: ['', '', '', '', ''], correct: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localQuestion);
    if (!isEditing) setLocalQuestion({ question: '', answers: ['', '', '', '', ''], correct: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={localQuestion.question} 
        onChange={e => setLocalQuestion({...localQuestion, question: e.target.value.slice(0, 100)})} 
        placeholder="Question" 
        required 
      />
      {localQuestion.answers.map((ans, idx) => (
        <Input 
          key={idx} 
          value={ans} 
          onChange={e => {
            const newAnswers = [...localQuestion.answers];
            newAnswers[idx] = e.target.value.slice(0, 20);
            setLocalQuestion({...localQuestion, answers: newAnswers});
          }} 
          placeholder={`Answer ${idx + 1}`} 
          required 
        />
      ))}
      <Select value={localQuestion.correct} onChange={val => setLocalQuestion({...localQuestion, correct: val})}>
        {localQuestion.answers.map((_, idx) => <SelectItem key={idx} value={`${idx}`}>Answer {idx + 1}</SelectItem>)}
      </Select>
      <Button type="submit">{isEditing ? 'Update' : 'Add'} Question</Button>
    </form>
  );
}

function RegisterQuestions() {
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  const editQuestion = (question) => {
    const updatedQuestions = questions.map(q => q === editingQuestion ? question : q);
    setQuestions(updatedQuestions);
    setModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Register Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionForm onSubmit={addQuestion} />
        </CardContent>
      </Card>
      {questions.map((q, index) => (
        <Card key={index} className="mt-4 cursor-pointer" onClick={() => { setEditingQuestion(q); setModalOpen(true); }}>
          <CardContent>
            <p>{q.question}</p>
          </CardContent>
        </Card>
      ))}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>Edit Question</ModalHeader>
          <ModalBody>
            <QuestionForm question={editingQuestion} setQuestion={setEditingQuestion} onSubmit={editQuestion} isEditing={true} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !quizEnded) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20);
    } else {
      setQuizEnded(true);
    }
  }, [timeLeft, currentQuestion, quizEnded]);

  const handleAnswer = (answerIndex) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answerIndex;
      return newAnswers;
    });
  };

  const correctAnswers = questions.map((q, i) => q.correct === userAnswers[i] ? 1 : 0).reduce((a, b) => a + b, 0);
  const percentage = (correctAnswers / questions.length) * 100;

  return (
    <>
      {!quizEnded ? (
        <Card>
          <CardContent>
            <Label>Time Left: {timeLeft}s</Label>
            <Label>{questions[currentQuestion]?.question}</Label>
            <RadioGroup value={userAnswers[currentQuestion]} onValueChange={handleAnswer}>
              {questions[currentQuestion]?.answers.map((ans, idx) => (
                <RadioGroupItem key={idx} value={`${idx}`}>{ans}</RadioGroupItem>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ) : (
        <AlertDialog open={quizEnded}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <h2>Quiz Results</h2>
            </AlertDialogHeader>
            <AlertDialogBody>
              <p>You got {correctAnswers} out of {questions.length} questions correct!</p>
              <p className={`font-bold ${percentage < 25 ? 'text-red-500' : percentage < 50 ? 'text-amber-500' : percentage < 75 ? 'text-blue-500' : 'text-green-500'}`}>
                {percentage.toFixed(2)}%
              </p>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <Header title="Quiz App" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterQuestions />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </div>
  );
}