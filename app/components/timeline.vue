<script setup lang="ts">
const { pages } = defineProps<{
	pages: string[];
}>();

const debounce = (callback: any, wait: number) => {
	let timeoutId: any = null;
	return (...args: any[]): void => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback(...args);
		}, wait);
	};
};

class Matrix {
	timelineCanvas = document.getElementById('ledSign') as HTMLCanvasElement;
	drawCanvas = document.createElement('canvas');
	textList: string[] = [];
	SIGN_ROWS = 15;
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
		if (this.textList.length < 1) {
			return [];
		}
		const fontSize = 12;
		const ctx = this.drawCanvas.getContext('2d');
		const pageWidth = document.getElementById('content')?.offsetWidth;
		const font = `${fontSize}px "PixelMplus12-Regular"`;

		if (!ctx || !pageWidth) {
			return [];
		}

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
				const pixel = pixels[index + 3] ?? 0;
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
if (import.meta.client) {
	const matrix = new Matrix();
	const frame = document.getElementById('content');

	if (frame) {
		frame.addEventListener('scroll', (event) => {
			const target = event.target as HTMLElement;
			if (!target) {
				return;
			}
			matrix.setOffset(Math.ceil((target.scrollLeft * -1)));
		});
	}

	function loadText() {
		if (!document.fonts.check('10px "PixelMplus12-Regular"')) {
			window.setTimeout(loadText, 100);
		} else {
			matrix.setText(pages);
		}
	}

	loadText();
}
</script>

<template>
  <div class="wrapper">
    <canvas id="ledSign" />
  </div>
</template>
<style scoped>
.wrapper {
	background-color: black;
	position: sticky;
	top: 0;
	--c1: #000000;
	border: 4px solid #323131;
	box-shadow: -5px 7px var(--c1), -2px 2px var(--c1), -3px 3px var(--c1), -4px 4px var(--c1), -5px 5px var(--c1);
	margin: 1em;
	width: calc(100% - 2em);
	height: 60px;
	box-sizing: border-box;
	user-select: none;
}
</style>
