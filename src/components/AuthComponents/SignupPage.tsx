"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImageComponent from "./ImageComponent";
import { useRouter } from "next/router";
import { authClient } from "@/server/auth/auth-client";
const signupSchema = z.object({
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	phoneNumber: z.string().min(10, "Please enter a valid phone number"),
	dateOfBirth: z.string().min(1, "Date of birth is required"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignupForm = z.infer<typeof signupSchema>;
export default function SignupPage() {
	const { toast } = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupForm>({
		resolver: zodResolver(signupSchema),
	});
	const onSubmit = async (data: SignupForm) => {
		let loadingToast: any = "";

		try {
			await authClient.signUp.email(
				{
					name: data.fullName,
					email: data.email,
					password: data.password,
					dateOfBirth: data.dateOfBirth,
					phoneNumber: data.phoneNumber,
				},
				{
					onRequest: () => {
						loadingToast = toast({
							variant: "default",
							description: "Signing up....",
							duration: Number.POSITIVE_INFINITY,
						});
					},
					onSuccess: () => {
						toast({
							variant: "default",
							title: "Signed up Successfully",
						});
						loadingToast.dismiss();
						useRouter().push("/login");
					},
					onError: (err) => {
						console.log(err);
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
		}
	};
	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Left side - Illustration */}
			<div className="lg:w-1/2 bg-[#2C73EA] p-8 flex flex-col">
				<div className="text-white text-2xl font-bold mb-auto">Flext It</div>
				<ImageComponent />
			</div>
			{/* Right side - Signup Form */}
			<div className="lg:w-1/2 p-8 flex flex-col">
				<div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
					<div className="mb-8">
						<Button
							variant="ghost"
							className="mb-6 -ml-4 text-gray-500 hover:text-gray-700"
							asChild
						>
							<Link href="/">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>
						<h1 className="text-2xl font-bold mb-2">Signup</h1>
						<p className="text-gray-500">
							Join the fitness revolution! Sign up now and take on the
							challenge!
						</p>
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="fullName">Full Name</Label>
							<Input
								id="fullName"
								type="text"
								placeholder="Enter your full name"
								{...register("fullName")}
								className={errors.fullName ? "border-red-500" : ""}
							/>
							{errors.fullName && (
								<p className="text-sm text-red-500">
									{errors.fullName.message}
								</p>
							)}
						</div>
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
							<Label htmlFor="phoneNumber">Phone Number</Label>
							<Input
								id="phoneNumber"
								type="tel"
								placeholder="Enter your phone number"
								{...register("phoneNumber")}
								className={errors.phoneNumber ? "border-red-500" : ""}
							/>
							{errors.phoneNumber && (
								<p className="text-sm text-red-500">
									{errors.phoneNumber.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="dateOfBirth">Date Of Birth</Label>
							<Input
								id="dateOfBirth"
								type="date"
								{...register("dateOfBirth")}
								className={errors.dateOfBirth ? "border-red-500" : ""}
							/>
							{errors.dateOfBirth && (
								<p className="text-sm text-red-500">
									{errors.dateOfBirth.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Create a password"
								{...register("password")}
								className={errors.password ? "border-red-500" : ""}
							/>
							{errors.password && (
								<p className="text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>
						<Button
							type="submit"
							className="w-full bg-blue-500 hover:bg-blue-600"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Creating account..." : "Continue"}
						</Button>
						<p className="text-center text-sm text-gray-500">
							Already have an account?{" "}
							<Link href="/" className="text-blue-500 hover:text-blue-600">
								Login
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}
