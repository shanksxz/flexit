import { FootprintsIcon as Walking, Flame, Clock, MapPin } from "lucide-react";

// import { Sidebar } from "@/components/sidebar";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ActivityChart } from "@/components/Dashboard/ActivityChart";
import { ProgressChart } from "@/components/Dashboard/ProgressChar";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const recentActivities = [
	{
		type: "Running",
		duration: "45 mins",
		date: "2024-01-20",
		distance: "5.2 km",
		calories: "450",
	},
	{
		type: "Walking",
		duration: "30 mins",
		date: "2024-01-19",
		distance: "2.5 km",
		calories: "180",
	},
	{
		type: "Running",
		duration: "50 mins",
		date: "2024-01-18",
		distance: "6.0 km",
		calories: "520",
	},
	{
		type: "Walking",
		duration: "35 mins",
		date: "2024-01-17",
		distance: "3.0 km",
		calories: "210",
	},
	{
		type: "Running",
		duration: "40 mins",
		date: "2024-01-16",
		distance: "4.8 km",
		calories: "420",
	},
];

export default function DashboardPage() {
	return (
		<>
			{/* <Sidebar className="w-64" /> */}
			<main className="flex-1 p-8">
				<div className="flex items-center justify-between mb-8">
					<div>
						<p className="text-sm text-muted-foreground">January 20, 2024</p>
						<h1 className="text-3xl font-bold tracking-tight">
							Welcome back, John
						</h1>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-sm">John Doe</span>
						<div className="h-8 w-8 rounded-full bg-blue-100" />
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-4 mb-8">
					<StatsCard icon={Walking} value="8,542" label="Daily Steps" />
					<StatsCard
						icon={Flame}
						value="654"
						label="Calories Burned"
						selected
					/>
					<StatsCard icon={Clock} value="45" label="Active Minutes" />
					<StatsCard icon={MapPin} value="5.2km" label="Distance" />
				</div>

				<div className="grid gap-4 md:grid-cols-2 mb-8">
					<ActivityChart />
					<ProgressChart />
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-4">Challenges Completed</h2>
					<div className="grid gap-4 md:grid-cols-3">
						{["10K Steps Daily", "Marathon Ready", "Early Bird"].map(
							(challenge) => (
								<Card key={challenge} className="p-4 bg-blue-50/50">
									<div className="flex items-center space-x-4 mb-2">
										<Walking className="h-5 w-5 text-primary" />
										<span className="font-medium">{challenge}</span>
									</div>
									<div className="h-2 bg-blue-100 rounded-full">
										<div className="h-2 bg-primary rounded-full w-full" />
									</div>
									<div className="mt-2 text-sm text-muted-foreground">
										Completed 2024-01-10
									</div>
								</Card>
							),
						)}
					</div>
				</div>

				<div>
					<h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
					<div className="rounded-lg border bg-blue-50/50">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-blue-100/50">
									<TableHead>Type</TableHead>
									<TableHead>Duration</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Distance</TableHead>
									<TableHead>Calories</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentActivities.map((activity) => (
									<TableRow
										key={`${activity.type}-${activity.date}`}
										className="hover:bg-blue-100/50"
									>
										<TableCell>{activity.type}</TableCell>
										<TableCell>{activity.duration}</TableCell>
										<TableCell>{activity.date}</TableCell>
										<TableCell>{activity.distance}</TableCell>
										<TableCell>{activity.calories}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</main>
		</>
	);
}
