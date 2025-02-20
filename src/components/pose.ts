const calculateAngle = (p1: any, p2: any, p3: any) => {
	const radians =
		Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
	let angle = Math.abs((radians * 180.0) / Math.PI);

	if (angle > 180.0) {
		angle = 360 - angle;
	}

	return angle;
};

interface PoseLandmark {
	x: number;
	y: number;
	z?: number;
	visibility?: number;
}

export enum PoseType {
	UNKNOWN = "unknown",
	STANDING = "standing",
	DEEP_SQUAT = "deep_squat",
	PARTIAL_SQUAT = "partial_squat",
	SINGLE_LEG_SQUAT_LEFT = "single_leg_squat_left",
	SINGLE_LEG_SQUAT_RIGHT = "single_leg_squat_right",
	LUNGE_LEFT = "lunge_left",
	LUNGE_RIGHT = "lunge_right",
	FORWARD_BEND = "forward_bend",
	T_POSE = "t_pose",
}


interface AngleThresholds {
	kneeMin: number;
	kneeMax: number;
	hipMin?: number;
	hipMax?: number;
	ankleMin?: number;
	ankleMax?: number;
}

const POSE_THRESHOLDS: Record<PoseType, AngleThresholds> = {
	[PoseType.DEEP_SQUAT]: {
		kneeMin: 50,
		kneeMax: 95,
		hipMin: 50,
		hipMax: 100,
	},
	[PoseType.PARTIAL_SQUAT]: {
		kneeMin: 95,
		kneeMax: 150,
		hipMin: 70,
		hipMax: 130,
	},
	[PoseType.STANDING]: {
		kneeMin: 150,
		kneeMax: 180,
		hipMin: 160,
		hipMax: 180,
	},
	[PoseType.SINGLE_LEG_SQUAT_LEFT]: {
		kneeMin: 50,
		kneeMax: 95,
		hipMin: 50,
		hipMax: 100,
	},
	[PoseType.SINGLE_LEG_SQUAT_RIGHT]: {
		kneeMin: 50,
		kneeMax: 95,
		hipMin: 50,
		hipMax: 100,
	},
	[PoseType.LUNGE_LEFT]: {
		kneeMin: 80,
		kneeMax: 100,
		hipMin: 90,
		hipMax: 140,
	},
	[PoseType.LUNGE_RIGHT]: {
		kneeMin: 80,
		kneeMax: 100,
		hipMin: 90,
		hipMax: 140,
	},
	[PoseType.FORWARD_BEND]: {
		hipMin: 30,
		hipMax: 90,
		kneeMin: 150,
		kneeMax: 180,
	},
	[PoseType.T_POSE]: { kneeMin: 160, kneeMax: 180, hipMin: 160, hipMax: 180 },
	[PoseType.UNKNOWN]: { kneeMin: 0, kneeMax: 180 },
};

export const classifyPose = (landmarks: PoseLandmark[]): PoseType => {
	if (!landmarks || landmarks.length < 33) return PoseType.UNKNOWN;

	// Key landmarks
	const leftHip = landmarks[23];
	const rightHip = landmarks[24];
	const leftKnee = landmarks[25];
	const rightKnee = landmarks[26];
	const leftAnkle = landmarks[27];
	const rightAnkle = landmarks[28];
	const leftShoulder = landmarks[11];
	const rightShoulder = landmarks[12];

	// Calculate key angles
	const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
	const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
	const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
	const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

	if (!leftShoulder || !rightShoulder) {
		return PoseType.UNKNOWN;
	}

	// Check for T-pose
	const shoulderAngle = calculateAngle(
		leftShoulder,
		{ x: (leftShoulder.x + rightShoulder.x) / 2, y: leftShoulder.y },
		rightShoulder,
	);
	if (shoulderAngle > 160 && rightKneeAngle > 160 && leftKneeAngle > 160) {
		return PoseType.T_POSE;
	}

	// Check for forward bend
	if (
		rightHipAngle < 90 &&
		leftHipAngle < 90 &&
		rightKneeAngle > 150 &&
		leftKneeAngle > 150
	) {
		return PoseType.FORWARD_BEND;
	}

	// Check for squats and lunges
	if (rightKneeAngle < 95 && leftKneeAngle < 95) {
		return PoseType.DEEP_SQUAT;
	} else if (rightKneeAngle < 150 && leftKneeAngle < 150) {
		return PoseType.PARTIAL_SQUAT;
	}

	// Single leg squats
	if (rightKneeAngle < 95 && leftKneeAngle > 150) {
		return PoseType.SINGLE_LEG_SQUAT_RIGHT;
	} else if (leftKneeAngle < 95 && rightKneeAngle > 150) {
		return PoseType.SINGLE_LEG_SQUAT_LEFT;
	}

	// Lunges
	if (rightKneeAngle < 100 && leftKneeAngle > 150) {
		return PoseType.LUNGE_RIGHT;
	} else if (leftKneeAngle < 100 && rightKneeAngle > 150) {
		return PoseType.LUNGE_LEFT;
	}

	// Standing
	if (rightKneeAngle > 150 && leftKneeAngle > 150) {
		return PoseType.STANDING;
	}

	return PoseType.UNKNOWN;
};
