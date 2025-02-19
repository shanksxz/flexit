"use client";

import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

const options = {
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		y: {
			beginAtZero: false,
		},
	},
};

const data = {
	labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
	datasets: [
		{
			label: "Progress",
			data: [75, 78, 82, 80],
			borderColor: "#2563EB",
			tension: 0.3,
		},
	],
};

export function ProgressChart() {
	return (
		<div className="rounded-lg border bg-blue-50/50 p-4">
			<h3 className="mb-4 text-lg font-semibold">Monthly Progress</h3>
			<Line options={options} data={data} height={300} />
		</div>
	);
}
