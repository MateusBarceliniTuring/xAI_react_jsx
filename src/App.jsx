import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function App() {
  const [medications, setMedications] = useState([]);
  const [historic, setHistoric] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMedication, setEditMedication] = useState(null);
  let lastId = 1;

  const frequencyList = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    weekDays: 'Week Days',
    weekendDays: 'Weekend Days',
    oneShot: 'One Shot'
  };

  const getFormattedDateTime = (dateTime) => {
    const date = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${date}/${month}/${year} ${hour}:${minutes}`;
  }

  const handleAddMedication = (newMed) => {
    newMed.id = (medications.length <= 0 ? 0 : medications[medications.length - 1].id) + 1;
    setMedications(prev => [...prev, newMed]);
    generateHistoric(newMed);
  };

  const generateHistoric = (med) => {
    const filtered = historic.filter(item => item.medicationId !== med.id);
    setHistoric(filtered);

    const addToHistoric = (date) => {
      const newDate = new Date(date);
      setHistoric(prev => [...prev, {
        medicationId: med.id,
        medicationName: med.name,
        medicationDosage: med.dosage,
        completed: false,
        time: newDate
      }]);
    };

    let nextDate = new Date(med.time);
    switch (med.frequency) {
      case 'daily':
        for (let i = 0; i < 3; i++) {
          addToHistoric(nextDate);
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
      case 'weekly':
        for (let i = 0; i < 3; i++) {
          addToHistoric(nextDate);
          nextDate.setDate(nextDate.getDate() + 7);
        }
        break;
      case 'monthly':
        for (let i = 0; i < 3; i++) {
          addToHistoric(nextDate);
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        break;
      case 'weekDays':
        for (let i = 0; i < 7; i++) {
          if (nextDate.getDay() !== 0 && nextDate.getDay() !== 6) {
            addToHistoric(nextDate);
          }
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
      case 'weekendDays':
        for (let i = 0; i < 7; i++) {
          if (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
            addToHistoric(nextDate);
          }
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
      case 'oneShot':
        addToHistoric(nextDate);
        break;
    }
  };

  const MedicationForm = ({ onSubmit, initialValues = {} }) => {
    const [id, setId] = useState(initialValues.id || '');
    const [name, setName] = useState(initialValues.name || '');
    const [dosage, setDosage] = useState(initialValues.dosage || '');
    const [time, setTime] = useState(initialValues.time || new Date());
    const [frequency, setFrequency] = useState(initialValues.frequency || 'daily');

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ id, name, dosage, time, frequency });
      }}>
        <Label>Medication Name</Label>
        <Input className="mb-5"
          onChange={e => setName(e.target.value)}
          placeholder="Medication Name"
          type="text"
          value={name} />

        <Label>Dosage</Label>
        <Input className="mb-5"
          onChange={e => setDosage(e.target.value)}
          placeholder="Dosage"
          type="text"
          value={dosage} />

        <Label>Start Date/Time</Label>
        <Input className="mb-5"
          onChange={e => setTime(new Date(e.target.value))}
          type="datetime-local"
          value={time.toISOString().substr(0, 16)} />

        <Label>Frequency</Label>
        <Select onValueChange={setFrequency} value={frequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select a frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekDays">Week Days</SelectItem>
            <SelectItem value="weekendDays">Weekend Days</SelectItem>
            <SelectItem value="oneShot">One Shot</SelectItem>
          </SelectContent>
        </Select>

        <Button className="mt-5" type="submit">Submit</Button>
      </form>
    );
  };

  const AddedList = () => {
    return (
      <div className="h-96 overflow-y-auto">
        <Table>
          <TableCaption>A list of added medication.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.dosage}</TableCell>
                <TableCell>{getFormattedDateTime(item.time)}</TableCell>
                <TableCell>{frequencyList[item.frequency]}</TableCell>
                <TableCell className="text-center">
                  <p><Button variant="link" onClick={() => { setEditMedication(item); setDialogOpen(true); }}>Edit</Button></p>
                  <p><Button variant="link" onClick={() => setMedications(meds => meds.filter(m => m !== item))}>Remove</Button></p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  const HistoryList = () => {
    return (
      <div className="h-96 overflow-y-auto">
        <Table>
          <TableCaption>A list of historic medication alerts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historic.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.medicationName}</TableCell>
                <TableCell>{item.medicationDosage}</TableCell>
                <TableCell>{getFormattedDateTime(item.time)}</TableCell>
                <TableCell className="text-center">{item.completed
                  ? 'Yes'
                  : <Button variant="link"
                          onClick={() => {
                            const updatedHistory = [...historic];
                            updatedHistory[index].completed = !updatedHistory[index].completed;
                            setHistoric(updatedHistory);
                    }}>
                      Mark as done
                    </Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-4/5 mx-auto">
        <CardHeader className="bg-blue-500 text-white rounded">
          <CardTitle className="text-center">Medication Manager</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="mt-5">
              <TabsTrigger value="add">New</TabsTrigger>
              <TabsTrigger value="list">Added</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="add">
              <MedicationForm onSubmit={handleAddMedication} />
            </TabsContent>

            <TabsContent value="list">
              <AddedList />
            </TabsContent>

            <TabsContent value="history">
              <HistoryList />
            </TabsContent>
          </Tabs>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Medication</DialogTitle>
              </DialogHeader>
              <MedicationForm onSubmit={(updatedMed) => {
                setMedications(meds => meds.map(m => m === editMedication ? updatedMed : m));
                generateHistoric(updatedMed);
                setDialogOpen(false);
              }} initialValues={editMedication} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;