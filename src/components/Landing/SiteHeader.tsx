"use client";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SiteHeader() {
	const router = useRouter();
	return (
		<header className="sticky flex justify-between top-0 z-50 w-full border-b bg-background">
			<div className="flex h-16 items-center gap-4 px-4 sm:px-8">
				<Link href="/" className="flex items-center gap-2 font-bold text-xl">
					<span className="text-primary">Fit</span>Challenge
				</Link>
				<div className="flex-1 ml-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search challenges..."
							className="w-full max-w-[500px] pl-8"
						/>
					</div>
				</div>
			</div>
			<div className="mt-auto p-4 grid grid-rows-1 grid-cols-2 items-center gap-2">
				<Button className="w-full" size="lg">
					Join Now
				</Button>
				<Button
					variant="outline"
					className="w-full"
					size="lg"
					onClick={() => router.push("/login")}
				>
					Login
				</Button>
			</div>
		</header>
	);
}
