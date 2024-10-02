import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Input, 
  Select, 
  SelectItem, 
  Button, 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/ui";

function App() {
  const [medications, setMedications] = useState([]);
  const [activeTab, setActiveTab] = useState('add');
  const [alertHistory, setAlertHistory] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMedication, setEditMedication] = useState(null);

  useEffect(() => {
    medications.forEach(med => {
      const now = new Date();
      const nextAlert = new Date(med.nextAlert);
      if (nextAlert > now) {
        const timer = setTimeout(() => {
          alert(`Time to take ${med.name}`);
          setAlertHistory(prev => [...prev, { ...med, time: new Date(), completed: false }]);
        }, nextAlert - now);
        return () => clearTimeout(timer);
      }
    });
  }, [medications]);

  const handleAddMedication = (newMed) => {
    const nextAlert = calculateNextAlert(newMed);
    setMedications(prev => [...prev, { ...newMed, nextAlert }]);
  };

  const calculateNextAlert = (med) => {
    const now = new Date();
    let next = new Date(now);
    switch (med.frequency) {
      case 'daily': 
        next.setDate(now.getDate() + 1); 
        break;
      case 'weekly': 
        next.setDate(now.getDate() + 7); 
        break;
      case 'monthly': 
        next.setMonth(now.getMonth() + 1); 
        break;
      // Add other cases similarly
    }
    next.setHours(med.time.getHours(), med.time.getMinutes(), 0, 0);
    return next;
  };

  const MedicationForm = ({ onSubmit, initialValues = {} }) => {
    const [name, setName] = useState(initialValues.name || '');
    const [dosage, setDosage] = useState(initialValues.dosage || '');
    const [time, setTime] = useState(initialValues.time || new Date());
    const [frequency, setFrequency] = useState(initialValues.frequency || 'daily');

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, dosage, time, frequency });
      }}>
        <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Medication Name" />
        <Input type="text" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Dosage" />
        <Input type="datetime-local" value={time.toISOString().substr(0, 16)} onChange={e => setTime(new Date(e.target.value))} />
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </Select>
        <Button type="submit">Submit</Button>
      </form>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-lg sm:max-w-md">
        <CardHeader>
          <CardTitle className="text-center bg-blue-500 text-white p-4">Medication Manager</CardTitle>
        </CardHeader>
        <Tabs defaultValue="add" className="w-full">
          <TabsList>
            <TabsTrigger value="add">Add</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            <MedicationForm onSubmit={handleAddMedication} />
          </TabsContent>
          <TabsContent value="list">
            <table className="w-full">
              <thead>
                <tr><th>Name</th><th>Dosage</th><th>Time</th><th></th></tr>
              </thead>
              <tbody>
                {medications.map(med => (
                  <tr key={med.name}>
                    <td>{med.name}</td>
                    <td>{med.dosage}</td>
                    <td>{med.time.toLocaleTimeString()}</td>
                    <td>
                      <Button onClick={() => {setEditMedication(med); setDialogOpen(true);}}>Edit</Button>
                      <Button onClick={() => setMedications(meds => meds.filter(m => m !== med))} className="ml-2">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
          <TabsContent value="history">
            <table className="w-full">
              <thead>
                <tr><th>Name</th><th>Time</th><th>Completed</th></tr>
              </thead>
              <tbody>
                {alertHistory.map((alert, index) => (
                  <tr key={index}>
                    <td>{alert.name}</td>
                    <td>{alert.time.toLocaleTimeString()}</td>
                    <td><Button onClick={() => {
                      const updatedHistory = [...alertHistory];
                      updatedHistory[index].completed = !updatedHistory[index].completed;
                      setAlertHistory(updatedHistory);
                    }}>{alert.completed ? 'Yes' : 'No'}</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Medication</DialogTitle>
            </DialogHeader>
            <MedicationForm onSubmit={(updatedMed) => {
              setMedications(meds => meds.map(m => m === editMedication ? { ...updatedMed, nextAlert: calculateNextAlert(updatedMed) } : m));
              setDialogOpen(false);
            }} initialValues={editMedication} />
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}

export default App;