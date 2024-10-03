import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function App() {
  const [formData, setFormData] = useState({
    name: '', age: 25, height: 170, weight: 70, calorieGoal: 2000, workoutGoal: 60
  });
  const [dailyData, setDailyData] = useState({ calories: 0, workoutTime: 0 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type === 'profile') {
      setSubmitted(true);
    }
    // Here you would typically send data to a server
  };

  const calculatePercentage = (part, whole) => {
    return whole > 0 ? (part / whole * 100).toFixed(2) : 0;
  };

  const getColor = (percentage) => {
    if (percentage < 50) return 'red';
    if (percentage < 75) return 'orange';
    return 'green';
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[80%] max-h-[80vh] shadow-xl">
        <CardHeader>
          <CardTitle className="text-center bg-blue-600 text-white">Health Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="daily">Daily Track</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <form onSubmit={(e) => handleSubmit(e, 'profile')} className="space-y-4">
                <Input 
                  label="Full Name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
                <Slider 
                  label="Age" 
                  value={[formData.age]} 
                  onValueChange={(value) => setFormData({...formData, age: value[0]})} 
                  max={100} 
                  className="w-full"
                />
                {/* Repeat similar Slider components for height and weight */}
                <Button type="submit">Submit Profile</Button>
              </form>
            </TabsContent>
            <TabsContent value="daily">
              <form onSubmit={(e) => handleSubmit(e, 'daily')} className="space-y-4">
                <Input 
                  label="Calories Consumed" 
                  type="number" 
                  value={dailyData.calories} 
                  onChange={(e) => setDailyData({...dailyData, calories: e.target.value})} 
                  required 
                />
                <Input 
                  label="Workout Time (min)" 
                  type="number" 
                  value={dailyData.workoutTime} 
                  onChange={(e) => setDailyData({...dailyData, workoutTime: e.target.value})} 
                  required 
                />
                <Button type="submit">Track Day</Button>
              </form>
              {submitted && (
                <div className="mt-4 space-y-4">
                  <hr className="my-4"/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Calorie Goal', 'Workout Time', 'Total Calories', 'Total Workout'].map((title, index) => (
                      <div key={index} className={`p-4 rounded-lg shadow-md bg-white`}>
                        <h3 className="text-sm font-semibold">{title}</h3>
                        <p className={`text-lg ${index < 2 ? `text-${getColor(calculatePercentage(index ? dailyData.workoutTime : dailyData.calories, index ? formData.workoutGoal : formData.calorieGoal))}-500` : ''}`}>
                          {index < 2 ? `${calculatePercentage(index ? dailyData.workoutTime : dailyData.calories, index ? formData.workoutGoal : formData.calorieGoal)}%` : 
                          (index % 2 ? `${dailyData.workoutTime} min` : `${dailyData.calories} cal`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}