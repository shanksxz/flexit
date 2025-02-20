import { LineChart, Trophy, Users } from "lucide-react";

import { FeatureCard } from "@/components/Landing/FeatureCard";
import { SiteHeader } from "@/components/Landing/SiteHeader";
import { Button } from "@/components/ui/button";
import { demousers } from "@/utils/demo";

export default function Dashboard() {
	return (
		<>
			<div className="flex-1">
				<SiteHeader />
				<main className="container mx-auto px-4 py-6">
					{/* Welcome Section */}
					<section className="mb-12 rounded-lg bg-blue-50 px-6 py-8">
						<h1 className="mb-2 text-3xl font-bold">Welcome back!</h1>
						<p className="text-muted-foreground">
							Ready for today's fitness challenge?
						</p>
					</section>

					{/* Current Challenge */}
					<div className="mb-12">
						<h2 className="mb-6 text-2xl font-bold">Your Current Challenge</h2>
						<div className="rounded-lg border p-6">
							<h3 className="mb-4 text-xl font-semibold">
								30-Day Push-up Challenge
							</h3>
							<div className="mb-6">
								<div className="mb-2 flex justify-between text-sm">
									<span>Progress</span>
									<span>Day 15/30</span>
								</div>
								<div className="h-2 rounded-full bg-muted">
									<div className="h-2 w-1/2 rounded-full bg-primary" />
								</div>
							</div>
							<Button>Log Today's Progress</Button>
						</div>
					</div>

					{/* Stats Grid */}
					<div className="mb-12 grid gap-6 md:grid-cols-3">
						<FeatureCard
							icon={Trophy}
							title="Completed Challenges"
							description="12 challenges completed this month"
						/>
						<FeatureCard
							icon={Users}
							title="Global Rank"
							description="#156 out of 10,000+ participants"
						/>
						<FeatureCard
							icon={LineChart}
							title="Current Streak"
							description="15 days and counting!"
						/>
					</div>

					{/* Leaderboard */}
					<div>
						<h2 className="mb-6 text-2xl font-bold">Your Competition</h2>
						<div className="space-y-4">
							{demousers.map((user, index) => (
								<div
									key={user.name}
									className={`flex items-center justify-between rounded-lg p-4 ${
										user.name === "You" ? "bg-primary/10" : "bg-blue-50"
									}`}
								>
									<div className="flex items-center gap-4">
										<span className="font-semibold">{index + 1}</span>
										<span>{user.name}</span>
									</div>
									<span className="text-primary">{user.points} pts</span>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
