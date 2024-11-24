import type { Group } from "konva/lib/Group";
import type { TransformMatrix } from "./types";
import { createSeatFromSvg } from "./seat/utils";

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

export async function loadFromSvg(url: string, group: Group): Promise<void> {
	const response = await fetch(url);
	const svgText = await response.text();
	const domParser = new DOMParser();
	const svgDoc = domParser.parseFromString(svgText, "image/svg+xml");

	const svgRects = svgDoc.querySelectorAll("rect");

	svgRects.forEach((rect) => {
		const seat = createSeatFromSvg(rect);

		group.add(seat);
	});
}
