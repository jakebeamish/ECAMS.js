let options = {
	"Rule": 3,
	// 18, 22, 48, 54, 73, 167
	"Second order": true,
	"ExperimentalA": false,
	"ExperimentalB": true,
	"Seed": 23,
	"Offset": 125,
	"Rotate": 0,
	"Impulse": true,
	"Random": true,
	"Random amount": 0.5,
	"Cell width": 2.5,
	"Cell height": 2.5,
	"Array width": 400,
	"Array height": 250,
	"Stroke weight": 1,
	"Points": false,
	"Rects": false,
	"Ellipses": false,
	"Square march": true,
	"Border": false
}

let cellWidth = () => options["Cell width"];
let cellHeight = () => options["Cell height"];
let arrayWidth = () => options["Array width"];
let arrayHeight = () => options["Array height"];

let cells = [];

const gui = new dat.GUI();

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(1)
	let setupFolder = gui.addFolder("Setup");
	setupFolder.add(options, "Rule", 0, 255, 1);
	setupFolder.add(options, "Second order").listen();
	setupFolder.add(options, "ExperimentalA")
	setupFolder.add(options, "ExperimentalB")
	setupFolder.add(options, "Seed", 0, 9999, 1).listen();
	setupFolder.add(options, "Offset", 0, 999, 1).listen();
	setupFolder.add(options, "Rotate", 0, 999, 1).listen();
	setupFolder.add(options, "Impulse").listen();
	setupFolder.add(options, "Random").listen();
	setupFolder.add(options, "Random amount", 0, 1).listen();

	let sizeFolder = gui.addFolder("Size")
	sizeFolder.add(options, "Cell width", 1, 20, 1);
	sizeFolder.add(options, "Cell height", 1, 20, 1);
	sizeFolder.add(options, "Array width", 1, 500, 1);
	sizeFolder.add(options, "Array height", 1, 500, 1);

	let drawFolder = gui.addFolder("Draw")
	drawFolder.add(options, "Stroke weight", 1, 10);
	drawFolder.add(options, "Points").listen();
	drawFolder.add(options, "Rects").listen();
	drawFolder.add(options, "Ellipses").listen();
	drawFolder.add(options, "Square march").listen();
	drawFolder.add(options, "Border").listen();

	cells = [];
}

function draw() {
	clear();
	background(255);
	cells = [];
	randomSeed(options["Seed"]);
	let ruleset = binaryArray(options["Rule"]);
	seedCells(cells);
	generateCells(cells, ruleset);
	drawCells(cells);
}

function seedCells(cells) {
	cells[0] = [];
	for (let i = 0; i < options["Array width"]; i++) {
		cells[0][i] = 0;
	}
	if (options["Impulse"]) {
		for (let i = 0; i < arrayWidth(); i++) {
			cells[0][i] = 0;
			let middle = floor(arrayWidth() * 0.5);
			cells[0][middle] = 1;
		}
	}
	if (options["Random"]) {
		for (let i = 0; i < options["Random amount"] * options["Random amount"] * arrayWidth(); i++) {
			let x = floor(random(arrayWidth() + 1));
			cells[0][x] = 1;
		}
	}
	for (let j = 1; j < arrayHeight(); j++) {
		cells[j] = [];
		for (let i = 0; i < arrayWidth(); i++) {
			cells[j][i] = 1;
		}
	}
}
// let z;
function generateCells(cells, ruleset) {
	for (let j = 0; j < arrayHeight() - 1; j++) {
		for (let i = 0; i < arrayWidth(); i++) {
			let left = (i + arrayWidth() - 1) % arrayWidth();
			let right = (i + arrayWidth() + 1) % arrayWidth();
			cells[j + 1][i] = rules(cells[j][left], cells[j][i], cells[j][right], ruleset);
			if (options["Second order"] && j > 1) {
				let z = 1;
				if (options["ExperimentalA"]) {
					z = floor(random(2))
				}
				cells[j + 1][i] = cells[j + z][i] ^ cells[j - 1][i];
				// cells[j + 1][i] = cells[j+(floor(random(2)))][i] ^ cells[j - 1][i];

			}
		}
	}

	for (let delta = 0; delta < options["Offset"]; delta++) {
		let next = [];
		let j = arrayHeight() - 1;
		for (let i = 0; i < arrayWidth(); i++) {
			let left = (i + arrayWidth() - 1) % arrayWidth();
			let right = (i + arrayWidth() + 1) % arrayWidth();
			next[i] = rules(cells[j][left], cells[j][i], cells[j][right], ruleset);
			if (options["Second order"]) {
			let z = 1;
				if (options["ExperimentalB"]) {
					
					z = floor(random(2) + 3)
				}
				next[i] = next[i] ^ cells[j - z][i];
			}
		}
		cells.shift();
		cells.push(next);
	}

	for (let j = 0; j < arrayHeight(); j++) {
		for (let rotate = 0; rotate < Math.abs(options["Rotate"]); rotate++) {
			if (options["Rotate"] < 0) {
				let last = cells[j].pop();
				cells[j].unshift(last);
			} else if (options["Rotate"] > 0) {
				let first = cells[j].shift();
				cells[j].push(first);
			}
		}
	}
}

function binaryArray(n) {
	return Array.from(("00000000" + n.toString(2)).slice(-8)).map(function (string) {
		return parseInt(string);
	});
}

function rules(a, b, c, ruleset) {
	if (a == 1 && b == 1 && c == 1) return ruleset[0];
	if (a == 1 && b == 1 && c == 0) return ruleset[1];
	if (a == 1 && b == 0 && c == 1) return ruleset[2];
	if (a == 1 && b == 0 && c == 0) return ruleset[3];
	if (a == 0 && b == 1 && c == 1) return ruleset[4];
	if (a == 0 && b == 1 && c == 0) return ruleset[5];
	if (a == 0 && b == 0 && c == 1) return ruleset[6];
	if (a == 0 && b == 0 && c == 0) return ruleset[7];
	else return 0;
}

function getState(a, b, c, d) {
	return a * 8 + b * 4 + c * 2 + d * 1;
}

function vLine(a, b) {
	line(a.x, a.y, b.x, b.y);
}

function vLineSVG(a, b, svg) {
	svg.line(a.x, a.y, b.x, b.y);
}

function drawCells(cells) {
	strokeWeight(options["Stroke weight"]);

	if (options["Border"]) {
		push()
		rectMode(CORNER)
		rect(
			width / 2 - (cellWidth() * arrayWidth() * 0.5),
			height / 2 - (cellHeight() * arrayHeight() * 0.5),
			(cellWidth() * (arrayWidth() - 1)),
			(cellHeight() * (arrayHeight()))
		)
		pop()
	}
	noFill();
	for (let j = 0; j < arrayHeight(); j++) {
		for (let i = 0; i < arrayWidth(); i++) {
			if (cells[j][i] === 1) {
				let x = width / 2 - (cellWidth() * arrayWidth()) / 2 + i * cellWidth();
				let y = height / 2 - (cellHeight() * arrayHeight()) / 2 + j * cellHeight();
				if (options["Points"]) {
					point(x, y);
				}
				if (options["Rects"]) {
					rectMode(CENTER);
					rect(x, y, cellWidth(), cellHeight());
				}
				if (options["Ellipses"]) {
					ellipse(x, y, cellWidth(), cellHeight());
				}
			}
		}
	}
	if (options["Square march"]) {

		// First, add extra 0s around each edge of the cells array
		// This closes off all the shapes made by the marching squares

		for (let a = 0; a < options["Array height"]; a++) {
			cells[a].unshift(0);
			cells[a].push(0);
		}

		let next = [];

		for (let i = 0; i <= options["Array width"]; i++) {
			next.push(0);
		}
		cells.unshift(next);
		cells.push(next);

		for (let j = 0; j <= options["Array height"]; j++) {
			for (let i = 0; i <= options["Array width"]; i++) {
				let x = width / 2 - (cellWidth() * options["Array width"]) / 2 + (i * cellWidth());
				let y = height / 2 - (cellHeight() * options["Array height"]) / 2 + (j * cellHeight());

				let a = createVector(x + cellWidth() * 0.5, y);
				let b = createVector(x + cellWidth(), y + cellHeight() * 0.5);
				let c = createVector(x + cellWidth() * 0.5, y + cellHeight());
				let d = createVector(x, y + cellHeight() * 0.5);

				let state = getState(cells[j][i], cells[j][i + 1], cells[j + 1][i + 1], cells[j + 1][i]);

				switch (state) {
					case 0:
						// line(d, b);
						break;
					case 1:
						vLine(c, d);
						break;
					case 2:
						vLine(b, c);
						break;
					case 3:
						vLine(b, d);
						break;
					case 4:
						vLine(a, b);
						break;
					case 5:
						vLine(a, d);
						vLine(b, c);
						break;
					case 6:
						vLine(a, c);
						break;
					case 7:
						vLine(a, d);
						break;
					case 8:
						vLine(a, d);
						break;
					case 9:
						vLine(a, c);
						break;
					case 10:
						vLine(a, b);
						vLine(c, d);
						break;
					case 11:
						vLine(a, b);
						break;
					case 12:
						vLine(b, d);
						break;
					case 13:
						vLine(b, c);
						break;
					case 14:
						vLine(c, d);
						break;
				}
			}
		}
	}
}

function drawCellsSVG(cells) {
	let svg = createGraphics(windowWidth, windowHeight, SVG);

	strokeWeight(options["Stroke weight"]);
	noFill();

	if (options["Border"]) {
		push()
		rectMode(NORMAL)
		svg.rect(
			width / 2 - (cellWidth() * arrayWidth() * 0.5),
			height / 2 - (cellHeight() * arrayHeight() * 0.5),
			(cellWidth() * (arrayWidth() - 1)),
			(cellHeight() * (arrayHeight()))
		)
		pop()
	}

	for (let j = 0; j < arrayHeight(); j++) {
		for (let i = 0; i < arrayWidth(); i++) {
			if (cells[j][i] === 1) {
				let x = width / 2 - (cellWidth() * arrayWidth()) / 2 + i * cellWidth();
				let y = height / 2 - (cellHeight() * arrayHeight()) / 2 + j * cellHeight();
				if (options["Points"]) {
					svg.point(x, y);
				}
				if (options["Rects"]) {
					svg.rectMode(CENTER);
					svg.rect(x, y, cellWidth(), cellHeight());
				}
				if (options["Ellipses"]) {
					svg.ellipse(x, y, cellWidth(), cellHeight());
				}
			}
		}
	}
	if (options["Square march"]) {

		// First, add extra 0s around each edge of the cells array
		// This closes off all the shapes made by the marching squares

		for (let a = 0; a < arrayHeight(); a++) {
			cells[a].unshift(0);
			cells[a].push(0);
		}

		let next = [];

		for (let i = 0; i <= arrayWidth(); i++) {
			next.push(0);
		}
		cells.unshift(next);
		cells.push(next);

		for (let j = 0; j <= arrayHeight() + 1; j++) {
			for (let i = 0; i <= arrayWidth() + 1; i++) {
				let x = width / 2 - (cellWidth() * arrayWidth()) / 2 + (i * cellWidth());
				let y = height / 2 - (cellHeight() * arrayHeight()) / 2 + (j * cellHeight());

				let a = createVector(x + cellWidth() * 0.5, y);
				let b = createVector(x + cellWidth(), y + cellHeight() * 0.5);
				let c = createVector(x + cellWidth() * 0.5, y + cellHeight());
				let d = createVector(x, y + cellHeight() * 0.5);

				let state = getState(cells[j][i], cells[j][i + 1], cells[j + 1][i + 1], cells[j + 1][i]);

				switch (state) {
					case 0:
						// line(d, b);
						break;
					case 1:
						vLineSVG(c, d, svg);
						break;
					case 2:
						vLineSVG(b, c, svg);
						break;
					case 3:
						vLineSVG(b, d, svg);
						break;
					case 4:
						vLineSVG(a, b, svg);
						break;
					case 5:
						vLineSVG(a, d, svg);
						vLineSVG(b, c, svg);
						break;
					case 6:
						vLineSVG(a, c, svg);
						break;
					case 7:
						vLineSVG(a, d, svg);
						break;
					case 8:
						vLineSVG(a, d, svg);
						break;
					case 9:
						vLineSVG(a, c, svg);
						break;
					case 10:
						vLineSVG(a, b, svg);
						vLineSVG(c, d, svg);
						break;
					case 11:
						vLineSVG(a, b, svg);
						break;
					case 12:
						vLineSVG(b, d, svg);
						break;
					case 13:
						vLineSVG(b, c, svg);
						break;
					case 14:
						vLineSVG(c, d, svg);
						break;
				}
			}
		}
	}
	svg.save(filename() + ".svg");
}

function filename() {
	// returns a filename that looks like "rule76R_seed23_offset0_rotate0_R_0.3_3x3_200x200_square_marched.svg"
	return `rule${options["Rule"]}${options["Second order"] ? "R" : ""}_seed${options["Seed"]}_offset${options["Offset"]}_rotate${options["Rotate"]}_${options["Impulse"] ? "I" : "R:" + options["Random amount"]}_${options["Cell width"]}x${options["Cell height"]}_${options["Array width"]}x${options["Array height"]}_${options["Points"] ? "points_" : ""}${options["Rects"] ? "rects_" : ""}${options["Ellipses"] ? "ellipses_" : ""}${options["Square march"] ? "square_marched" : ""}`;
}

function keyPressed() {
	// keyboard shortcuts
	if (keyCode === RIGHT_ARROW) {
		options["Rotate"]++;
	}
	if (keyCode === LEFT_ARROW) {
		options["Rotate"]--;
	}
	if (keyCode === DOWN_ARROW) {
		options["Offset"]++;
	}
	if (keyCode === UP_ARROW && options["Offset"] > 0) {
		options["Offset"]--;
	}
	if (keyCode === 83) {
		// 'S'
		options["Seed"] = floor(random(10000));
	}
	if (keyCode === 79) {
		// 'o'
		options["Second order"] = !options["Second order"];
	}
	if (keyCode === 81) {
		// 'q'
		options["Square march"] = !options["Square march"];
	}
	if (keyCode === 80) {
		// 'p'
		options["Points"] = !options["Points"];
	}
	if (keyCode === 69) {
		// 'e'
		options["Ellipses"] = !options["Ellipses"];
	}
	if (keyCode === 82) {
		// 'r'
		options["Rects"] = !options["Rects"];
	}
	if (keyCode === 73) {
		// 'i'
		options["Impulse"] = !options["Impulse"];
		options["Random"] = !options["Random"];
	}
	if (keyCode === 188 && options["Random amount"] > 0.05) {
		// ','
		options["Random amount"] -= 0.05;
	}
	if (keyCode === 190 && options["Random amount"] < 0.95) {
		// '.'
		options["Random amount"] += 0.05;
	}
	if (keyCode === 68) {
		// 'd'
		drawCellsSVG(cells);
	}
}
