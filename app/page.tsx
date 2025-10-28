"use client";

import { InputWithLabel } from "./components/InputWithLabel";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [monthlySalary, setMonthlySalary] = useState("10000");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [annualBonus, setAnnualBonus] = useState("30000");
  const [startHour, setStartHour] = useState("9"); // Default to 9 AM

  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cumulativeSalary, setCumulativeSalary] = useState(0);
  const [beatenCount, setBeatenCount] = useState("1,765,442,031");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const salaryNum = parseFloat(monthlySalary);
    const startHourNum = parseInt(startHour, 10);
    const daysNum = parseInt(daysPerWeek, 10);
    const hoursNum = parseInt(hoursPerDay, 10);
    const bonusNum = parseFloat(annualBonus);

    if (
      isNaN(salaryNum) ||
      isNaN(daysNum) ||
      isNaN(hoursNum) ||
      isNaN(bonusNum) ||
      isNaN(startHourNum) ||
      hoursNum <= 0
    ) {
      setHourlyRate(null);
      setIsSubmitted(false);
      return;
    }

    // Assuming 4 weeks per month for calculation
    const monthlyWorkDays = daysNum * 4 + 2;
    if (monthlyWorkDays <= 0) {
      setHourlyRate(null);
      setIsSubmitted(false);
      return;
    }

    const totalMonthlyIncome = salaryNum + bonusNum / 12;
    const totalMonthlyHours = monthlyWorkDays * hoursNum;

    if (totalMonthlyHours > 0) {
      const calculatedRate = totalMonthlyIncome / totalMonthlyHours;
      setHourlyRate(calculatedRate);
      setIsSubmitted(true);
    } else {
      setHourlyRate(null);
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    if (!isSubmitted || hourlyRate === null || startHour === "") {
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(parseInt(startHour, 10), 0, 0, 0);

      if (now < startTime) {
        setCumulativeSalary(0);
        return;
      }

      const elapsedMilliseconds = now.getTime() - startTime.getTime();
      const elapsedHours = elapsedMilliseconds / (1000 * 60 * 60);

      setCumulativeSalary(elapsedHours * hourlyRate);
    }, 50); // Update frequently for a smooth counter

    return () => clearInterval(intervalId);
  }, [isSubmitted, hourlyRate, startHour]);

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }

    let currentBeatenCount = 1765400000;

    const intervalId = setInterval(() => {
      // Increment by a random amount to make it grow
      const increment = Math.floor(Math.random() * 1000000);
      currentBeatenCount += increment;
      setBeatenCount(currentBeatenCount.toLocaleString());
    }, 150); // Update every 150ms for a nice flicker effect

    return () => clearInterval(intervalId);
  }, [isSubmitted]);

  const randomChartData = useMemo(() => {
    const data = [];
    let lastY = 0;
    for (let i = 0; i < 30; i++) {
      lastY += (Math.random() * 10 + i) ^ i; // Ensure it always goes up
      data.push({ x: i, y: lastY });
    }
    return data;
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 font-sans dark:bg-black overflow-hidden">
      <div className="w-full max-w-md space-y-6 p-4">
        <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Salary Show-off
        </h1>
        {!isSubmitted ? (
          <form onSubmit={handleCalculate} className="space-y-4">
            <InputWithLabel
              id="monthlySalary"
              label="Monthly Salary"
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
            />
            <InputWithLabel
              id="daysPerWeek"
              label="Working Days per Week"
              type="number"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
            />
            <InputWithLabel
              id="hoursPerDay"
              label="Working Hours per Day"
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
            />
            <InputWithLabel
              id="annualBonus"
              label="Annual Bonus"
              type="number"
              value={annualBonus}
              onChange={(e) => setAnnualBonus(e.target.value)}
            />
            <InputWithLabel
              id="startHour"
              label="Starting hour (e.g., 9 for 9am)"
              type="number"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
            />
            <button
              type="submit"
              className="w-full rounded-md bg-zinc-900 px-4 py-2 text-zinc-50 shadow-sm hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              Calculate
            </button>
          </form>
        ) : (
          <div className="text-center text-xl text-zinc-900 dark:text-zinc-50">
            <div className="absolute inset-x-0 right-2/5 text-center font-mono text-xl text-zinc-400/50 mr-40">
              <p>Monthly Salary: {monthlySalary}</p>
              <p>Days/Week: {daysPerWeek}</p>
              <p>Hours/Day: {hoursPerDay}</p>
              <p>Annual Bonus: {annualBonus}</p>
              <p>Start Hour: {startHour}:00</p>
            </div>
            <div className="absolute inset-x-0 left-2/5 text-center font-mono text-xl text-zinc-400/50 ml-40">
              <p>You have beaten</p>
              <div className="h-6" aria-hidden="true" />
              <p className="text-zinc-700/90">{beatenCount}</p>
              <div className="h-6" aria-hidden="true" />

              <p>People on this planet</p>
            </div>
            <p className="text-2xl text-stone-600">You have earned</p>
            <p
              className="font-mono text-6xl font-bold animate-pulse"
              style={{ color: "var(--color-text-secondary)" }}
            >
              ¥{cumulativeSalary.toFixed(4)}
            </p>
            <p className="text-2xl text-stone-600">so far today.</p>

            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-8 rounded-md bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
            >
              Reset
            </button>
            <div className="mt-8" style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={randomChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(120, 113, 108, 0.2)"
                  />
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="var(--color-text-secondary)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <XAxis dataKey="x" hide />
                  <YAxis domain={["dataMin", "dataMax"]} hide />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
