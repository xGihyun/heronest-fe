import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage } from "konva/lib/Stage";
import type { Vector2d } from "konva/lib/types";
import { SCALE_MULTIPLIER, SLIDER_SCALE } from "./constants";

export function handleWheel(
	e: KonvaEventObject<WheelEvent, Stage>,
	stage: Stage
): number {
	e.evt.preventDefault();

	const oldScale = stage.scaleX();
	const pointerPosition = stage.getPointerPosition();

	if (pointerPosition === null) {
		console.warn("Stage pointer position not found.");
		return 10;
	}

	const newPointerPosition: Vector2d = {
		x: (pointerPosition.x - stage.x()) / oldScale,
		y: (pointerPosition.y - stage.y()) / oldScale
	};

	let direction = e.evt.deltaY < 0 ? 1 : -1;

	if (e.evt.ctrlKey) {
		direction = -direction;
	}

	let newScale =
		direction > 0 ? oldScale * SCALE_MULTIPLIER : oldScale / SCALE_MULTIPLIER;

	if (newScale < SLIDER_SCALE.min) {
		newScale = SLIDER_SCALE.min;
	}

	if (newScale > SLIDER_SCALE.max) {
		newScale = SLIDER_SCALE.max;
	}

	stage.scale({ x: newScale, y: newScale });

	const newStagePosition: Vector2d = {
		x: pointerPosition.x - newPointerPosition.x * newScale,
		y: pointerPosition.y - newPointerPosition.y * newScale
	};

	stage.position(newStagePosition);

	return newScale;
}

export function handleZoom(
	mode: "in" | "out" | "set",
	stage: Stage,
	currentScale: number,
	newValue?: number
): number {
	let newScale: number;

	if (mode === "in" && currentScale < SLIDER_SCALE.max) {
		newScale = Math.min(currentScale + SLIDER_SCALE.step, SLIDER_SCALE.max);
	} else if (mode === "out" && currentScale > SLIDER_SCALE.min) {
		newScale = Math.max(currentScale - SLIDER_SCALE.step, SLIDER_SCALE.min);
	} else if (mode === "set" && newValue !== undefined) {
		newScale = Math.max(Math.min(newValue, SLIDER_SCALE.max), SLIDER_SCALE.min);
	} else {
		return currentScale;
	}

	const stageCenter: Vector2d = {
		x: stage.width() / 2,
		y: stage.height() / 2
	};

	const oldScale = stage.scaleX();
	const oldPosition = stage.position();

	const viewCenter: Vector2d = {
		x: (stageCenter.x - oldPosition.x) / oldScale,
		y: (stageCenter.y - oldPosition.y) / oldScale
	};

	const newStagePosition = {
		x: stageCenter.x - viewCenter.x * newScale,
		y: stageCenter.y - viewCenter.y * newScale
	};

	stage.scale({ x: newScale, y: newScale });
	stage.position(newStagePosition);

	return newScale;
}
