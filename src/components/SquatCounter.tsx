"use client";
import { classifyPose, PoseType } from "@/components/pose";
import {
	FilesetResolver,
	PoseLandmarker,
	type PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
	CheckCircle2,
	Trophy,
	Timer,
	Video,
	AlertTriangle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface SquatCounterProps {
	squatThreshold?: number;
	standingThreshold?: number;
}

const SquatCounter: React.FC<SquatCounterProps> = ({
	squatThreshold = 80,
	standingThreshold = 160,
}) => {
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [repCount, setRepCount] = useState<number>(0);
	const [isSquatting, setIsSquatting] = useState<boolean>(false);
	const [currentAngle, setCurrentAngle] = useState<number>(180);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [poseName, setPoseName] = useState<PoseType>(PoseType.UNKNOWN);
	const [cameraPermission, setCameraPermission] = useState<"prompt" | "granted" | "denied">("prompt");
	const detectorRef = useRef<PoseLandmarker | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	const checkCameraPermission = async () => {
		try {
			const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
			switch (permissionStatus.state) {
				case 'granted':
					setCameraPermission('granted');
					setError(null);
					break;
				case 'denied':
					setCameraPermission('denied');
					setError('Camera access denied. Please check browser permissions.');
					break;
				default:
					await requestCameraPermission();
			}
			permissionStatus.addEventListener('change', () => {
				setCameraPermission(permissionStatus.state as 'granted' | 'denied' | 'prompt');
			});
		} catch (err) {
			await requestCameraPermission();
		}
	};
	
	const requestCameraPermission = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			stream.getTracks().forEach(track => track.stop());
			setCameraPermission("granted");
			setError(null);
		} catch (err) {
			setCameraPermission("denied");
			setError("Camera access denied. Please check browser permissions.");
		}
	};

	const lastAngleRef = useRef<number>(180);
	const isSquattingRef = useRef<boolean>(false);

	useEffect(() => {
		checkCameraPermission();
	}, []);

	useEffect(() => {
		let isActive = true;
		let retryCount = 0;
		const MAX_RETRIES = 3;

		const initializePose = async () => {
			try {
				setIsLoading(true);

				if (webcamRef.current?.video) {
					await new Promise((resolve) => {
						webcamRef.current!.video!.onloadedmetadata = resolve;
					});
				}

				const vision = await FilesetResolver.forVisionTasks(
					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
				);

				if (!isActive) return;

				detectorRef.current = await PoseLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
						delegate: "GPU"
					},
					runningMode: "VIDEO",
					minPoseDetectionConfidence: 0.5,
					minPosePresenceConfidence: 0.5,
					minTrackingConfidence: 0.5
				});

				if (webcamRef.current?.video) {
					const video = webcamRef.current.video;

					if (canvasRef.current) {
						canvasRef.current.width = video.videoWidth;
						canvasRef.current.height = video.videoHeight;
					}

					const processFrame = async () => {
						if (!detectorRef.current || !video) return;

						try {
							if (video.readyState === video.HAVE_ENOUGH_DATA) {
								const results = detectorRef.current.detectForVideo(
									video,
									performance.now()
								);
								if (isActive) {
									onResults(results);
									animationFrameRef.current = requestAnimationFrame(processFrame);
								}
							} else {
								animationFrameRef.current = requestAnimationFrame(processFrame);
							}
						} catch (err) {
							console.error("Frame processing error:", err);
							if (retryCount < MAX_RETRIES) {
								retryCount++;
								animationFrameRef.current = requestAnimationFrame(processFrame);
							} else {
								setError("Failed to process video frame after multiple attempts");
							}
						}
					};

					animationFrameRef.current = requestAnimationFrame(processFrame);
				}

				setIsLoading(false);
			} catch (err) {
				if (isActive) {
					setError(`Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`);
					setIsLoading(false);
				}
			}
		};

		if (cameraPermission === "granted") {
			initializePose();
		}

		return () => {
			isActive = false;
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (detectorRef.current) {
				detectorRef.current.close();
			}
		};
	}, [cameraPermission]);

	const onResults = (results: PoseLandmarkerResult) => {
		if (
			results.landmarks?.[0] && // Access first detected pose
			canvasRef.current &&
			webcamRef.current?.video
		) {
			const canvasCtx = canvasRef.current.getContext("2d");
			if (!canvasCtx) return;

			canvasCtx.save();
			canvasCtx.clearRect(
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height,
			);

			canvasCtx.drawImage(
				webcamRef.current.video,
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height,
			);

			const landmarks = results.landmarks[0];

			canvasCtx.strokeStyle = "#00FF00";
			canvasCtx.lineWidth = 4;
			POSE_CONNECTIONS.forEach(([start, end]) => {
				const startPoint = landmarks[start];
				const endPoint = landmarks[end];
				if (startPoint && endPoint) {
					canvasCtx.beginPath();
					canvasCtx.moveTo(
						startPoint.x * canvasRef.current!.width,
						startPoint.y * canvasRef.current!.height,
					);
					canvasCtx.lineTo(
						endPoint.x * canvasRef.current!.width,
						endPoint.y * canvasRef.current!.height,
					);
					canvasCtx.stroke();
				}
			});

			landmarks.forEach((landmark) => {
				canvasCtx.fillStyle = "#FF0000";
				canvasCtx.beginPath();
				canvasCtx.arc(
					landmark.x * canvasRef.current!.width,
					landmark.y * canvasRef.current!.height,
					4,
					0,
					2 * Math.PI,
				);
				canvasCtx.fill();
			});

			const currentPose = classifyPose(landmarks);
			console.log(currentPose);
			canvasCtx.font = "50px Arial";
			canvasCtx.fillStyle = "white";
			canvasCtx.fillText(`Pose: ${currentPose}`, 10, 30);
			setPoseName(currentPose);

			// // Get hip, knee, and ankle points for right leg
			// const hip = landmarks[24]; // Right hip
			// const knee = landmarks[26]; // Right knee
			// const ankle = landmarks[28]; // Right ankle

			// if (hip && knee && ankle) {
			//     const angle = calculateAngle(
			//         { x: hip.x, y: hip.y },
			//         { x: knee.x, y: knee.y },
			//         { x: ankle.x, y: ankle.y }
			//     );

			//     setCurrentAngle(Math.round(angle));

			//     // Detect squat based on knee angle with hysteresis
			//     if (angle < squatThreshold && !isSquattingRef.current) {
			//         isSquattingRef.current = true;
			//         setIsSquatting(true);
			//     } else if (
			//         angle > standingThreshold &&
			//         isSquattingRef.current
			//     ) {
			//         isSquattingRef.current = false;
			//         setIsSquatting(false);
			//         setRepCount((prev) => prev + 1);
			//     }

			//     // Draw angle on canvas
			//     canvasCtx.font = "30px Arial";
			//     canvasCtx.fillStyle = "white";
			//     canvasCtx.fillText(
			//         `Angle: ${Math.round(angle)}°`,
			//         knee.x * canvasRef.current.width,
			//         knee.y * canvasRef.current.height
			//     );

			//     lastAngleRef.current = angle;
			// }

			canvasCtx.restore();
		}
	};


	if (cameraPermission === "prompt") {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
						<Video className="h-6 w-6 text-primary" />
					</div>
					<h2 className="mb-2 text-lg font-semibold">Camera Access Required</h2>
					<p className="mb-4 text-sm text-muted-foreground">
						We need camera access to track your squats and provide accurate counting
					</p>
					<div className="flex items-center justify-center gap-2">
						<Button
							variant="default"
							onClick={requestCameraPermission}
							className="bg-primary text-white hover:bg-primary/90"
						>
							Allow Camera
						</Button>
						<Button variant="outline" onClick={() => setError("Camera access is required to use this feature.")}>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen w-full bg-background">
			<div className="flex-1 px-6 py-8 md:px-8">
				<div className="mx-auto max-w-4xl">
					<div className="mb-8">
						<h1 className="text-2xl font-bold">Squat Challenge</h1>
						<p className="text-muted-foreground">
							Complete as many squats as possible in 60 seconds
						</p>
					</div>

					<div className="grid gap-6">
						{/* Stats Cards */}
						<div className="grid gap-4 sm:grid-cols-3">
							<Card className="p-4">
								<div className="flex items-center gap-2">
									<Trophy className="h-4 w-4 text-primary" />
									<span className="text-sm font-medium">Reps</span>
								</div>
								<p className="mt-2 text-2xl font-bold">{repCount}</p>
							</Card>

							<Card className="p-4">
								<div className="flex items-center gap-2">
									<Timer className="h-4 w-4 text-primary" />
									<span className="text-sm font-medium">Status</span>
								</div>
								<p className="mt-2 text-2xl font-bold">
									{isSquatting ? "SQUAT" : "STAND"}
								</p>
							</Card>

							<Card className="p-4">
								<div className="flex items-center gap-2">
									<Video className="h-4 w-4 text-primary" />
									<span className="text-sm font-medium">Angle</span>
								</div>
								<p className="mt-2 text-2xl font-bold">
									{Math.round(currentAngle)}°
								</p>
							</Card>
						</div>

						{/* Camera View */}
						<Card className="overflow-hidden">
							{isLoading && (
								<div className="flex h-[480px] items-center justify-center bg-muted/50">
									<div className="text-center">
										<div className="mb-2 animate-spin rounded-full border-4 border-primary border-t-transparent h-12 w-12 mx-auto" />
										<p className="text-muted-foreground">
											Loading pose detection...
										</p>
									</div>
								</div>
							)}
							<Webcam
								ref={webcamRef}
								style={{
									visibility: "hidden",
									position: "absolute",
									pointerEvents: "none",
								}}
								width={640}
								height={480}
							/>
							<canvas
								ref={canvasRef}
								width={640}
								height={480}
								className="w-full"
							/>
						</Card>

						{/* Instructions */}
						<Card className="p-6">
							<h3 className="mb-4 text-lg font-semibold">Instructions</h3>
							<ul className="space-y-3">
								{[
									"Stand sideways to the camera",
									"Keep your entire body visible",
									"Perform squats at a moderate pace",
									`Current thresholds: Squat (${squatThreshold}°) - Stand (${standingThreshold}°)`,
								].map((instruction, i) => (
									<li key={i} className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-primary" />
										<span className="text-sm text-muted-foreground">
											{instruction}
										</span>
									</li>
								))}
							</ul>
						</Card>

						{error && (
							<Card className="p-4 border-destructive">
								<div className="flex items-center gap-2 text-destructive">
									<AlertTriangle className="h-4 w-4" />
									<p className="text-sm font-medium">{error}</p>
								</div>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// MediaPipe Pose connections for visualization
const POSE_CONNECTIONS: [number, number][] = [
	[24, 26], // Right hip to right knee
	[26, 28], // Right knee to right ankle
	[23, 25], // Left hip to left knee
	[25, 27], // Left knee to left ankle
	[11, 12], // Shoulders
	[11, 23], // Left shoulder to left hip
	[12, 24], // Right shoulder to right hip
	[23, 24], // Hips
];

export default SquatCounter;
