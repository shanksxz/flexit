import { Sidebar } from "@/components/Navbar";
import type { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			{children}
		</div>
	);
}
