import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [taskInput, setTaskInput] = useState('');

  const openDialog = (task = null) => {
    setEditTask(task);
    setTaskInput(task ? task.title : '');
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setEditTask(null);
    setTaskInput('');
  };

  const addTask = () => {
    if (taskInput.trim() && taskInput.length <= 20) {
      if (editTask) {
        setTasks(tasks.map(t => t.id === editTask.id ? { ...t, title: taskInput } : t));
      } else {
        setTasks([...tasks, { id: Date.now(), title: taskInput, done: false }]);
      }
      closeDialog();
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const markAsDone = (task) => {
    setDoneTasks([...doneTasks, { ...task, doneDate: new Date().toLocaleString() }]);
    removeTask(task.id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold p-4 text-white bg-amber-600 w-full">Task Manager</h1>
      <div className="container mx-auto p-4">
        <Tabs defaultValue="todo" className="w-full">
          <TabsList>
            <TabsTrigger value="todo">To-Do</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
          <TabsContent value="todo">
            <Card>
              <CardHeader>
                <CardTitle>TO-DO List</CardTitle>
                <CardDescription>Add, edit, remove or mark as done.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => openDialog()} className="mb-4 bg-amber-500">Add Task</Button>
                {tasks.map(task => (
                  <TaskAccordion
                    key={task.id}
                    task={task}
                    onEdit={openDialog}
                    onRemove={removeTask}
                    onDone={markAsDone}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="done">
            <Card>
              <CardHeader>
                <CardTitle>TO-DO List</CardTitle>
                <CardDescription>Check done tasks.</CardDescription>
              </CardHeader>
              <CardContent>
                {doneTasks.map(task => (
                  <TaskAccordion
                    key={task.id}
                    task={task}
                    showDate={true}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <TaskDialog
          isOpen={isOpen}
          onClose={closeDialog}
          onSave={addTask}
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          isEdit={!!editTask}
        />
      </div>
    </div>
  );
}

function TaskAccordion({ task, onEdit, onRemove, onDone, showDate = false }) {
  return (
    <Accordion type="single" collapsible className="mb-2">
      <AccordionItem value={`item-${task.id}`}>
        <AccordionTrigger>{task.title}</AccordionTrigger>
        <AccordionContent>
          {showDate && <p>Completed on: {task.doneDate}</p>}
          {!showDate && <Button className="bg-amber-500" onClick={() => onEdit(task)} variant="outline">Edit</Button>}
          {!showDate && <Button onClick={() => onRemove(task.id)} variant="destructive" className="ml-2">Remove</Button>}
          {!showDate && <Button onClick={() => onDone(task)} className="ml-2">Done</Button>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function TaskDialog({ isOpen, onClose, onSave, value, onChange, isEdit }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <Input
          value={value}
          onChange={onChange}
          placeholder="Enter task (max 20 characters)"
          maxLength={20}
          required
        />
        <DialogFooter>
          <Button type="submit" onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default App;