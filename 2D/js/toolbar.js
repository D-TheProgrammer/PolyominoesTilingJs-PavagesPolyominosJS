import { Polyomino, SHAPES, getRandomColor } from './polyomino.js';

export class Toolbar {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = window.innerWidth;
		this.canvas.height = 50;
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = '0';
		this.canvas.style.left = '0';
		document.body.appendChild(this.canvas);

		this.buttons = [
			{ name: 'Create Polyomino', action: () => this.showPolyominoPopup() }
		];

		this.drawToolbar();
		this.addEventListeners();
	};

	drawToolbar() {
		this.ctx.fillStyle = '#333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.font = '20px Arial';
		this.ctx.fillStyle = '#fff';

		this.buttons.forEach((button, index) => {
			const x = 10 + index * 150;
			const y = 30;
			this.ctx.fillText(button.name, x, y);
			button.x = x;
			button.y = y - 20;
			button.width = this.ctx.measureText(button.name).width;
			button.height = 30;
		});
	};

	addEventListeners() {
		this.canvas.addEventListener('click', (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			this.buttons.forEach(button => {
				if (mouseX >= button.x && mouseX <= button.x + button.width &&
					mouseY >= button.y && mouseY <= button.y + button.height) {
					button.action();
				}
			});
		});
	};

	showPolyominoPopup() {
		const popup = document.createElement('canvas');
		const ctx = popup.getContext('2d');
		const width = 400;
		const height = 600;
		popup.width = width;
		popup.height = height;
		popup.style.position = 'absolute';
		popup.style.top = '50px';
		popup.style.left = '50%';
		popup.style.transform = 'translateX(-50%)';
		popup.style.border = '1px solid #000';
		document.body.appendChild(popup);

		const shapes = Object.keys(SHAPES);
		const shapeSize = 30;
		const padding = 10;

		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, width, height);

		shapes.forEach((shape, index) => {
			const y = 30 + index * (shapeSize + padding);

			ctx.font = '20px Arial';
			ctx.fillStyle = '#000';
			ctx.fillText(shape, 10, y + shapeSize / 2);
			const polyomino = new Polyomino(SHAPES[shape], 200, y, getRandomColor(), this.mainApp);
			polyomino.draw(ctx, shapeSize, false);

			polyomino.x = 200;
			polyomino.y = y;
			polyomino.width = shapeSize * polyomino.shape[0].length;
			polyomino.height = shapeSize * polyomino.shape.length;

			polyomino.onMouseDown = (mousePos) => {
				const newPolyomino = new Polyomino(SHAPES[shape], mousePos.x, mousePos.y, getRandomColor(), this.mainApp);
				this.mainApp.polyominoes.push(newPolyomino);
				this.mainApp.redraw();
				document.body.removeChild(popup);
			};

			popup.addEventListener('click', (e) => {
				const rect = popup.getBoundingClientRect();
				const mouseX = e.clientX - rect.left;
				const mouseY = e.clientY - rect.top;

				if (mouseX >= polyomino.x && mouseX <= polyomino.x + polyomino.width &&
					mouseY >= polyomino.y && mouseY <= polyomino.y + polyomino.height) {
					polyomino.onMouseDown({ x: mouseX, y: mouseY });
				}
			});
		});
	};
};
