class Matrix {
	timelineCanvas = document.getElementById('ledSign') as HTMLCanvasElement;
	drawCanvas = document.createElement('canvas');
	textList: string[] = [];
	SIGN_ROWS = 13;
	GLYPH_ROWS = 10;
	FLICKER_COUNT = 3;
	offset_x = 0;
	flickering: Set<string> = new Set();
	bitmap: number[][] = [];
	litDots: string[] = [];
	flicker = true;

	constructor() {
		this.drawCanvas.style.display = 'none';
		document.body.appendChild(this.drawCanvas);
		setInterval(this.triggerFlickers.bind(this), 3000);
		window.addEventListener('resize', debounce(this.render.bind(this), 250));
		this.setText([' ']); // Force the browser to actual load the font
	}

	getTopOffset(): number {
		if (navigator.userAgent.indexOf('Chrome') != -1) {
			return 0;
		} else if (navigator.userAgent.indexOf('Safari') != -1) {
			return -2;
		} else if (navigator.userAgent.indexOf('Firefox') != -1) {
			return -1;
		} else {
			return 0;
		}
	}

	setText(newTextList: string[]): void {
		this.textList = newTextList;
		this.bitmap = this.generateBitMap();
		this.litDots = [];

		if (this.bitmap.length < this.GLYPH_ROWS) {
			return;
		}

		for (let row = 0; row < this.GLYPH_ROWS; row++) {
			const rowArray = this.bitmap[row];
			if (rowArray == undefined) {
				continue;
			}
			for (let col = 0; col < rowArray.length; col++) {
				if (rowArray[col] === 1) {
					this.litDots.push(`${row},${col}`);
				}
			}
		}
		this.render();
	}

	setFlicker(flicker: boolean): void {
		this.flicker = flicker;
	}

	setOffset(x: number): void {
		this.offset_x = x;
		this.setText(this.textList);
	}

	startFlicker(dot: string): void {
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

	triggerFlickers(): void {
		if (!this.flicker) {
			return;
		}
		for (let i = 0; i < this.FLICKER_COUNT; i++) {
			const dot = this.litDots[Math.floor(Math.random() * this.litDots.length)];
			if (!dot) {
				return;
			}
			setTimeout(() => this.startFlicker(dot), Math.random() * 1000); // * Stagger the starts
		}
	}

	generateBitMap(): number[][] {
		const multiplier = 2;
		if (this.textList.length < 1) {
			return [];
		}
		const fontSize = 12 * multiplier;
		const ctx = this.drawCanvas.getContext('2d');
		const pageWidth = document.getElementById('content')?.offsetWidth;
		const font = `${fontSize}px "PixelMplus12-Regular"`;

		if (!ctx || !pageWidth) {
			return [];
		}

		ctx.font = font;
		ctx.textBaseline = 'top';

		this.drawCanvas.width = (pageWidth * this.textList.length) * multiplier;
		this.drawCanvas.height = fontSize;

		// Re-set after resize
		ctx.font = font;
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#000000';

		let currentOffset = this.offset_x;
		currentOffset += (currentOffset & 1) ^ 1; // get the next odd number cause firefox hates me
		for (const text of this.textList) {
			ctx.fillText(text, currentOffset, this.getTopOffset());
			currentOffset += pageWidth;
		}

		const imageData = ctx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
		const pixels = imageData.data;
		const bitmap = [];

		// We're looping over the pixels in the canvas, in groups of {multiplier} to determine if a pixel needs to be lit
		// Yes it's overkill, blame firefox for breaking their canvas support on android
		for (let y = 0; y < this.drawCanvas.height; y += multiplier) {
			const row = [];
			for (let x = 0; x < this.drawCanvas.width; x += multiplier) {
				const startIndex = ((y * this.drawCanvas.width + x) * 4) + 3;
				const endIndex = startIndex + multiplier;
				let pixel = 0;
				for (let j = startIndex; j <= endIndex; j++) {
					pixel += pixels[j] ?? 0;
				}
				row.push(pixel > 128 ? 1 : 0);
			}
			bitmap.push(row);
		}

		return bitmap;
	}

	render(): void {
		const ctx = this.timelineCanvas?.getContext('2d');
		if (!ctx) {
			return;
		}
		const width = this.timelineCanvas?.parentElement?.clientWidth ?? 0;
		const height = this.timelineCanvas?.parentElement?.clientHeight ?? 0;
		const cellSize = height / this.SIGN_ROWS;
		const dotRadius = cellSize * 0.4;

		this.timelineCanvas.width = width;
		this.timelineCanvas.height = height;

		this.timelineCanvas.setAttribute('aria-label', this.textList.join(', '));
		this.timelineCanvas.setAttribute('role', 'img');

		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, this.timelineCanvas.width, this.timelineCanvas.height);

		const startRow = Math.floor((this.SIGN_ROWS - this.GLYPH_ROWS) / 2);
		const columnCount = Math.ceil(width / cellSize);

		for (let row = 0; row < this.SIGN_ROWS; row++) {
			for (let column = 0; column < columnCount; column++) {
				const gridRow = row - startRow;
				const gridColumn = column;
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

export {
	Matrix
};
