import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const subjectsList = ['Math', 'English', 'History', 'Geography', 'Science', 'Arts', 'Sports'];

export default function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const tabsContainerRef = useRef(null);

  useEffect(() => {
    const header = document.getElementById('header');
    const tabsContainer = tabsContainerRef.current;
    const headerHeight = header.offsetHeight;

    tabsContainer.style.marginTop = `${headerHeight}px`;
  }, []);

  const addStudent = (name, className) => {
    setStudents(prev => [...prev, { name, className, id: Date.now().toString() }]);
  }

  const addSubjectAverage = (subject, average) => {
    setSubjects(prev => [...prev, { subject, average, id: Date.now() }]);
  }

  const addGrade = (studentId, subject, grade) => {
    setGrades(prev => [...prev, { studentId, subject, grade, id: Date.now() }]);
  }

  const removeItem = (list, setList, id) => {
    setList(prev => prev.filter(item => item.id !== id));
  }

  const Header = () => {
    return (
      <header id="header" className="fixed top-0 w-full bg-amber-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">School System</h1>
      </header>
    );
  }

  const StudentForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [className, setClassName] = useState('');
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name, className);
        setName('');
        setClassName('');
      }}>
        <Card>
          <CardHeader>
            <CardTitle>Add Student</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="text" required placeholder="Student Name" value={name} onChange={e => setName(e.target.value)} className="mb-2" />
            <Input type="text" required placeholder="Class" value={className} onChange={e => setClassName(e.target.value)} />
          </CardContent>
          <CardFooter>
            <Button type="submit">Add Student</Button>
          </CardFooter>
        </Card>
      </form>
    );
  }

  const StudentCard = ({ student, onRemove }) => {
    return (
      <Card className="mt-2">
        <CardContent className="p-6">
          <p>
            <Label className="font-bold mr-3">Name:</Label>
            <Label>{student.name}</Label>
          </p>
          <p>
            <Label className="font-bold mr-3">Class:</Label>
            <Label>{student.className}</Label>
          </p>
          <Button className="mt-2" variant="destructive" onClick={onRemove}>Remove</Button>
        </CardContent>
      </Card>
    );
  }

  const SubjectForm = ({ onSubmit }) => {
    const [subject, setSubject] = useState('');
    const [average, setAverage] = useState('');
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(subject, average);
      }}>
        <Card>
          <CardHeader>
            <CardTitle>Add Subject Average</CardTitle>
          </CardHeader>
          <CardContent>
            <Select className="w-full" onValueChange={setSubject} required>
              <SelectTrigger >
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectsList.filter(item => !subjects.some(s => s.subject === item)).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input type="number" required placeholder="Average Grade" value={average} onChange={e => setAverage(e.target.value)} className="mt-2" />
          </CardContent>
          <CardFooter>
            <Button type="submit">Add Subject</Button>
          </CardFooter>
        </Card>
      </form>
    );
  }

  const SubjectCard = ({ subject, onRemove }) => {
    return (
      <Card className="mt-2">
        <CardContent className="p-6">
          <p>
            <Label className="font-bold mr-3">Subject:</Label>
            <Label>{subject.subject}</Label>
          </p>
          <p>
            <Label className="font-bold mr-3">Average:</Label>
            <Label>{subject.average}</Label>
          </p>
          <Button className="mt-2" variant="destructive" onClick={onRemove}>Remove</Button>
        </CardContent>
      </Card>
    );
  }

  const GradeForm = ({ onSubmit }) => {
    const [studentId, setStudentId] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(studentId, subject, grade);
        setStudentId('');
        setSubject('');
        setGrade('');
      }}>
        <Card>
          <CardHeader>
            <CardTitle>Add Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <Select required onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="mt-2">
              <Select required onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s.subject} value={s.subject}>{s.subject}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Input type="number" required placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} className="mt-2" />
          </CardContent>
          <CardFooter>
            <Button type="submit">Add Grade</Button>
          </CardFooter>
        </Card>
      </form>
    );
  }

  const GradeCard = ({ grade, onRemove }) => {
    const studentName = students.find(item => item.id === grade.studentId).name;
    return (
      <Card className="mt-2">
        <CardContent className="p-6">
          <p>
            <Label className="font-bold mr-3">Student:</Label>
            <Label>{studentName}</Label>
          </p>
          <p>
            <Label className="font-bold mr-3">Subject:</Label>
            <Label>{grade.subject}</Label>
          </p>
          <p>
            <Label className="font-bold mr-3">Grade:</Label>
            <Label>{grade.grade}</Label>
          </p>
          <Button className="mt-2" variant="destructive" onClick={onRemove}>Remove</Button>
        </CardContent>
      </Card>
    );
  }
  
  const PerformanceForm = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }

  const PerformanceCard = ({ grade, subject }) => {
    const studentName = students.find(item => item.id === grade.studentId).name;
    const status = parseFloat(grade.grade) >= parseFloat(subject.average) ? "Approved" : "Reproved";
    return (
      <Card className="mt-2">
        <CardContent className="p-6">
          <p>
            <Label className="font-bold mr-3">Student:</Label>
            <Label>{studentName}</Label>
          </p>
          <p>
            <Label className="font-bold mr-3">Student Grade:</Label>
            <Label>{grade.grade}</Label>
          </p>
          <p>
            <Label className="font-bold mr-3">Subject:</Label>
            <Label>{grade.subject}</Label>
          </p>
          <p>
            <Label className="font-bold mr-3">Subject Average:</Label>
            <Label>{subject.average}</Label>
          </p>
          <p className={`font-bold ${status === "Approved" ? 'text-green-500' : 'text-red-500'}`}>{status}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div ref={tabsContainerRef} id="tabs-container" className="p-3">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="p-2 rounded-lg">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <StudentForm onSubmit={addStudent} />
            {students.map(student => (
              <StudentCard key={student.id} student={student} onRemove={() => removeItem(students, setStudents, student.id)} />
            ))}
          </TabsContent>
          <TabsContent value="subjects">
            <SubjectForm onSubmit={addSubjectAverage} />
            {subjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} onRemove={() => removeItem(subjects, setSubjects, subject.id)} />
            ))}
          </TabsContent>
          <TabsContent value="grades">
            <GradeForm onSubmit={addGrade} students={students} subjects={subjects} />
            {grades.map(grade => (
              <GradeCard key={grade.id} grade={grade} onRemove={() => removeItem(grades, setGrades, grade.id)} />
            ))}
          </TabsContent>
          <TabsContent value="performance">
            <PerformanceForm />
            <Separator className="mt-3 mb-3" />
            {selectedStudent && (
              grades.filter(g => g.studentId === selectedStudent).map(grade => {
                const subject = subjects.find(s => s.subject === grade.subject);
                return <PerformanceCard key={grade.id} grade={grade} subject={subject} />;
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}