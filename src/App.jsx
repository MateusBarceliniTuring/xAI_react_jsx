import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

// Mini Card Component
const MiniCard = ({ title, value, percentage }) => {
  let bgColor = 'bg-green-500';
  if (percentage < 50) bgColor = 'bg-red-500';
  else if (percentage < 75) bgColor = 'bg-orange-500';

  return (
    <div className={`p-4 m-2 shadow-lg rounded-lg ${bgColor}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-lg">{value}</p>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', age: 20, height: 170, weight: 60, calorieGoal: 2000, workoutGoal: 60 });
  const [daily, setDaily] = useState({ calories: 0, workoutTime: 0 });
  const [submitted, setSubmitted] = useState(false);

  // Validation and form submission logic would go here
  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type === 'profile') {
      // Validate profile form
    } else if (type === 'daily') {
      setSubmitted(true);
    }
  };

  const calculatePercentage = (done, goal) => {
    return ((done / goal) * 100).toFixed(2);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[80%] max-h-[80vh] shadow-xl">
        <CardHeader className="bg-blue-500 text-white text-center">
          <CardTitle>Health Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="daily">Daily Update</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <form onSubmit={(e) => handleSubmit(e, 'profile')}>
                <Input type="text" placeholder="Full Name" required value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                <Slider min={1} max={100} value={[profile.age]} onValueChange={(value) => setProfile({...profile, age: value[0]})} label="Age" />
                {/* Similar inputs for height, weight, etc. */}
                <Button type="submit">Submit Profile</Button>
              </form>
            </TabsContent>
            <TabsContent value="daily">
              <form onSubmit={(e) => handleSubmit(e, 'daily')}>
                <Input type="number" placeholder="Calories Consumed" required value={daily.calories} onChange={(e) => setDaily({...daily, calories: e.target.value})} />
                <Input type="number" placeholder="Workout Time (minutes)" required value={daily.workoutTime} onChange={(e) => setDaily({...daily, workoutTime: e.target.value})} />
                <Button type="submit">Update Daily Stats</Button>
              </form>
              {submitted && (
                <div className="mt-4">
                  <div className="flex flex-wrap justify-center">
                    <MiniCard title="Calorie Goal" value={`${calculatePercentage(daily.calories, profile.calorieGoal)}%`} percentage={calculatePercentage(daily.calories, profile.calorieGoal)} />
                    <MiniCard title="Workout Goal" value={`${calculatePercentage(daily.workoutTime, profile.workoutGoal)}%`} percentage={calculatePercentage(daily.workoutTime, profile.workoutGoal)} />
                    <MiniCard title="Total Calories" value={`${daily.calories} cal`} />
                    <MiniCard title="Total Workout Time" value={`${daily.workoutTime} min`} />
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