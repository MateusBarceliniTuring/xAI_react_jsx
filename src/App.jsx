import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const subjectsList = ['Math', 'English', 'History', 'Geography', 'Science', 'Arts', 'Sports'];

export default function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const addStudent = (name, className) => {
    setStudents(prev => [...prev, { name, className, id: Date.now() }]);
  };

  const addSubjectAverage = (subject, average) => {
    setSubjects(prev => [...prev, { subject, average, id: Date.now() }]);
  };

  const addGrade = (studentId, subject, grade) => {
    setGrades(prev => [...prev, { studentId, subject, grade, id: Date.now() }]);
  };

  const removeItem = (list, setList, id) => {
    setList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="p-4">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="bg-amber-100 p-2 rounded-lg">
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
            <SubjectForm onSubmit={addSubjectAverage} subjects={subjectsList} />
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
            <Select onChange={(e) => setSelectedStudent(e.target.value)} value={selectedStudent}>
              <SelectItem value={null}>Select a student</SelectItem>
              {students.map(student => <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>)}
            </Select>
            {selectedStudent && (
              <div className="mt-4">
                <div className="border-t border-amber-200 my-4" />
                {grades.filter(g => g.studentId === selectedStudent).map(grade => {
                  const subject = subjects.find(s => s.subject === grade.subject);
                  return <PerformanceCard key={grade.id} grade={grade} subject={subject} />;
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full bg-blue-600 text-white p-4 text-center">
      <h1 className="text-2xl font-bold">Student Management System</h1>
    </header>
  );
}

function StudentForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Student</CardTitle>
      </CardHeader>
      <CardContent>
        <Input type="text" placeholder="Student Name" value={name} onChange={e => setName(e.target.value)} className="mb-2" />
        <Input type="text" placeholder="Class" value={className} onChange={e => setClassName(e.target.value)} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => { onSubmit(name, className); setName(''); setClassName(''); }}>Add Student</Button>
      </CardFooter>
    </Card>
  );
}

function StudentCard({ student, onRemove }) {
  return (
    <Card className="mt-2">
      <CardContent>
        <p>{student.name} - Class: {student.className}</p>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onRemove}>Remove</Button>
      </CardFooter>
    </Card>
  );
}

function SubjectForm({ onSubmit, subjects }) {
  const [subject, setSubject] = useState('');
  const [average, setAverage] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Subject Average</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSubject}>
          {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </Select>
        <Input type="number" placeholder="Average Grade" value={average} onChange={e => setAverage(e.target.value)} className="mt-2" />
      </CardContent>
      <CardFooter>
        <Button onClick={() => { onSubmit(subject, average); setSubject(''); setAverage(''); }}>Add Subject</Button>
      </CardFooter>
    </Card>
  );
}

function SubjectCard({ subject, onRemove }) {
  return (
    <Card className="mt-2">
      <CardContent>
        <p>{subject.subject}: Average {subject.average}</p>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onRemove}>Remove</Button>
      </CardFooter>
    </Card>
  );
}

function GradeForm({ onSubmit, students, subjects }) {
  const [studentId, setStudentId] = useState(null);
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Grade</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onChange={e => setStudentId(e.target.value)} value={studentId}>
          <SelectItem value={null}>Select Student</SelectItem>
          {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </Select>
        <Select onValueChange={setSubject}>
          {subjects.map(s => <SelectItem key={s.subject} value={s.subject}>{s.subject}</SelectItem>)}
        </Select>
        <Input type="number" placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} className="mt-2" />
      </CardContent>
      <CardFooter>
        <Button onClick={() => { onSubmit(studentId, subject, grade); setStudentId(null); setSubject(''); setGrade(''); }}>Add Grade</Button>
      </CardFooter>
    </Card>
  );
}

function GradeCard({ grade, onRemove }) {
  return (
    <Card className="mt-2">
      <CardContent>
        <p>Student ID: {grade.studentId}, Subject: {grade.subject}, Grade: {grade.grade}</p>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onRemove}>Remove</Button>
      </CardFooter>
    </Card>
  );
}

function PerformanceCard({ grade, subject }) {
  const status = parseFloat(grade.grade) >= parseFloat(subject.average) ? "Approved" : "Reproved";
  return (
    <Card className="mt-2">
      <CardContent>
        <p>Subject: {grade.subject}</p>
        <p>Student Grade: {grade.grade}</p>
        <p>Subject Average: {subject.average}</p>
        <p className={`font-bold ${status === "Approved" ? 'text-green-500' : 'text-red-500'}`}>{status}</p>
      </CardContent>
    </Card>
  );
}