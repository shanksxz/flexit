import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { StatsCardProps } from "@/utils/types";

export function StatsCard({
	icon: Icon,
	value,
	label,
	selected,
}: StatsCardProps) {
	return (
		<Card
			className={cn(
				"border bg-blue-50/50",
				selected && "border-primary bg-blue-50",
			)}
		>
			<CardContent className="p-6">
				<div className="flex items-center space-x-4">
					<Icon
						className={cn(
							"h-5 w-5",
							selected ? "text-primary" : "text-muted-foreground",
						)}
					/>
					<div>
						<div className="text-2xl font-bold">{value}</div>
						<div className="text-sm text-muted-foreground">{label}</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
