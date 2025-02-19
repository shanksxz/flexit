import type { LucideIcon } from "lucide-react";

export interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
}
export interface StatsCardProps {
	icon: LucideIcon;
	value: string | number;
	label: string;
	selected?: boolean;
}
