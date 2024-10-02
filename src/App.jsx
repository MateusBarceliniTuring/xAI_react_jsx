// App.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddMedication from "./components/AddMedication";
import MedicationList from "./components/MedicationList";
import History from "./components/History";

export default function App() {
  const [view, setView] = useState('add');

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Medication Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button onClick={() => setView('add')}>Add Medication</Button>
            <Button onClick={() => setView('list')}>View Medications</Button>
            <Button onClick={() => setView('history')}>Alert History</Button>
          </div>
          {view === 'add' && <AddMedication />}
          {view === 'list' && <MedicationList />}
          {view === 'history' && <History />}
        </CardContent>
      </Card>
    </div>
  );
}

// components/AddMedication.jsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function AddMedication() {
  const [medication, setMedication] = useState({ name: '', dosage: '', frequency: 'daily' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save this data to your state or backend
    console.log('Medication added:', medication);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" placeholder="Medication Name" value={medication.name} onChange={(e) => setMedication({...medication, name: e.target.value})} />
      <Input type="text" placeholder="Dosage" value={medication.dosage} onChange={(e) => setMedication({...medication, dosage: e.target.value})} />
      <Select value={medication.frequency} onChange={(val) => setMedication({...medication, frequency: val})}>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
      </Select>
      <Button type="submit" className="mt-4">Add Medication</Button>
    </form>
  );
}

export default AddMedication;

// components/MedicationList.jsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function MedicationList() {
  const medications = [
    // This would be populated from state or API
    { id: 1, name: 'Aspirin', dosage: '100mg', frequency: 'daily' }
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Dosage</TableCell>
          <TableCell>Frequency</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medications.map(med => (
          <TableRow key={med.id}>
            <TableCell>{med.name}</TableCell>
            <TableCell>{med.dosage}</TableCell>
            <TableCell>{med.frequency}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="destructive" className="ml-2">Remove</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default MedicationList;

// components/History.jsx
import React from 'react';
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function History() {
  const historyItems = [
    { id: 1, date: '2023-04-10', medication: 'Aspirin', status: 'Pending' }
  ];

  return (
    <Table>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>Medication</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
      {historyItems.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.date}</TableCell>
          <TableCell>{item.medication}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>
            <Button size="sm" onClick={() => {/* Toggle status */}}>{item.status === 'Pending' ? 'Complete' : 'Undo'}</Button>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

export default History;