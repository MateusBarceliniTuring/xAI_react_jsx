// App.jsx
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const subjects = ['Math', 'English', 'History', 'Geography', 'Science', 'Arts', 'Sports'];

function App() {
  const [students, setStudents] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState({});
  const [grades, setGrades] = useState({});

  const addStudent = (name, studentClass) => {
    setStudents(prev => [...prev, { name, class: studentClass, id: Date.now() }]);
  };

  const removeItem = (list, setList, id) => {
    setList(list.filter(item => item.id !== id));
  };

  const addSubjectAverage = (subject, average) => {
    setSubjectAverages(prev => ({ ...prev, [subject]: average }));
  };

  const addGrade = (studentId, subject, grade) => {
    setGrades(prev => ({ ...prev, [studentId]: { ...prev[studentId], [subject]: grade } }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 fixed w-full z-10">
        <h1 className="text-2xl font-bold">School Management System</h1>
      </div>
      <div className="pt-20 p-4">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="bg-amber-100">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <StudentForm onSubmit={addStudent} />
            <StudentList students={students} onDelete={(id) => removeItem(students, setStudents, id)} />
          </TabsContent>
          <TabsContent value="subjects">
            <SubjectForm onSubmit={addSubjectAverage} subjects={subjects} />
            <SubjectList averages={subjectAverages} onDelete={(subject) => removeItem(subjectAverages, setSubjectAverages, subject)} />
          </TabsContent>
          <TabsContent value="grades">
            <GradeForm onSubmit={addGrade} students={students} subjects={Object.keys(subjectAverages)} />
            <GradeList grades={grades} students={students} subjects={subjects} onDelete={(studentId, subject) => {
              setGrades(prev => {
                const { [studentId]: omit, ...rest } = prev;
                return { ...rest, [studentId]: omit && Object.fromEntries(Object.entries(omit).filter(([k]) => k !== subject)) };
              });
            }} />
          </TabsContent>
          <TabsContent value="performance">
            <Performance students={students} grades={grades} subjectAverages={subjectAverages} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Sub-components like StudentForm, StudentList, etc. would follow here

export default App;