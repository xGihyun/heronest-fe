import type { Group } from "konva/lib/Group";
import type { TransformMatrix } from "./types";
import { createSeatFromSvg } from "./seat/utils";
import type { Seat } from "./seat/types";
import { Node } from "konva/lib/Node";
import type { Rect } from "konva/lib/shapes/Rect";
import Konva from "konva";
import { MAP_PADDING } from "./constants";

export function parseTransform(transform: string): TransformMatrix | null {
	if (!transform.includes("matrix")) {
		return null;
	}

	const matrix = transform
		.match(/matrix\(([-\d.]+\s*,?\s*){6}\)/)?.[0]
		.slice(7, -1)
		.split(/[\s,]+/)
		.map(Number);

	if (!matrix || matrix.length !== 6) {
		return null;
	}

	return {
		a: matrix[0],
		b: matrix[1],
		c: matrix[2],
		d: matrix[3],
		e: matrix[4],
		f: matrix[5]
	};
}

export function loadFromSvg(svgText: string, group: Group): void {
	group.destroyChildren();

	const domParser = new DOMParser();
	const svgDoc = domParser.parseFromString(svgText, "image/svg+xml");

	const svgRects = svgDoc.querySelectorAll("rect");

	svgRects.forEach((rect) => {
		const seat = createSeatFromSvg(rect);

		group.add(seat);
	});
}

export function loadSeats(seats: Seat[], group: Group): void {
	seats.forEach((seat) => {
		const node: Rect = Node.create(seat.metadata);
		node.on("click", () => {
			console.log(seat);
		});
		group.add(node);
	});
}

export function setupMap(
	stage: Konva.Stage,
	layer: Konva.Layer,
	seatsGroup: Konva.Group
): void {
	const seatsBox = seatsGroup.getClientRect();

	const mapBackground = new Konva.Rect({
		x: 0,
		y: 0,
		width: seatsBox.width + MAP_PADDING,
		height: seatsBox.height + MAP_PADDING,
		fill: "#333333",
		stroke: "#BBBBBB",
		strokeWidth: 4
	});
	mapBackground.cache();
	mapBackground.filters([Konva.Filters.Noise]);
	mapBackground.noise(0.05);

	const mapGroup = new Konva.Group();

	mapGroup.add(mapBackground);
	mapGroup.add(seatsGroup);

	layer.add(mapGroup);
	stage.add(layer);

	const mapRect = mapGroup.getClientRect();

	const stageCenter = {
		x: stage.width() / 2,
		y: stage.height() / 2
	};

	seatsGroup.position({
		x: (seatsBox.width + MAP_PADDING - seatsBox.width) / 2,
		y: (seatsBox.height + MAP_PADDING - seatsBox.height) / 2
	});

	mapGroup.position({
		x: stageCenter.x - mapRect.width / 2 - mapRect.x,
		y: stageCenter.y - mapRect.height / 2 - mapRect.y
	});

	stage.batchDraw();
}
