"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/server/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { unknown, z } from "zod";
import ImageComponent from "./ImageComponent";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginComponent() {
	const { toast } = useToast();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginForm) => {
		const loadingToast = toast({
			variant: "default",
			description: "Signing up....",
			duration: Number.POSITIVE_INFINITY,
		});
		try {
			await authClient.signIn.email(
				{
					...data,
				},
				{
					onSuccess: () => {
						toast({
							variant: "default",
							title: "logged In successfully",
						});
						router.push("/dashboard");
					},
					onError: (ctx) => {
						console.log(ctx.error.message);
					},
				},
			);
		} catch (err) {
			if (err instanceof Error) {
				toast({
					variant: "destructive",
					title: "Some error occured while loggin in",
					description: err.message,
				});
			}
		} finally {
			loadingToast.dismiss();
		}
	};

	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			<div className="lg:w-1/2 bg-[#2C73EA] p-8 flex flex-col">
				<div className="text-white text-2xl font-bold mb-auto">Flex It</div>
				<ImageComponent />
			</div>

			<div className="lg:w-1/2 p-8 flex flex-col">
				<div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
					<div className="mb-8">
						<Button
							variant="ghost"
							className="mb-6 -ml-4 text-gray-500 hover:text-gray-700"
							asChild
						>
							<Link href={"/"}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>
						<h1 className="text-2xl font-bold mb-2">Login</h1>
						<p className="text-gray-500">
							Already part of the squad? Log in now and keep crushing your
							fitness goals!
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="email">Email address</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								{...register("email")}
								className={errors.email ? "border-red-500" : ""}
							/>
							{errors.email && (
								<p className="text-sm text-red-500">{errors.email.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								{...register("password")}
								className={errors.password ? "border-red-500" : ""}
							/>
							{errors.password && (
								<p className="text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox id="rememberMe" {...register("rememberMe")} />
							<Label htmlFor="rememberMe" className="text-sm text-gray-500">
								Remember me
							</Label>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-500 hover:bg-blue-600"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Logging in..." : "Login in To your Account"}
						</Button>

						<p className="text-center text-sm text-gray-500">
							Don't have an account?{" "}
							<Link
								href="/signup"
								className="text-blue-500 hover:text-blue-600"
							>
								Sign up here
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}
