let options = {
	"Rule": 22,

	"Second order": true,
	"Seed": 23,
	"Offset": 0,
	"Rotate": 0,

	"Impulse": true,
	"Random": true,
	"Random amount": 0.5,

	"Cell width": 4,
	"Cell height": 4,
	"Array width": 200,
	"Array height": 200,

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



	let setupFolder = gui.addFolder("Setup");
	setupFolder.add(options, "Rule", 0, 255, 1);
	setupFolder.add(options, "Second order");
	setupFolder.add(options, "Seed", 0, 9999, 1);
	setupFolder.add(options, "Offset", 0, 999, 1);
	setupFolder.add(options, "Rotate", 0, 999, 1)
	// gui.add(options, "Scroll");
	setupFolder.add(options, "Impulse");
	setupFolder.add(options, "Random");
	setupFolder.add(options, "Random amount", 0, 1);


	let sizeFolder = gui.addFolder("Size")
	sizeFolder.add(options, "Cell width", 1, 20, 1);
	sizeFolder.add(options, "Cell height", 1, 20, 1);
	sizeFolder.add(options, "Array width", 1, 1000, 1);
	sizeFolder.add(options, "Array height", 1, 1000, 1);

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
		cells[0][i] = 0;
	}


	if (options["Impulse"]) {
		for (let i = 0; i < arrayWidth(); i++) {
			// let middle = floor(arrayWidth());
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


function generateCells(cells, ruleset) {
	for (let j = 0; j < arrayHeight() - 1; j++) {
		for (let i = 0; i < arrayWidth(); i++) {
			let left = (i + arrayWidth() - 1) % arrayWidth();
			let right = (i + arrayWidth() + 1) % arrayWidth();
			cells[j + 1][i] = rules(cells[j][left], cells[j][i], cells[j][right], ruleset);
			if (options["Second order"] && j > 1) {
				cells[j + 1][i] = cells[j + 1][i] ^ cells[j-1][i];
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
				next[i] = next[i] ^ cells[j-1][i];
			}
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