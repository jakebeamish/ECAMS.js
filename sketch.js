let options = {
	"Rule": 101,
	"Seed": 23,
	"Offset": 0,
	"Rotate": 100,

	"Impulse": true,

	"Cell width": 5,
	"Cell height": 5,
	"Array width": 100,
	"Array height": 150,

	"Stroke weight": 1,
	"Points": false,
	"Rects": true
}

// let cellWidth = options["Cell width"];
// let cellHeight = options["Cell height"];
// let arrayWidth = options["Array width"];
// let arrayHeight = options["Array height"];

const cellWidth = () => options["Cell width"];
const cellHeight = () => options["Cell height"];
const arrayWidth = () => options["Array width"];
const arrayHeight = () => options["Array height"];

let cells = [];

const gui = new dat.GUI();

function setup() {
	createCanvas(windowWidth, windowHeight);

	gui.add(options, "Rule", 0, 255, 1);
	gui.add(options, "Seed", 0, 9999, 1);
	gui.add(options, "Offset", 0, 999, 1);
	gui.add(options, "Rotate", 0, 999, 1)

	gui.add(options, "Impulse");

	let sizeFolder = gui.addFolder("Size")
	sizeFolder.add(options, "Cell width", 1, 20);
	sizeFolder.add(options, "Cell height", 1, 20);
	sizeFolder.add(options, "Array width", 1, 100, 1);
	sizeFolder.add(options, "Array height", 1, 100, 1);

	let drawFolder = gui.addFolder("Draw")
	drawFolder.add(options, "Stroke weight", 1, 10);
	drawFolder.add(options, "Points");
	drawFolder.add(options, "Rects")


	cells = [];




}

function draw() {
	cells = [];
	randomSeed(options["Seed"]);
	let ruleset = binaryArray(options["Rule"]);

	seedCells(cells);
	generateCells(cells, ruleset);

	background(255);
	drawCells(cells);
}

function seedCells(cells) {
	cells[0] = [];
	for (let i = 0; i < arrayWidth(); i++) {
		cells[0][i] = floor(random(2));
	}
	for (let j = 1; j < arrayHeight(); j++) {
		cells[j] = [];
		for (let i = 0; i < arrayWidth(); i++) {
			cells[j][i] = 1;
		}
	}
}


function generateCells(cells, ruleset) {
	for (let j = 0; j < arrayHeight() - 1; j++) {
		for (let i = 0; i < arrayWidth(); i++) {
			let left = (i + arrayWidth() - 1) % arrayWidth();
			let right = (i + arrayWidth() + 1) % arrayWidth();
			cells[j + 1][i] = rules(cells[j][left], cells[j][i], cells[j][right], ruleset);
		}
	}

	for (let delta = 0; delta < options["Offset"]; delta++) {

		let next = [];
		let j = arrayHeight() - 1;
		for (let i = 0; i < arrayWidth(); i++) {
			let left = (i + arrayWidth() - 1) % arrayWidth();
			let right = (i + arrayWidth() + 1) % arrayWidth();
			next[i] = rules(cells[j][left], cells[j][i], cells[j][right], ruleset);
		}
		cells.shift();

		cells.push(next);
	}


	for (let j = 0; j < arrayHeight(); j++) {

	for (let rotate = 0; rotate < options["Rotate"]; rotate++) {
		let last = cells[j].pop();
		cells[j].unshift(last);
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


function drawCells(cells) {
	strokeWeight(options["Stroke weight"]);
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
			}
		}
	}
}

// https://en.wikipedia.org/wiki/Elementary_cellular_automaton