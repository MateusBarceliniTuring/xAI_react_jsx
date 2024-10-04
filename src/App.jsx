import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTask, setDialogTask] = useState({ title: '', id: null });
  const [activeTab, setActiveTab] = useState('todo');

  const openDialog = (task = { title: '', id: null }) => {
    setDialogTask(task);
    setDialogOpen(true);
  };

  const handleAddEditTask = (title) => {
    if (!title.trim()) return;
    if (dialogTask.id === null) {
      setTasks([...tasks, { id: Date.now(), title }]);
    } else {
      setTasks(tasks.map(t => t.id === dialogTask.id ? { ...t, title } : t));
    }
    setDialogOpen(false);
  };

  const removeTask = (id, fromDone = false) => {
    if (fromDone) {
      setDoneTasks(doneTasks.filter(t => t.id !== id));
    } else {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const markDone = (task) => {
    setDoneTasks([...doneTasks, { ...task, doneDate: new Date().toISOString() }]);
    removeTask(task.id);
  };

  const Task = ({ task, onRemove, onEdit, onDone, isDone = false }) => (
    <Card className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value={task.id}>
          <AccordionTrigger>{task.title}</AccordionTrigger>
          <AccordionContent>
            {!isDone && (
              <>
                <Button onClick={() => onEdit(task)}>Edit</Button>
                <Button className="ml-2" onClick={() => onDone(task)}>Done</Button>
              </>
            )}
            <Button className="mt-2 ml-2" variant="destructive" onClick={() => onRemove(task.id, isDone)}>Remove</Button>
            {isDone && <p>Completed on: {new Date(task.doneDate).toLocaleDateString()}</p>}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        <TabsContent value="todo">
          <Button onClick={() => openDialog()}>Add Task</Button>
          {tasks.map(task => (
            <Task 
              key={task.id} 
              task={task} 
              onRemove={removeTask} 
              onEdit={openDialog} 
              onDone={markDone} />
          ))}
        </TabsContent>
        <TabsContent value="done">
          {doneTasks.map(task => (
            <Task 
              key={task.id} 
              task={task} 
              onRemove={removeTask} 
              isDone={true} />
          ))}
        </TabsContent>
      </Tabs>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTask.id ? 'Edit Task' : 'Add Task'}</DialogTitle>
          </DialogHeader>
          <Input 
            value={dialogTask.title} 
            onChange={(e) => setDialogTask({ ...dialogTask, title: e.target.value.slice(0, 20) })} 
            placeholder="Enter task (max 20 chars)" 
            className="mb-4" />
          <DialogFooter>
            <Button type="submit" onClick={() => handleAddEditTask(dialogTask.title)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}