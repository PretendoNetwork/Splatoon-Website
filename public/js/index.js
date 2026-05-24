const frame = document.getElementById('content');

const debounce = (callback, wait) => {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback(...args);
		}, wait);
	};
};

class Matrix {
	timelineCanvas = document.getElementById('ledSign');
	drawCanvas = document.createElement('canvas');
	textList = [];
	SIGN_ROWS = 15;
	GLYPH_ROWS = 10;
	FLICKER_COUNT = 3;
	offset_x = 0;
	flickering = new Set();
	bitmap = [];
	litDots = [];
	flicker = true;

	constructor() {
		this.drawCanvas.style.display = 'none';
		document.body.appendChild(this.drawCanvas);
		setInterval(this.triggerFlickers.bind(this), 3000);
		window.addEventListener('resize', debounce(this.render.bind(this), 250));
		this.setText([' ']); // Force the browser to actual load the font
	}

	setText(newTextList) {
		this.textList = newTextList;
		this.bitmap = this.generateBitMap();
		this.litDots = [];

		if (this.bitmap.length < this.GLYPH_ROWS) {
			return;
		}

		for (let row = 0; row < this.GLYPH_ROWS; row++) {
			for (let col = 0; col < this.bitmap[row].length; col++) {
				if (this.bitmap[row][col] === 1) {
					this.litDots.push(`${row},${col}`);
				}
			}
		}
		this.render();
	}

	setFlicker(flicker) {
		this.flicker = flicker;
	}

	setOffset(x) {
		this.offset_x = x;
		this.setText(this.textList);
	}

	startFlicker(dot) {
		let flickers = 0;
		const maxFlickers = 2 + Math.floor(Math.random() * 3); // * 2-4 flickers
		const interval = setInterval(() => {
			if (this.flickering.has(dot)) {
				this.flickering.delete(dot);
			} else {
				this.flickering.add(dot);
			}

			this.render();
			flickers++;

			if (flickers >= maxFlickers * 2) {
				clearInterval(interval);
				this.flickering.delete(dot);
				this.render();
			}
		}, 50 + Math.random() * 50); // * Quick blinks
	}

	triggerFlickers() {
		if (!this.flicker) {
			return;
		}
		for (let i = 0; i < this.FLICKER_COUNT; i++) {
			const dot = this.litDots[Math.floor(Math.random() * this.litDots.length)];
			setTimeout(() => this.startFlicker(dot), Math.random() * 1000); // * Stagger the starts
		}
	}

	generateBitMap() {
		if (this.textList.length < 1) {
			return [];
		}
		const fontSize = 12;
		const ctx = this.drawCanvas.getContext('2d');
		const pageWidth = document.getElementById('content').offsetWidth;
		const font = `${fontSize}px "PixelMplus12-Regular"`;

		ctx.font = font;
		ctx.textBaseline = 'top';

		this.drawCanvas.width = pageWidth * this.textList.length;
		this.drawCanvas.height = fontSize;

		// Re-set after resize
		ctx.font = font;
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#000000';

		let currentOffset = this.offset_x + 1;
		for (const text of this.textList) {
			ctx.fillText(text, currentOffset, -1);
			currentOffset += pageWidth;
		}

		const imageData = ctx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
		const pixels = imageData.data;
		const bitmap = [];

		for (let y = 0; y < this.drawCanvas.height; y++) {
			const row = [];
			for (let x = 0; x < this.drawCanvas.width; x++) {
				const index = (y * this.drawCanvas.width + x) * 4;
				row.push(pixels[index + 3] > 128 ? 1 : 0);
			}
			bitmap.push(row);
		}

		return bitmap;
	}

	render() {
		const ctx = this.timelineCanvas.getContext('2d');

		const width = this.timelineCanvas.parentElement.clientWidth;
		const height = this.timelineCanvas.parentElement.clientHeight;
		const cellSize = height / this.SIGN_ROWS;
		const dotRadius = cellSize * 0.4;

		this.timelineCanvas.width = width;
		this.timelineCanvas.height = height;

		this.timelineCanvas.setAttribute('aria-label', this.textList.join(', '));
		this.timelineCanvas.setAttribute('role', 'img');

		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, this.timelineCanvas.width, this.timelineCanvas.height);

		const startColumn = 1;
		const startRow = Math.floor((this.SIGN_ROWS - this.GLYPH_ROWS) / 2);
		const columnCount = Math.ceil(width / cellSize);

		for (let row = 0; row < this.SIGN_ROWS; row++) {
			for (let column = 0; column < columnCount; column++) {
				const gridRow = row - startRow;
				const gridColumn = column - startColumn;
				const lit = this.bitmap[gridRow]?.[gridColumn] === 1;
				const isFlickering = lit && this.flickering.has(`${gridRow},${gridColumn}`);

				ctx.beginPath();
				ctx.arc(
					column * cellSize + cellSize / 2,
					row * cellSize + cellSize / 2,
					dotRadius,
					0, Math.PI * 2
				);

				if (lit && !isFlickering) {
					ctx.shadowBlur = cellSize * 1.5;
					ctx.shadowColor = '#ffa036';
				} else {
					ctx.shadowBlur = 0;
				}

				ctx.fillStyle = lit && !isFlickering ? '#ffa036' : '#ffa03635';
				ctx.fill();
			}
		}
	}
}

if (frame) {
	frame.addEventListener('scroll', (event) => {
		if (!event.target || !window.matrix) {
			return;
		}
		window.matrix.setOffset(Math.ceil((event.target.scrollLeft * -1)));
	});
}

function storageAvailable(type) {
	let storage;
	try {
		storage = window[type];
		if (!storage) {
			return false;
		}

		const x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (e) {
		return (
			e instanceof DOMException &&
			e.name === 'QuotaExceededError' &&
			storage &&
			storage.length !== 0
		);
	}
}

// If we can use session storage
if (storageAvailable('localStorage')) {
	let storedTheme = localStorage.getItem('theme');
	if (!storedTheme) {
		storedTheme = 'OrangeBlue';
		localStorage.setItem('theme', storedTheme);
	}

	frame.className = storedTheme;
}
