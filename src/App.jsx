import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator"

export default function App() {
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({
    name: '',
    age: null,
    height: null,
    weight: null,
    calorieGoal: null,
    workoutGoal: null
  });

  const [daily, setDaily] = useState([]);

  const calculatePercentage = (done, goal) => {
    return ((done / goal) * 100).toFixed(0);
  };

  const handleProfileForm = (newForm) => {
    newForm.calorieGoal = parseInt(newForm.calorieGoal);
    newForm.workoutGoal = parseInt(newForm.workoutGoal);
    setProfile(newForm);
  };

  const handleDailyUpdateForm = (newForm) => {
    newForm.calorie = parseInt(newForm.calorie);
    newForm.workout = parseInt(newForm.workout);
    setDaily(prev => [...prev, newForm]);
  }

  const TabProfileForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState(34);
    const [height, setHeight] = useState(150);
    const [weight, setWeight] = useState(50);
    const [calorieGoal, setCalorieGoal] = useState(1);
    const [workoutGoal, setWorkoutGoal] = useState(1);

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, age, height, weight, calorieGoal, workoutGoal });
      }}>
        <Label>Name</Label>
        <Input className="mb-5"
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              type="text"
              value={name} />

        <Label>Age: {age}</Label>
        <Slider className="mb-5 mt-3"
              max={100}
              min={1}
              onValueChange={(value) => setAge(value[0])}
              step={1}
              value={[age]} />

        <Label>Height ({height} cm)</Label>
        <Slider className="mb-5 mt-3"
              max={300}
              min={1}
              onValueChange={(value) => setHeight(value[0])}
              step={1}
              value={[height]} />

        <Label>Weight ({weight} kg)</Label>
        <Slider className="mb-5 mt-3"
              max={200}
              min={1}
              onValueChange={(value) => setWeight(value[0])}
              step={1}
              value={[weight]} />
        
        <div className='flex'>
          <div className='mr-5'>
            <Label>Calorie Goal</Label>
            <Input onChange={(e) => setCalorieGoal(e.target.value)}
                  placeholder="Calorie goal"
                  required
                  type="number"
                  value={calorieGoal} />
          </div>

          <div className='ml-5'>
            <Label>Workout Goal (min)</Label>
            <Input onChange={(e) => setWorkoutGoal(e.target.value)}
                  placeholder="Workout time goal"
                  required
                  type="number"
                  value={workoutGoal} />
          </div>
        </div>

        <Button className="mt-5" type="submit">Submit Profile</Button>
      </form>
    );
  }

  const TabDailyUpdate = () => {
    const [calorie, setCalorie] = useState(0);
    const [workout, setWorkout] = useState(0);

    return (
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleDailyUpdateForm({ calorie, workout });
        }}>
          <div className='flex'>
            <div className='mr-5'>
              <Label>Calorie</Label>
              <Input onChange={(e) => setCalorie(e.target.value)}
                    placeholder="Calorie"
                    required
                    type="number"
                    value={calorie} />
            </div>

            <div className='ml-5'>
              <Label>Workout (min)</Label>
              <Input onChange={(e) => setWorkout(e.target.value)}
                    placeholder="Workout time"
                    required
                    type="number"
                    value={workout} />
            </div>
          </div>

          <Button className="mt-5" type="submit">Add Consumed Values</Button>
        </form>

        <Separator className="mt-5 mb-5" />

        <div className="mt-4">
          <div className="flex flex-wrap justify-between">
            <MiniCard title="Calorie Goal" type="calorie" />
            <MiniCard title="Workout Goal" type="workout" />
            <MiniCard title="Total Calories" type="calorie" isTotal={true} />
            <MiniCard title="Total Workout Time" type="workout" isTotal={true} />
          </div>
        </div>
      </div>
    );
  }

  const MiniCard = ({ title, type, isTotal }) => {
    let value = 0, goal = 0, sufix = '';

    if (type == 'calorie') {
      value = daily.reduce((a,c) => a + c.calorie, 0);
      goal = profile.calorieGoal || 0;
      sufix = 'cal';
    } else if (type == 'workout') {
      value = daily.reduce((a,c) => a + c.workout, 0);
      goal = profile.workoutGoal || 0;
      sufix = 'min';
    }

    let bgColor = '';
    if (!isTotal) {
      const percentage = calculatePercentage(value, goal);
      bgColor = 'bg-green-500';
      if (percentage < 50) bgColor = 'bg-red-500';
      else if (percentage < 75) bgColor = 'bg-orange-500';

      value = `${percentage} %`
    } else {
      value = `${value} ${sufix}`
    }

    return (
      <div className={`w-[40%] max-h-[40vh] p-4 m-3 shadow-lg rounded-lg ${bgColor} flex flex-col justify-center items-center text-center`}>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-lg">{value}</p>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[80%] max-h-[80vh] shadow-xl">
        <CardHeader className="bg-blue-500 text-white text-center rounded">
          <CardTitle>Health Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="profile" value={tab} onValueChange={setTab}>
            <TabsList className="mt-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="daily">Daily Update</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <TabProfileForm onSubmit={handleProfileForm} />
            </TabsContent>

            <TabsContent value="daily">
              <TabDailyUpdate />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}