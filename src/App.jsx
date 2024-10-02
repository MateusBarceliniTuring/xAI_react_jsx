import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";

export default function App() {
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  const FrequencyOptions = ['daily', 'weekly', 'monthly', 'weekdays', 'weekends', 'once'];

  const addMedication = (medication) => {
    setMedications([...medications, { ...medication, id: Date.now() }]);
  };

  const deleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const editMedication = (updatedMedication) => {
    setMedications(medications.map(med => med.id === updatedMedication.id ? updatedMedication : med));
    setEditModalOpen(false);
  };

  useEffect(() => {
    // This is a simplified alert system for demonstration
    medications.forEach(med => {
      if (med.frequency !== 'once') return;
      const timeUntilAlert = new Date(med.startDate).getTime() - Date.now();
      if (timeUntilAlert > 0) {
        setTimeout(() => {
          alert(`Time to take ${med.name}`);
          setHistory(prev => [...prev, { medication: med.name, time: new Date(), completed: false }]);
        }, timeUntilAlert);
      }
    });
  }, [medications]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Medication Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddForm(!showAddForm)}>Add Medication</Button>
            <Button onClick={() => setEditModalOpen(true)}>View Medications</Button>
            <Button>View History</Button>
          </div>
          {showAddForm && <AddMedicationForm onSubmit={addMedication} />}
          <MedicationTable medications={medications} onDelete={deleteMedication} onEdit={setEditingMedication} />
          <HistoryTable history={history} />
        </CardContent>
      </Card>
      <EditMedicationModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        medication={editingMedication} 
        onSave={editMedication}
      />
    </div>
  );
}

function AddMedicationForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', dosage: '', time: '', frequency: 'daily', startDate: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', dosage: '', time: '', frequency: 'daily', startDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Medication Name" />
      <Input type="text" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} placeholder="Dosage" />
      <Input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
      <Select value={form.frequency} onChange={value => setForm({...form, frequency: value})}>
        {FrequencyOptions.map(freq => <SelectItem key={freq} value={freq}>{freq}</SelectItem>)}
      </Select>
      <Input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
      <Button type="submit">Add</Button>
    </form>
  );
}

function MedicationTable({ medications, onDelete, onEdit }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medications.map(med => (
          <TableRow key={med.id}>
            <TableCell>{med.name}</TableCell>
            <TableCell>{med.dosage}</TableCell>
            <TableCell>{med.time}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(med)}>Edit</Button>
              <Button onClick={() => onDelete(med.id)} className="ml-2">Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function HistoryTable({ history }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Completed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((entry, index) => (
          <TableRow key={index}>
            <TableCell>{entry.medication}</TableCell>
            <TableCell>{entry.time.toLocaleString()}</TableCell>
            <TableCell><Button>Mark as Done</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EditMedicationModal({ isOpen, onClose, medication, onSave }) {
  const [form, setForm] = useState(medication || { name: '', dosage: '', time: '', frequency: 'daily', startDate: '' });

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Edit Medication</ModalHeader>
        <ModalBody>
          <AddMedicationForm onSubmit={handleSave} initialValues={form} setForm={setForm} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}