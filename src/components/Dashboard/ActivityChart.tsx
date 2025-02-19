"use client";

import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "bottom" as const,
		},
	},
	scales: {
		y: {
			beginAtZero: true,
		},
	},
};

const data = {
	labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	datasets: [
		{
			label: "Steps",
			data: [7000, 8000, 7500, 9000, 8500, 9500, 9000],
			backgroundColor: "#2563EB",
		},
		{
			label: "Calories",
			data: [400, 450, 400, 500, 450, 550, 500],
			backgroundColor: "#22C55E",
		},
	],
};

export function ActivityChart() {
	return (
		<div className="rounded-lg border bg-blue-50/50 p-4">
			<h3 className="mb-4 text-lg font-semibold">Weekly Activity</h3>
			<Bar options={options} data={data} height={300} />
		</div>
	);
}
