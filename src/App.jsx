import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Header = () => <h1 className="text-2xl font-bold mb-4">Task Manager</h1>;

function TaskForm({ onSubmit, initialValue = "" }) {
  const [task, setTask] = useState(initialValue);
  const handleSubmit = () => {
    if (task.trim().length > 0 && task.length <= 20) {
      onSubmit(task);
      setTask("");
    }
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValue ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <Input 
          value={task} 
          onChange={(e) => setTask(e.target.value.slice(0, 20))} 
          placeholder="Enter task here" 
          maxLength={20}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskItem({ task, onEdit, onRemove, onDone }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`item-${task.id}`}>
        <AccordionTrigger>{task.text}</AccordionTrigger>
        <AccordionContent>
          <Button onClick={() => onEdit(task)}>Edit</Button>
          <Button onClick={() => onRemove(task)} className="ml-2">Remove</Button>
          <Button onClick={() => onDone(task)} className="ml-2">Done</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function CompletedTaskItem({ task }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`completed-${task.id}`}>
        <AccordionTrigger>{task.text}</AccordionTrigger>
        <AccordionContent>
          Completed on: {new Date(task.completedOn).toLocaleDateString()}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    setOpen(false);
  };

  const editTask = (task, newText) => {
    setTasks(tasks.map(t => t.id === task.id ? { ...t, text: newText } : t));
    setOpen(false);
  };

  const removeTask = (task) => setTasks(tasks.filter(t => t.id !== task.id));
  const markDone = (task) => {
    setCompletedTasks([...completedTasks, { ...task, completedOn: Date.now() }]);
    removeTask(task);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Header />
      <Tabs defaultValue="active" className="mb-4">
        <TabsList>
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Button onClick={() => setOpen(true)}>Add Task</Button>
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={(t) => { setOpen(true); setEditTask(t); }}
              onRemove={removeTask}
              onDone={markDone}
            />
          ))}
        </TabsContent>
        <TabsContent value="completed">
          {completedTasks.map(task => (
            <CompletedTaskItem key={task.id} task={task} />
          ))}
        </TabsContent>
      </Tabs>
      <TaskForm 
        onSubmit={activeTask => activeTask ? editTask(activeTask, activeTask.text) : addTask(activeTask)}
        initialValue={activeTask ? activeTask.text : ""}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}