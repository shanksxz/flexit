"use client";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, type Results } from "@mediapipe/pose";
// src/components/SquatCounter.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

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

	// Use refs for values that need to persist between renders without causing re-renders
	const lastAngleRef = useRef<number>(180);
	const isSquattingRef = useRef<boolean>(false);

	useEffect(() => {
		const pose = new Pose({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
			},
		});

		pose.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		pose.onResults(onResults);

		if (webcamRef.current?.video) {
			const camera = new Camera(webcamRef.current.video, {
				onFrame: async () => {
					if (webcamRef.current?.video) {
						await pose.send({ image: webcamRef.current.video });
					}
				},
				width: 640,
				height: 480,
			});

			camera.start().catch((err) => {
				setError(`Error starting camera: ${err.message}`);
			});
		}

		setIsLoading(false);

		return () => {
			pose.close();
		};
	}, []);

	const calculateAngle = (
		p1: { x: number; y: number },
		p2: { x: number; y: number },
		p3: { x: number; y: number },
	): number => {
		const radians =
			Math.atan2(p3.y - p2.y, p3.x - p2.x) -
			Math.atan2(p1.y - p2.y, p1.x - p2.x);
		let angle = Math.abs((radians * 180.0) / Math.PI);

		if (angle > 180.0) {
			angle = 360 - angle;
		}

		return angle;
	};

	const onResults = (results: Results) => {
		if (
			results.poseLandmarks &&
			canvasRef.current &&
			webcamRef.current?.video
		) {
			const canvasCtx = canvasRef.current.getContext("2d");
			if (!canvasCtx) return;

			// Clear the canvas
			canvasCtx.save();
			canvasCtx.clearRect(
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height,
			);

			// Draw the video frame
			canvasCtx.drawImage(
				webcamRef.current.video,
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height,
			);

			// Draw the pose landmarks
			drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
				color: "#00FF00",
				lineWidth: 4,
			});
			drawLandmarks(canvasCtx, results.poseLandmarks, {
				color: "#FF0000",
				lineWidth: 2,
			});

			const landmarks = results.poseLandmarks;

			// Get hip, knee, and ankle points for right leg
			const hip = landmarks[24]; // Right hip
			const knee = landmarks[26]; // Right knee
			const ankle = landmarks[28]; // Right ankle

			if (hip && knee && ankle) {
				const angle = calculateAngle(
					{ x: hip.x, y: hip.y },
					{ x: knee.x, y: knee.y },
					{ x: ankle.x, y: ankle.y },
				);

				setCurrentAngle(Math.round(angle));

				// Detect squat based on knee angle with hysteresis
				if (angle < squatThreshold && !isSquattingRef.current) {
					isSquattingRef.current = true;
					setIsSquatting(true);
				} else if (angle > standingThreshold && isSquattingRef.current) {
					isSquattingRef.current = false;
					setIsSquatting(false);
					setRepCount((prev) => prev + 1);
				}

				// Draw angle on canvas
				canvasCtx.font = "30px Arial";
				canvasCtx.fillStyle = "white";
				canvasCtx.fillText(
					`Angle: ${Math.round(angle)}°`,
					knee.x * canvasRef.current.width,
					knee.y * canvasRef.current.height,
				);

				lastAngleRef.current = angle;
			}

			canvasCtx.restore();
		}
	};

	return (
		<div className="squat-counter">
			<h1>Squat Counter</h1>
			<div className="metrics">
				<div className="counter">Reps: {repCount}</div>
				<div className={`status ${isSquatting ? "squatting" : "standing"}`}>
					{isSquatting ? "SQUATTING" : "STANDING"}
				</div>
				<div className="angle">Knee Angle: {Math.round(currentAngle)}°</div>
			</div>
			<div className="camera-view">
				<Webcam
					ref={webcamRef}
					style={{ display: "none" }}
					width={640}
					height={480}
				/>
				<canvas
					ref={canvasRef}
					width={640}
					height={480}
					style={{
						border: "2px solid #333",
						borderRadius: "8px",
					}}
				/>
			</div>
			<div className="instructions">
				<h3>Instructions:</h3>
				<ul>
					<li>Stand sideways to the camera</li>
					<li>Keep your entire body visible</li>
					<li>Perform squats at a moderate pace</li>
					<li>
						Current thresholds: Squat ({squatThreshold}°) - Stand (
						{standingThreshold}°)
					</li>
				</ul>
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
