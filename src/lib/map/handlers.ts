import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage } from "konva/lib/Stage";
import type { Vector2d } from "konva/lib/types";
import { SCALE_MULTIPLIER } from "./constants";

export function handleWheel(
	e: KonvaEventObject<WheelEvent, Stage>,
	stage: Stage
): void {
	e.evt.preventDefault();

	const oldScale = stage.scaleX();
	const pointerPosition = stage.getPointerPosition();

	if (pointerPosition === null) {
		console.warn("Stage pointer position not found.");
		return;
	}

	const newPointerPosition: Vector2d = {
		x: (pointerPosition.x - stage.x()) / oldScale,
		y: (pointerPosition.y - stage.y()) / oldScale
	};

	let direction = e.evt.deltaY < 0 ? 1 : -1;

	if (e.evt.ctrlKey) {
		direction = -direction;
	}

	const newScale =
		direction > 0 ? oldScale * SCALE_MULTIPLIER : oldScale / SCALE_MULTIPLIER;

	stage.scale({ x: newScale, y: newScale });

	const newStagePosition: Vector2d = {
		x: pointerPosition.x - newPointerPosition.x * newScale,
		y: pointerPosition.y - newPointerPosition.y * newScale
	};

	stage.position(newStagePosition);
}
