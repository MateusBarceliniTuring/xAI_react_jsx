import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { format } from 'date-fns';

// Main App Component
export default function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <MedicationCard />
    </div>
  );
}

function MedicationCard() {
  const [view, setView] = useState('default');

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Medication Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {view === 'default' && (
          <>
            <Button onClick={() => setView('add')}>Add Medication</Button>
            <Button onClick={() => setView('list')}>View Medications</Button>
            <Button onClick={() => setView('history')}>View History</Button>
          </>
        )}
        {view === 'add' && <AddMedication onCancel={() => setView('default')} />}
        {view === 'list' && <MedicationList onBack={() => setView('default')} />}
        {view === 'history' && <HistoryList onBack={() => setView('default')} />}
      </CardContent>
    </Card>
  );
}

// Add Medication Component
function AddMedication({ onCancel }) {
  const [medication, setMedication] = useState({ name: '', dosage: '', time: '', startDate: '', frequency: 'daily' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save this data to state or server
    console.log('Medication added:', medication);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="text" placeholder="Medication Name" value={medication.name} onChange={(e) => setMedication({...medication, name: e.target.value})} />
      <Input type="text" placeholder="Dosage" value={medication.dosage} onChange={(e) => setMedication({...medication, dosage: e.target.value})} />
      <Input type="time" value={medication.time} onChange={(e) => setMedication({...medication, time: e.target.value})} />
      <Input type="date" value={medication.startDate} onChange={(e) => setMedication({...medication, startDate: e.target.value})} />
      <Select value={medication.frequency} onValueChange={(value) => setMedication({...medication, frequency: value})}>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
      </Select>
      <div className="flex justify-between">
        <Button type="submit">Save</Button>
        <Button variant="destructive" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// Medication List Component
function MedicationList({ onBack }) {
  // This state would typically come from a context or prop
  const [medications, setMedications] = useState([]);

  const handleRemove = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Dosage</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((med, index) => (
            <TableRow key={index}>
              <TableCell>{med.name}</TableCell>
              <TableCell>{med.dosage}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleRemove(index)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onBack}>Back</Button>
    </div>
  );
}

// History List Component
function HistoryList({ onBack }) {
  const [history, setHistory] = useState([]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Medication</TableCell>
            <TableCell>Completed</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{format(new Date(entry.time), 'PPpp')}</TableCell>
              <TableCell>{entry.medication}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => {/* Toggle completion */}}>Complete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onBack}>Back</Button>
    </div>
  );
}