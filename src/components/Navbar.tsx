import Link from "next/link";
import { Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarNav() {
	return (
		<div className="flex min-h-screen w-64 flex-col border-r bg-background">
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<div className="space-y-1">
						<Link href="/">
							<Button variant="ghost" className="w-full justify-start">
								<Home className="mr-2 h-4 w-4" />
								Home
							</Button>
						</Link>
						<Link href="/challenges">
							<Button variant="ghost" className="w-full justify-start">
								<Calendar className="mr-2 h-4 w-4" />
								Daily Challenges
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
