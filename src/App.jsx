import React, { useState } from 'react';
import { 
    Card, CardContent, CardHeader, CardTitle,
    CardFooter, Button, Input, Label, Select, SelectItem
} from "@/components/ui";

// Constants for BMR calculation
const ACTIVITY_LEVELS = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    extraActive: 1.9
};

const App = () => {
    const [formData, setFormData] = useState({
        weight: '', height: '', age: '', gender: 'male', activity: 'sedentary'
    });
    const [results, setResults] = useState({ bmi: null, bmr: null });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.weight) tempErrors.weight = "Weight is required";
        if (!formData.height) tempErrors.height = "Height is required";
        if (!formData.age) tempErrors.age = "Age is required";
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
        return (bmr * ACTIVITY_LEVELS[activity]).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const bmi = calculateBMI();
            const bmr = calculateBMR();
            setResults({ bmi, bmr });
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
                                <Input type="number" name="weight" value={formData.weight} onChange={handleChange} label="Weight (kg)" error={errors.weight} />
                                <Input type="number" name="height" value={formData.height} onChange={handleChange} label="Height (cm)" error={errors.height} />
                                <Input type="number" name="age" value={formData.age} onChange={handleChange} label="Age" error={errors.age} />
                                <Select name="gender" value={formData.gender} onChange={handleChange}>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </Select>
                                <Select name="activity" value={formData.activity} onChange={handleChange}>
                                    {Object.entries(ACTIVITY_LEVELS).map(([key, value]) => 
                                        <SelectItem key={key} value={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</SelectItem>
                                    )}
                                </Select>
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
                        {results.bmi === null ? 
                            "No results" : 
                            <>
                                <p>BMI: {results.bmi}</p>
                                <p>BMR: {results.bmr} calories/day</p>
                            </>
                    </CardContent>
                </Card>

                {/* BMI Categories Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>BMI Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left">BMI Range</th>
                                    <th className="text-left">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Below 18.5</td><td>Underweight</td></tr>
                                <tr><td>18.5 - 24.9</td><td>Normal Weight</td></tr>
                                <tr><td>25 - 29.9</td><td>Overweight</td></tr>
                                <tr><td>30 and Above</td><td>Obese</td></tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default App;