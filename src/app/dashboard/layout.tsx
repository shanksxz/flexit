import { SidebarNav } from "@/components/Navbar";
import type { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<SidebarNav />
			{children}
		</div>
	);
}
