import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function App() {
  const [page, setPage] = useState('home');
  const [questionList, setQuestionList] = useState([]);
  const [questionToEdit, setQuestionToEdit] = useState({});

  const answers = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5'];

  const Header = () => {
    return (
      <header className="top-0 w-full bg-amber-600 p-4 text-center flex justify-between">
        <h1 className="text-2xl text-white">Quiz App</h1>
        <Button variant="outline" onClick={() => setPage('home')}>
          Home
        </Button>
      </header>
    );
  }

  const HomePage = () => {
    return (
      <Card className="m-4 p-4">
        <CardContent className="flex justify-around p-4">
          <Button onClick={() => setPage('question')} className="bg-amber-600">
            Register Questions
          </Button>
          <Button onClick={() => goToQuiz()} className="bg-amber-600">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const goToQuiz = () => {
    if (questionList.length > 0) {
      setPage('quiz');
    } else {
      alert("Ops! No questions registered.");
    }
  }

  const QuestionPage = () => {
    return (
      <>
        <QuestionForm edit={false}/>
        <QuestionList />
      </>
    );
  }

  const QuestionForm = ({edit}) => {
    const getFieldValue = (edit, field) => {
      const ret = field === 'answerCorrect' ? 'answer1' : '';
      return !edit ? ret : (questionToEdit != null ? questionToEdit[field] : ret);
    }

    const [question, setQuestion] = useState(getFieldValue(edit, 'question'));
    const [answer1, setAnswer1] = useState(getFieldValue(edit, answers[0]));
    const [answer2, setAnswer2] = useState(getFieldValue(edit, answers[1]));
    const [answer3, setAnswer3] = useState(getFieldValue(edit, answers[2]));
    const [answer4, setAnswer4] = useState(getFieldValue(edit, answers[3]));
    const [answer5, setAnswer5] = useState(getFieldValue(edit, answers[4]));
    const [answerCorrect, setAnswerCorrect] = useState(getFieldValue(edit, 'answerCorrect'));

    const handleSubmit = (e) => {
      e.preventDefault();

      if (edit) {
        setQuestionList(questionList.filter(item => item.id !== questionToEdit.id));
        setQuestionToEdit(null);
      }

      setQuestionList(prev => [...prev, {
        id: Date.now().toString(),
        question,
        answer1,
        answer2,
        answer3,
        answer4,
        answer5,
        answerCorrect
      }]);
    };

    return (
      <Card className="m-4 p-4">
        {!edit &&
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
        }
        <CardContent>
          <form className="w-full" onSubmit={handleSubmit}>
            <Input className="mb-3" onChange={e => setQuestion(e.target.value)} placeholder="Question" required value={question} max="100" />
            <Input className="mb-3" onChange={e => setAnswer1(e.target.value)} placeholder="Answer 1" required value={answer1} max="20" />
            <Input className="mb-3" onChange={e => setAnswer2(e.target.value)} placeholder="Answer 2" required value={answer2} max="20" />
            <Input className="mb-3" onChange={e => setAnswer3(e.target.value)} placeholder="Answer 3" required value={answer3} max="20" />
            <Input className="mb-3" onChange={e => setAnswer4(e.target.value)} placeholder="Answer 4" required value={answer4} max="20" />
            <Input className="mb-3" onChange={e => setAnswer5(e.target.value)} placeholder="Answer 5" required value={answer5} max="20" />
            <Select onValueChange={setAnswerCorrect} value={answerCorrect}>
              <SelectTrigger>
                <SelectValue placeholder="What is the right answer?" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>What is the right answer?</SelectLabel>
                  <SelectItem value={answers[0]}>Answer 1</SelectItem>
                  <SelectItem value={answers[1]}>Answer 2</SelectItem>
                  <SelectItem value={answers[2]}>Answer 3</SelectItem>
                  <SelectItem value={answers[3]}>Answer 4</SelectItem>
                  <SelectItem value={answers[4]}>Answer 5</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="mt-3 bg-amber-600" type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  const QuestionList = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
      <>
        {questionList.map((q, index) => (
          <Card className="m-4 p-4 cursor-pointer"
            key={index} 
            onClick={() => { setQuestionToEdit(q); setModalOpen(true);  }}>
            <CardContent className="break-words">
              <p>{q.question}</p>
            </CardContent>
          </Card>
        ))}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            <QuestionForm edit={true} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [quizEnded, setQuizEnded] = useState(false);
    const [result, setResult] = useState({});

    const processedQuestions = useMemo(() => {
      return questionList.map(item => ({
        id: item.id,
        question: item.question,
        answerCorrect: item.answerCorrect,
        answers: [item.answer1, item.answer2, item.answer3, item.answer4, item.answer5]
      }));
    }, [questionList]);

    useEffect(() => {
      setQuestions(processedQuestions);
    }, [processedQuestions]);

    useEffect(() => {
      if (timeLeft > 0 && !quizEnded) {
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timerId);
      } else if (timeLeft === 0 && currentQuestion < questions.length - 1) {
        setCurrentAnswer(null);
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(20);
      } else {
        const corrected = userAnswers.filter(item => item.correct).length;
        const percentage = (corrected / questions.length) * 100;
        const total = questions.length;

        setResult({corrected, percentage, total});
        setQuizEnded(true);
      }
    }, [timeLeft, currentQuestion, quizEnded]);
  
    const handleAnswer = (index) => {
      setCurrentAnswer(index);
      const currQuestion = questions[currentQuestion];
      setUserAnswers(userAnswers.filter(item => item.questionId !== currQuestion.id));
      setUserAnswers(prev => [...prev, {
        questionId: currQuestion.id,
        correct: answers[index] === currQuestion.answerCorrect
      }]);
    }
  
    return (
      <>
        {!quizEnded ? (
          <Card className="m-4 p-4">
            <CardHeader>
              <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p><Label className="font-bold">Time Left: {timeLeft}s</Label></p>
              <p><Label className="font-bold">Question {currentQuestion+1}:</Label></p>
              <p><Label>{questions[currentQuestion]?.question}</Label></p>
              <p><Label className="font-bold">Answers:</Label></p>
              <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
                {questions[currentQuestion]?.answers.map((ans, idx) => (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id={idx} value={idx} />
                    <Label htmlFor={idx}>{ans}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ) : (
          <AlertDialog open={quizEnded}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Quiz Results</AlertDialogTitle>
                <AlertDialogDescription>
                  <p>You got {result.corrected} out of {result.total} questions correct!</p>
                  <p className={`font-bold ${result.percentage < 25 ? 'text-red-500' : result.percentage < 50 ? 'text-amber-500' : result.percentage < 75 ? 'text-blue-500' : 'text-green-500'}`}>
                    {result.percentage.toFixed(2)}%
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPage('home')}>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {page === 'home' && <HomePage />}
      {page === 'question' && <QuestionPage /> }
      {page === 'quiz' && <QuizPage />}
    </div>
  );
}