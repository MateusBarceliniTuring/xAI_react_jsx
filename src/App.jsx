import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddMedicationForm from './components/AddMedicationForm';
import MedicationList from './components/MedicationList';
import History from './components/History';

export default function App() {
  const [tab, setTab] = useState('add');
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);

  const tabs = [
    { name: 'Add Medication', value: 'add' },
    { name: 'Medications', value: 'list' },
    { name: 'History', value: 'history' }
  ];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center bg-blue-500 text-white py-2 rounded-t">Medication Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-around">
            {tabs.map(t => (
              <button 
                key={t.value} 
                onClick={() => setTab(t.value)}
                className={`px-4 py-2 ${tab === t.value ? 'bg-blue-200' : 'bg-gray-200'} rounded`}
              >
                {t.name}
              </button>
            ))}
          </div>
          {tab === 'add' && <AddMedicationForm setMedications={setMedications} />}
          {tab === 'list' && <MedicationList medications={medications} setMedications={setMedications} />}
          {tab === 'history' && <History history={history} />}
        </CardContent>
      </Card>
    </div>
  );
}

// AddMedicationForm.jsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

function AddMedicationForm({ setMedications }) {
  const [medication, setMedication] = useState({ name: '', dosage: '', frequency: 'daily' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (medication.name && medication.dosage) {
      setMedications(prev => [...prev, { ...medication, id: Date.now() }]);
      setMedication({ name: '', dosage: '', frequency: 'daily' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        type="text" 
        placeholder="Medication Name" 
        value={medication.name}
        onChange={(e) => setMedication({...medication, name: e.target.value})}
        className="mb-2"
      />
      <Input 
        type="text" 
        placeholder="Dosage" 
        value={medication.dosage}
        onChange={(e) => setMedication({...medication, dosage: e.target.value})}
        className="mb-2"
      />
      <Select value={medication.frequency} onChange={(e) => setMedication({...medication, frequency: e.target.value})}>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        {/* Add other frequency options similarly */}
      </Select>
      <button type="submit" className="mt-4 bg-blue-500 text-white w-full py-2 rounded">Add Medication</button>
    </form>
  );
}

// Continue with similar structures for MedicationList and History components...
