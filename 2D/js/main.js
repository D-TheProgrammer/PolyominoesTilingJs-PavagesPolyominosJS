import { GridBoard } from './board.js';
import { Polyomino, SHAPES } from './polyomino.js';

class MainApp {
	constructor() {
		this.canvas = document.getElementById('myCanvas');
		this.gridSize = 30;
		this.rows = 10;
		this.cols = 10;
		this.polyominoes = [];
		this.selectedPolyomino = null;
		this.icons = {
			flip: new Image(),
			rotateLeft: new Image(),
			rotateRight: new Image()
		};
		const as = "../assets/";
		this.icons.flip.src = as+'ic_flip.png';
		this.icons.rotateLeft.src = as+'ic_rotate_left.png';
		this.icons.rotateRight.src = as+'ic_rotate_right.png';
		this.gridBoard = new GridBoard(this.canvas, this.gridSize, this.rows, this.cols);
		this.init();
	};

	init() {
		this.createPolyominoes();
		this.addEventListeners();
	};

	createPolyominoes() {
		this.polyominoes.push(new Polyomino(SHAPES.TETROMINO_I, 100, 100, 'red', this));
		this.polyominoes.push(new Polyomino(SHAPES.TETROMINO_O, 200, 100, 'blue', this));
		this.polyominoes.push(new Polyomino(SHAPES.MONOMINO, 300, 100, 'green', this));
		this.polyominoes.push(new Polyomino(SHAPES.TROMINO, 400, 100, 'purple', this));
		this.polyominoes.push(new Polyomino(SHAPES.TETROMINO_L, 500, 100, 'orange', this));
		this.drawPolyominoes();
	};

	drawPolyominoes() {
		this.polyominoes.forEach(polyomino => polyomino.draw(this.gridBoard.ctx, this.gridSize, this.selectedPolyomino === polyomino));
	};

	addEventListeners() {
		this.canvas.addEventListener('mousedown', (e) => {
			const mousePos = this.gridBoard.getMousePos(e);
			this.handleMouseDown(mousePos);
		});

		this.canvas.addEventListener('mousemove', (e) => {
			const mousePos = this.gridBoard.getMousePos(e);
			this.handleMouseMove(mousePos);
		});

		this.canvas.addEventListener('mouseup', (e) => {
			this.handleMouseUp();
		});

		window.addEventListener('keydown', (e) => {
			if (e.key === 'r' && this.selectedPolyomino) {
				this.selectedPolyomino.rotate();
				this.redraw();
			}
		});

		this.canvas.addEventListener('touchstart', (e) => {
			e.preventDefault();
			const touchPos = this.gridBoard.getTouchPos(e);
			this.handleMouseDown(touchPos);
		});

		this.canvas.addEventListener('touchmove', (e) => {
			e.preventDefault();
			const touchPos = this.gridBoard.getTouchPos(e);
			this.handleMouseMove(touchPos);
		});

		this.canvas.addEventListener('touchend', (e) => {
			e.preventDefault();
			this.handleMouseUp();
		});
	};

	handleMouseDown(mousePos) {
		let clickedOnIcon = false;
		if (this.selectedPolyomino) {
			clickedOnIcon = this.selectedPolyomino.checkIconsClick(mousePos);
		}
		if (!clickedOnIcon) {
			let selected = false;
			this.polyominoes.forEach(polyomino => {
				polyomino.onMouseDown(mousePos);
				if (polyomino.isDragging) {
					this.selectedPolyomino = polyomino;
					selected = true;
				}
			});
			if (!selected) {
				this.selectedPolyomino = null;
			}
		}
		this.redraw();
	};

	handleMouseMove(mousePos) {
		this.polyominoes.forEach(polyomino => polyomino.onMouseMove(mousePos));
		this.redraw();
	};

	handleMouseUp() {
		this.polyominoes.forEach(polyomino => polyomino.onMouseUp());
		this.redraw();
	};

	redraw() {
		this.gridBoard.clear();
		this.gridBoard.drawGrid();
		this.drawPolyominoes();
		if (this.selectedPolyomino && !this.selectedPolyomino.isDragging) {
			this.selectedPolyomino.drawIcons(this.gridBoard.ctx, this.gridSize, this.icons);
		}
	};

	placePolyomino(polyomino) {
		this.gridBoard.placePolyomino(polyomino);
		const index = this.polyominoes.indexOf(polyomino);
		if (index > -1) {
			this.polyominoes.splice(index, 1);
		}
		this.selectedPolyomino = null;
		this.redraw();
	};
};

const main_app = new MainApp();
