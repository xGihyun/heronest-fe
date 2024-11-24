import { Rect } from "konva/lib/shapes/Rect";
import { parseTransform } from "../utils";

export function createSeatFromSvg(rect: SVGRectElement): Rect {
	let x = parseFloat(rect.getAttribute("x") || "0");
	let y = parseFloat(rect.getAttribute("y") || "0");
	const width = parseFloat(rect.getAttribute("width") || "0");
	const height = parseFloat(rect.getAttribute("height") || "0");
	const transform = rect.getAttribute("transform");
	//const fill = rect.getAttribute("fill") || "#888888";

	let rotation = 0;
	let scaleX = 1;
	let scaleY = 1;

	if (transform !== null) {
		const matrix = parseTransform(transform);

		if (matrix !== null) {
			rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
			scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
			scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
			x = matrix.e;
			y = matrix.f;
		}
	}

	const seat = new Rect({
		x: x,
		y: y,
		width: width,
		height: height,
		fill: "#888888",
		rotation: rotation,
		scaleX: scaleX,
		scaleY: scaleY,
		offsetY: height / 2,
		name: "seat"
	});

	return seat;
}
