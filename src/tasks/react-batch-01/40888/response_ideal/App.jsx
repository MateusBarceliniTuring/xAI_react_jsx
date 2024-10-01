import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

// Constants for BMR calculation
const ACTIVITY_LEVELS = {
    sedentary: {value: 1.2, name: 'Sedentary (little or no exercise)'},
    lightlyActive: {value: 1.375, name: 'Lightly active (exercise/sports 1-3 days/week)'},
    moderatelyActive: {value: 1.55, name: 'Moderately active (exercise/sports 3-5 days/week)'},
    veryActive: {value: 1.725, name: 'Very active (exercise/sports 6-7 days a week)'},
    extraActive: {value: 1.9, name: 'Extra active (exercise/physical job or training twice a day)'}
};

const App = () => {
    const [formData, setFormData] = useState({
        weight: '', height: '', age: '', gender: 'male', activity: 'sedentary'
    });
    const [results, setResults] = useState({ bmi: null, bmr: null, dailyCalories: null, carbsGrams: null });
    const [errors, setErrors] = useState({ weight: '', height: '', age: '', gender: '', activity: ''});

    const handleChangeGender = (e) => {
        setFormData(prev => ({...prev, gender: e}));
    }

    const handleChangeActivity = (e) => {
        setFormData(prev => ({...prev, activity: e}));
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateForm(name);
    };

    const validateForm = (name) => {
        let tempErrors = {};
        if ((!name || name == 'weight') && !formData.weight) tempErrors.weight = "Weight is required";
        if ((!name || name == 'height') && !formData.height) tempErrors.height = "Height is required";
        if ((!name || name == 'age') && !formData.age) tempErrors.age = "Age is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const calculateBMI = () => {
        const heightInMeters = formData.height / 100;
        return (formData.weight / (heightInMeters * heightInMeters)).toFixed(2);
    };

    const calculateBMR = () => {
        const { weight, height, age, gender, activity } = formData;
        let bmr = gender === 'male' 
            ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
            : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        return (bmr * ACTIVITY_LEVELS[activity].value).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm(null)) {
            const { activity } = formData;
            const bmi = calculateBMI();
            const bmr = calculateBMR();

            // Daily calorie needs based on activity level
            const dailyCalories = (bmr * ACTIVITY_LEVELS[activity].value).toFixed(2);

            // Carbs recommendation (assuming 50% of daily calories from carbs)
            const carbsGrams = ((dailyCalories * 0.5) / 4).toFixed(2); // 4 calories per gram of carbs

            setResults({ bmi, bmr, dailyCalories, carbsGrams });
        }
    };

    return (
        <div className="dark bg-gray-900 min-h-screen p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-center text-white mb-8">BMI & BMR Calculator</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Input Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input id="weight" type="number" name="weight" value={formData.weight} onChange={handleChangeInput} label="Weight (kg)" />
                                    <Label className="text-red-600">{errors.weight}</Label>
                                </div>
                                
                                <div>
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input id="height" type="number" name="height" value={formData.height} onChange={handleChangeInput} label="Height (cm)" error={errors.height} />
                                    <Label className="text-red-600">{errors.height}</Label>
                                </div>
                                
                                <div>
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" type="number" name="age" value={formData.age} onChange={handleChangeInput} label="Age" error={errors.age} />
                                    <Label className="text-red-600">{errors.age}</Label>
                                </div>

                                <div>
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select id="gender" name="gender" onValueChange={handleChangeGender} defaultValue={formData.gender}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="activity">Activity Level</Label>
                                    <Select id="activity" name="activity" onValueChange={handleChangeActivity} defaultValue={formData.activity}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an activity level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(ACTIVITY_LEVELS).map(([key, value]) => 
                                                <SelectItem key={key} value={key}>{value.name}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="mt-4 w-full">Calculate</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            results.bmi === null ? 
                                "No results" : 
                                <>
                                    <p>BMI: {results.bmi}</p>
                                    <p>BMR: {results.bmr} calories/day</p>
                                    <p>Daily Caloric Needs: {results.dailyCalories} calories</p>
                                    <p>Recommended Daily Carbs: {results.carbsGrams} grams</p>
                                </>
                        }
                    </CardContent>
                </Card>

                {/* BMI Categories Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>BMI Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>BMI Range</TableHead>
                                    <TableHead>Category</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Below 18.5</TableCell>
                                    <TableCell>Underweight</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>18.5 - 24.9</TableCell>
                                    <TableCell>Normal Weight</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>25 - 29.9</TableCell>
                                    <TableCell>Overweight</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>30 and Above</TableCell>
                                    <TableCell>Obese</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default App;