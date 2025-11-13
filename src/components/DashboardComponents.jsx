import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement, // For Line chart
  LineElement, // For Line chart
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Lightbulb,
  Car,
  Utensils,
  CheckCircle,
  Info,
  Goal,
  Trash2,
  Plane,
  Calculator,
  Sparkles,
  Globe,
} from "lucide-react";

import { useAuthStore } from "../store/authStore.js";
import { mockApi } from "../lib/api.js";
import { calculateFootprint } from "../lib/logic.js";
import { SimpleMarkdownDisplay, LoadingSpinner } from "./UtilityComponents.jsx";

// --- Chart.js Registration ---
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement, // Register new elements
  LineElement
);

// --- 4c. Dashboard Components (NEW) ---

// New, more detailed calculator form
export function CalculatorForm({ onCalculation }) {
  const [inputs, setInputs] = useState({
    // Energy (Monthly)
    energyKwh: "",
    gasTherms: "",
    // Transport (Weekly)
    transportCar: "",
    transportBus: "",
    transportTrain: "",
    // Flights (Monthly)
    transportFlight: "",
    // Diet (Weekly)
    diet: "dietOmnivore",
    // Waste (Daily)
    wastePeople: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "diet" ? value : value === "" ? "" : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = calculateFootprint(inputs);
    try {
      const savedFootprint = await mockApi.postFootprint(token, result);
      onCalculation(savedFootprint);
    } catch (error) {
      console.error("Failed to save footprint:", error);
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg space-y-8"
    >
      <h2 className="text-3xl font-bold text-gray-800">
        Calculate Your Footprint
      </h2>
      <p className="text-gray-600 -mt-6">
        Fill in your consumption. Fields are per <strong>month</strong> unless
        stated otherwise.
      </p>

      {/* --- Energy Section --- */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-green-600" />
          Energy (Monthly)
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="energyKwh"
              className="block text-sm font-medium text-gray-700"
            >
              Electricity (kWh)
            </label>
            <input
              type="number"
              name="energyKwh"
              id="energyKwh"
              value={inputs.energyKwh}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 300"
              className="mt-1 input-field"
            />
          </div>
          <div>
            <label
              htmlFor="gasTherms"
              className="block text-sm font-medium text-gray-700"
            >
              Natural Gas (therms)
            </label>
            <input
              type="number"
              name="gasTherms"
              id="gasTherms"
              value={inputs.gasTherms}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 50"
              className="mt-1 input-field"
            />
          </div>
        </div>
      </fieldset>

      {/* --- Transport Section --- */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Car className="w-6 h-6 text-green-600" />
          Transport (Weekly Miles)
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="transportCar"
              className="block text-sm font-medium text-gray-700"
            >
              Car
            </label>
            <input
              type="number"
              name="transportCar"
              id="transportCar"
              value={inputs.transportCar}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 50"
              className="mt-1 input-field"
            />
          </div>
          <div>
            <label
              htmlFor="transportBus"
              className="block text-sm font-medium text-gray-700"
            >
              Bus
            </label>
            <input
              type="number"
              name="transportBus"
              id="transportBus"
              value={inputs.transportBus}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 10"
              className="mt-1 input-field"
            />
          </div>
          <div>
            <label
              htmlFor="transportTrain"
              className="block text-sm font-medium text-gray-700"
            >
              Train
            </label>
            <input
              type="number"
              name="transportTrain"
              id="transportTrain"
              value={inputs.transportTrain}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 0"
              className="mt-1 input-field"
            />
          </div>
        </div>
      </fieldset>

      {/* --- Flights Section --- */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Plane className="w-6 h-6 text-green-600" />
          Flights (Monthly Miles)
        </legend>
        <div>
          <label
            htmlFor="transportFlight"
            className="block text-sm font-medium text-gray-700"
          >
            Total Air Travel (miles)
          </label>
          <input
            type="number"
            name="transportFlight"
            id="transportFlight"
            value={inputs.transportFlight}
            onChange={handleChange}
            min="0"
            placeholder="e.g., 500"
            className="mt-1 input-field"
          />
        </div>
      </fieldset>

      {/* --- Diet & Waste Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-green-600" />
            Diet (Weekly)
          </legend>
          <div>
            <label
              htmlFor="diet"
              className="block text-sm font-medium text-gray-700"
            >
              Primary Diet
            </label>
            <select
              name="diet"
              id="diet"
              value={inputs.diet}
              onChange={handleChange}
              className="mt-1 input-field"
            >
              <option value="dietOmnivore">Omnivore (Default)</option>
              <option value="dietVegetarian">Vegetarian</option>
              <option value="dietVegan">Vegan</option>
            </select>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-green-600" />
            Waste (Household)
          </legend>
          <div>
            <label
              htmlFor="wastePeople"
              className="block text-sm font-medium text-gray-700"
            >
              People in Household
            </label>
            <input
              type="number"
              name="wastePeople"
              id="wastePeople"
              value={inputs.wastePeople}
              onChange={handleChange}
              min="1"
              placeholder="e.g., 2"
              className="mt-1 input-field"
            />
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 flex justify-center items-center gap-2 transition-all duration-200"
      >
        {isLoading ? (
          <>
            <LoadingSpinner /> Calculating...
          </>
        ) : (
          "Calculate Monthly Footprint"
        )}
      </button>
    </form>
  );
}

// New component for showing current result + AI tips
export function ResultDisplay({ calculation }) {
  const [aiTips, setAiTips] = useState(null);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    setAiTips(null);
    setIsGeneratingTips(false);
    setGenerationError(null);
  }, [calculation]);

  const handleGetTips = async () => {
    if (!calculation) return;
    setIsGeneratingTips(true);
    setAiTips(null);
    setGenerationError(null);
    try {
      const tips = await mockApi.getReductionTips(
        token,
        calculation.breakdown,
        calculation.totalFootprint
      );
      setAiTips(tips);
    } catch (err) {
      setGenerationError(err.message);
    }
    setIsGeneratingTips(false);
  };

  // Data for the Pie chart
  const chartData = useMemo(() => {
    if (!calculation) return null;
    const { breakdown } = calculation;
    return {
      labels: ["Energy", "Transport", "Flights", "Diet", "Waste"],
      datasets: [
        {
          label: "kg CO2e",
          data: [
            breakdown.energy,
            breakdown.transport,
            breakdown.flights,
            breakdown.diet,
            breakdown.waste,
          ],
          backgroundColor: [
            "rgba(239, 68, 68, 0.7)", // Red
            "rgba(59, 130, 246, 0.7)", // Blue
            "rgba(168, 85, 247, 0.7)", // Purple
            "rgba(234, 179, 8, 0.7)", // Yellow
            "rgba(16, 185, 129, 0.7)", // Green
          ],
          borderColor: ["#fff"],
          borderWidth: 2,
        },
      ],
    };
  }, [calculation]);

  if (!calculation) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col justify-center items-center text-center">
        <Calculator className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">
          Calculate Your Footprint
        </h3>
        <p className="text-gray-500">
          Your results and AI tips will appear here.
        </p>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Your Monthly Result
      </h3>
      <div className="text-center">
        <p className="text-lg text-gray-600">Total Footprint:</p>
        <p className="text-5xl font-bold text-green-600">
          {calculation.totalFootprint}
        </p>
        <p className="text-lg text-gray-600">kg CO2e / month</p>
      </div>
      <div className="max-w-xs mx-auto">
        {chartData && <Pie data={chartData} options={chartOptions} />}
      </div>

      {/* AI Tips Section */}
      <div className="border-t pt-6">
        {!aiTips && !isGeneratingTips && (
          <button
            onClick={handleGetTips}
            className="w-full py-2 px-4 rounded-lg shadow-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 flex justify-center items-center gap-2 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            Get AI-Powered Reduction Tips
          </button>
        )}
        {isGeneratingTips && (
          <div className="text-center text-gray-600 flex justify-center items-center gap-2">
            <LoadingSpinner />
            Generating personalized tips...
          </div>
        )}
        {generationError && (
          <div className="text-center text-red-500">
            <p>Error: {generationError}</p>
          </div>
        )}
        {aiTips && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-lg font-semibold text-green-800 mb-2">
              Your Personalized Tips
            </h4>
            <div
              className="prose prose-sm prose-green"
              dangerouslySetInnerHTML={{
                __html: aiTips
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br />"),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- NEW: General Suggestions Card ---
export function GeneralSuggestions() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-600" />
        Tips to Control Your Footprint
      </h3>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>
          <strong>Track Regularly:</strong> Use this calculator monthly to see
          your trends.
        </li>
        <li>
          <strong>Set a Goal:</strong> Visit the "My Goals" tab to set a
          reduction target.
        </li>
        <li>
          <strong>Explore Swaps:</strong> Try one low-carbon meal swap per week
          using our "AI Tools".
        </li>
        <li>
          <strong>Get Personal Advice:</strong> Use the "Get AI Tips" button for
          personalized advice.
        </li>
      </ul>
    </div>
  );
}

// New component for showing history line chart and list
export function HistoryTracker({ newCalculation, onSelectHistory }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockApi.getFootprints(token);
        setHistory(data);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    fetchHistory();
  }, [token]);

  useEffect(() => {
    if (newCalculation) {
      // Add new calculation to list
      setHistory((prev) => [...prev, newCalculation]);
    }
  }, [newCalculation]);

  // Memoize chart data
  const { lineChartData, lineChartOptions } = useMemo(() => {
    const labels = history.map((item) =>
      new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    );
    const data = history.map((item) => item.totalFootprint);

    return {
      lineChartData: {
        labels,
        datasets: [
          {
            label: "Total Footprint (kg CO2e)",
            data,
            fill: true,
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderColor: "rgba(16, 185, 129, 1)",
            tension: 0.1,
            pointBackgroundColor: "rgba(16, 185, 129, 1)",
          },
        ],
      },
      lineChartOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Your Footprint Over Time",
            font: { size: 16 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "kg CO2e / month" },
          },
        },
      },
    };
  }, [history]);

  if (isLoading) {
    return (
      <div className="text-center p-4 flex justify-center items-center gap-2">
        <LoadingSpinner />
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Your History</h2>
      {history.length < 2 ? (
        <div className="text-center text-gray-500 p-4">
          <Info className="w-8 h-8 mx-auto mb-2" />
          Calculate your footprint at least twice to see your history chart.
        </div>
      ) : (
        <div className="h-64">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      )}

      {/* History List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-700">Calculation Log</h3>
        {history
          .slice() // Create a copy
          .reverse() // Show newest first
          .map((item) => (
            <button
              key={item._id}
              onClick={() => onSelectHistory(item)}
              className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-700 group-hover:text-green-800">
                  {item.totalFootprint} kg CO2e
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

// --- NEW: 4d. "My Goals" Page (Imported) ---
export function GoalsPage() {
  const [goalData, setGoalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newGoalPercent, setNewGoalPercent] = useState("10");
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);
  const token = useAuthStore((state) => state.token);

  // Fetch goal data on load
  useEffect(() => {
    const fetchGoalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockApi.getGoal(token);
        setGoalData(data);
        if (data.goal) {
          setNewGoalPercent(String(data.goal.reductionPercent));
        }
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    fetchGoalData();
  }, [token]);

  const handleSetGoal = async (e) => {
    e.preventDefault();
    setIsSettingGoal(true);
    setError(null);
    setAiPlan(null); // Clear old plan
    try {
      const percentToSend = parseFloat(newGoalPercent);
      if (isNaN(percentToSend) || percentToSend < 1 || percentToSend > 100) {
        setError("Please enter a valid percentage (e.g., 1-100).");
        setIsSettingGoal(false);
        return;
      }
      const newGoal = await mockApi.setGoal(token, percentToSend);
      const data = await mockApi.getGoal(token); // Refresh data
      setGoalData(data);
      if (data.goal) {
        setNewGoalPercent(String(data.goal.reductionPercent));
      }
    } catch (err) {
      setError(err.message);
    }
    setIsSettingGoal(false);
  };

  const handleGetPlan = async () => {
    setIsGeneratingPlan(true);
    setAiPlan(null);
    setPlanError(null);
    try {
      const plan = await mockApi.getGoalTips(
        token,
        goalData.goal.reductionPercent,
        goalData.latestFootprint
      );
      setAiPlan(plan);
    } catch (err) {
      setPlanError(err.message);
    }
    setIsGeneratingPlan(false);
  };

  const { chartData, chartOptions } = useMemo(() => {
    if (!goalData || !goalData.latestFootprint) {
      return { chartData: null, chartOptions: {} };
    }
    const current = goalData.latestFootprint.totalFootprint;
    const goalValue = goalData.goal
      ? current * (1 - goalData.goal.reductionPercent / 100)
      : current;
    const data = {
      labels: ["Your Progress"],
      datasets: [
        {
          label: "Current Footprint",
          data: [current],
          backgroundColor: "rgba(59, 130, 246, 0.7)", // Blue
        },
        {
          label: "Your Goal",
          data: [goalValue],
          backgroundColor: "rgba(16, 185, 129, 0.7)", // Green
        },
      ],
    };
    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Current Footprint vs. Your Goal (kg CO2e)",
        },
      },
      scales: { y: { beginAtZero: true } },
    };
    return { chartData: data, chartOptions: options };
  }, [goalData]);

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !isSettingGoal) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Goal className="w-8 h-8 text-green-600" />
            Set Your Reduction Goal
          </h2>
          {!goalData.latestFootprint ? (
            <p className="text-gray-600">
              Calculate your footprint on the "My Footprint" tab first to set a
              goal!
            </p>
          ) : (
            <form onSubmit={handleSetGoal} className="space-y-4">
              <div>
                <label
                  htmlFor="goalPercent"
                  className="block text-sm font-medium text-gray-700"
                >
                  I want to reduce my footprint by:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    id="goalPercent"
                    value={newGoalPercent}
                    onChange={(e) => setNewGoalPercent(e.target.value)}
                    min="1"
                    max="100"
                    className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  <span className="text-xl font-medium text-gray-800">%</span>
                </div>
              </div>
              {error && isSettingGoal && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSettingGoal}
                className="w-full py-2 px-4 rounded-lg shadow-sm font-medium text-white bg-green-600 hover:bg-green-700 flex justify-center items-center gap-2"
              >
                {isSettingGoal ? <LoadingSpinner /> : "Set My Goal"}
              </button>
            </form>
          )}
        </div>
        {goalData && goalData.latestFootprint && chartData && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Progress
            </h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-green-600" />
          Your AI Goal Plan
        </h2>
        {!goalData.goal ? (
          <p className="text-gray-600">
            Set a goal first, and we'll generate a personalized plan!
          </p>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGetPlan}
              disabled={isGeneratingPlan || !goalData.latestFootprint}
              className="w-full py-2 px-4 rounded-lg shadow-sm font-medium text-white bg-green-600 hover:bg-green-700 flex justify-center items-center gap-2"
            >
              {isGeneratingPlan ? <LoadingSpinner /> : "✨ Get My AI Goal Plan"}
            </button>
            {isGeneratingPlan && (
              <div className="text-center">
                <LoadingSpinner />
              </div>
            )}
            {planError && <p className="text-red-500">Error: {planError}</p>}
            {aiPlan && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-2">
                  Your {goalData.goal.reductionPercent}% Reduction Plan
                </h4>
                <SimpleMarkdownDisplay text={aiPlan} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- NEW: 4e. "Global Explorer" Page (Imported) ---
export function GlobalExplorerPage() {
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("totalEmissions");
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockApi.getGlobalData(token);
        setGlobalData(data);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [token]);

  const { chartData, chartOptions } = useMemo(() => {
    if (!globalData) return { chartData: null, chartOptions: {} };
    const labels = globalData.data.map((d) => d.country);
    const data = globalData.data.map((d) => d[chartType]);
    const label =
      chartType === "totalEmissions"
        ? "Total Emissions (MtCO2)"
        : "Per Capita Emissions (tCO2)";
    return {
      chartData: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Top 10 Emitters (${label}) - ${globalData.year}`,
          },
        },
        scales: { x: { title: { display: true, text: label } } },
      },
    };
  }, [globalData, chartType]);

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  if (!globalData) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        Global Emissions Explorer
      </h2>
      <p className="text-gray-600">
        Data Source: {globalData.source} (Year: {globalData.year})
      </p>
      <div>
        <label
          htmlFor="chartType"
          className="block text-sm font-medium text-gray-700"
        >
          Select Data Type (for better comparison)
        </label>
        <select
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="mt-1 input-field max-w-xs"
        >
          <option value="totalEmissions">Total Emissions</option>
          <option value="perCapita">Per Capita Emissions</option>
        </select>
      </div>
      <div className="w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

// --- NEW: 4f. "AI Tools" Page (Imported) ---
export function AIToolsPage() {
  const [dietType, setDietType] = useState("dietOmnivore");
  const [mealIdeas, setMealIdeas] = useState(null);
  const [isGeneratingMeals, setIsGeneratingMeals] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const token = useAuthStore((state) => state.token);

  const handleGenerateMeals = async () => {
    setIsGeneratingMeals(true);
    setMealIdeas(null);
    setGenerationError(null);
    try {
      const ideas = await mockApi.getMealIdeas(token, dietType);
      setMealIdeas(ideas);
    } catch (err) {
      setGenerationError(err.message);
    }
    setIsGeneratingMeals(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <Sparkles className="w-8 h-8 text-green-600" />
        AI-Powered Tools
      </h2>
      <div className="border border-gray-200 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Low-Carbon Meal Generator
        </h3>
        <p className="text-gray-600 mb-4">
          Select your diet and our AI will generate simple, low-carbon meal
          ideas.
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="dietType"
              className="block text-sm font-medium text-gray-700"
            >
              My current diet is:
            </label>
            <select
              name="dietType"
              id="dietType"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="mt-1 input-field max-w-xs"
            >
              <option value="dietOmnivore">Omnivore</option>
              <option value="dietVegetarian">Vegetarian</option>
              <option value="dietVegan">Vegan</option>
            </select>
          </div>
          <button
            onClick={handleGenerateMeals}
            disabled={isGeneratingMeals}
            className="w-full max-w-xs py-2 px-4 rounded-lg shadow-sm font-medium text-white bg-green-600 hover:bg-green-700 flex justify-center items-center gap-2"
          >
            {isGeneratingMeals ? <LoadingSpinner /> : "Generate Meal Ideas"}
          </button>
          {isGeneratingMeals && (
            <div className="text-center">
              <LoadingSpinner />
            </div>
          )}
          {generationError && (
            <p className="text-red-500">Error: {generationError}</p>
          )}
          {mealIdeas && (
            <div className="p-4 bg-green-50 rounded-lg mt-4">
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                Your Low-Carbon Meal Ideas
              </h4>
              <SimpleMarkdownDisplay text={mealIdeas} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
