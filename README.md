
# Elementary Cellular Automata with Marching Squares

This is a small web application written in JavaScript for generating line-based images of Wolfram's Elementary Cellular Automata using Marching Squares.

The image is drawn using [p5.js](), and can be downloaded as an SVG (made using [Zenozeng's p5.js-svg runtime](https://zenozeng.github.io/p5.js-svg/)).

It has a simple dat.GUI interface and some keyboard shortcuts for interacting with the app.

The initial cell states can be set to 'Impulse', which is all 0 except the centre cell, and 'Random', where a proportion of cells set by the Random Amount slider and chosen through the Seed are set to 1.

---

| Action | Keyboard shortcut |
|-|-|
|Select a Rule number between 0-255. | |
| Toggle the second-order option to XOR the current cell state with it's state at $t-2$. | <kbd>o</kbd> |
| Change the Seed number for the PRNG that can be used to determine the initial cell states. | <kbd>s</kbd> (Chooses a random new seed) |
| Rotate the grid of cells left or right. The left edge wraps to the right and vice versa. | <kbd>←</kbd> <kbd>→</kbd> |
| Scroll through further iterations. | <kbd>↓</kbd> <kbd>↑</kbd> |
| Toggle initial cell states between Impulse (only the centre cell is set to `1`) and Random (set a randomly distributed proportion of cells to `1`) | <kbd>i</kbd> |
| Change the proportion of cells that will be randomly set to `1` | <kbd>,</kbd> <kbd>.</kbd> |
| Download SVG | `Enter` |

---

Size settings allow for adjusting the size of the grid of cells, and the size of an individual cell.

Draw settings can be used to toggle the Marching Squares algorithm, or to draw cells as points or shapes.

After downloading an image, I use `vpype` to optimise the file with line merging and sorting, and then plot it out using the Inkscape AxiDraw plugin.

---


### TODO
- Implement dark mode
- Intefere with the marching squares
