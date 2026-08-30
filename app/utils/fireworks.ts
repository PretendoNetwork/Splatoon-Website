class Fireworks {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private paintingCanvas: HTMLCanvasElement;
	private paintingCtx: CanvasRenderingContext2D;

	private PAINTING_WIDTH = 420;
	private PAINTING_HEIGHT = 200;
	private PARTICLE_SCALE = 0.625;
	private MAX_PARTICLES = 10000;

	private MIN_PARTICLE_SIZE = 0.7;
	private PARTICLE_SIZE_SCALE = 0.8;

	private MIN_SETTLE_FRAMES = 6;
	private MIN_SPREAD_FRAMES = 95;
	private MIN_FADE_FRAMES = 130;

	private SETTLE_FRAMES_SCALE = 14;
	private SPREAD_FRAMES_SCALE = 30;
	private FADE_FRAMES_SCALE = 45;

	private MIN_STAR_SIZE = 0.4;
	private STAR_SIZE_SCALE = 0.68;
	private MIN_STAR_ALPHA = 0.35;
	private STAR_ALPHA_SCALE = 0.68;

	private ROCKET_LAUNCH_FREQUENCY = 0.5;

	private colors = [
		'#c83d79', '#409d3b', '#2bdced', '#c93457',
		'#048188', '#890b5d', '#da3781', '#ed9408',
		'#a577ff', '#ffff00', '#799516', '#ff5937',
		'#6e068a', '#118991', '#df641a', '#ad7710',
		'#228cff', '#e85407', '#eff66e', '#007edc',
		'#e1a307', '#d01d79', '#91b00b', '#b97e1a',
		'#ff7f19', '#dd9016', '#a1e896', '#b986ed',
		'#79b726', '#a52b85', '#ecc50a', '#85e378',
		'#3d59de', '#ffa427', '#91b00b', '#bf3e24',
		'#65b799', '#9736b2', '#8ed11e', '#319471'
	];

	private fireworkImages: FireworkImage[] = [];
	private fireworkQueue: FireworkImage[] = [];
	private rockets: Rocket[] = [];
	private sparks: Spark[] = [];
	private activeBursts: Burst[] = [];
	private stars: Star[] = [];
	private frameNumber = 0;

	private animationStarted = false;
	private lastColor: string | undefined;

	constructor(paintings: string[] | undefined = undefined, canvas = document.getElementById('fest')) {
		this.canvas = canvas as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

		this.paintingCanvas = document.createElement('canvas');
		this.paintingCanvas.width = this.PAINTING_WIDTH;
		this.paintingCanvas.height = this.PAINTING_HEIGHT;

		this.paintingCtx = this.paintingCanvas.getContext('2d') as CanvasRenderingContext2D;
		this.paintingCtx.imageSmoothingEnabled = false;

		if (paintings) {
			this.updateImages(paintings);
		}
		this.createStars();
		this.resizeCanvas();
		window.addEventListener('resize', () => this.resizeCanvas());
	}

	updateImages(paintings: string[]): void {
		console.log(`Loading ${paintings.length} fireworks`);
		this.fireworkImages = paintings.map(src => this.buildFireworkEntry(src));
		console.log(`Generated ${paintings.length} fireworks`);
	}

	buildFireworkEntry(src: string): FireworkImage {
		const img = new Image();
		img.crossOrigin = 'splatoon.pretendo.network';
		img.src = src;

		const entry: FireworkImage = {
			src,
			img,
			pixels: [],
			centerX: 0,
			centerY: 0
		};

		img.onload = (): void => {
			const shape = this.buildPixelMap(img);
			Object.assign(entry, shape);
			this.ensureAnimationStarts();
		};

		img.onerror = (): void => {
			console.warn('Failed to load:', src);
			this.ensureAnimationStarts();
		};

		return entry;
	}

	resizeCanvas(): void {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	buildPixelMap(img: HTMLImageElement): PixelMap | undefined {
		this.paintingCtx.drawImage(img, 0, 0, this.PAINTING_WIDTH, this.PAINTING_HEIGHT);

		const { data } = this.paintingCtx.getImageData(0, 0, this.PAINTING_WIDTH, this.PAINTING_HEIGHT);

		let blackCount = 0;
		let visibleCount = 0;

		for (let i = 0; i < data.length; i += 4) {
			visibleCount++;

			if ((data[i] ?? 255) < 128) {
				blackCount++;
			}
		}

		if (visibleCount === 0) {
			return;
		}

		// If the majority of the painting is black, invert it to make it more legible
		const invert = blackCount / visibleCount < 0.5;
		const pixels: Pixel[] = [];

		for (let y = 0; y < this.PAINTING_HEIGHT; y++) {
			for (let x = 0; x < this.PAINTING_WIDTH; x++) {
				const index = (y * this.PAINTING_WIDTH + x) * 4;
				const isBlack = (data[index] ?? 255) < 128;

				if (invert ? isBlack : !isBlack) {
					pixels.push({ x, y });
				}
			}
		}

		if (pixels.length === 0) {
			return;
		}

		const xPixels = pixels.map(pixel => pixel.x);
		const yPixels = pixels.map(pixel => pixel.y);

		const step = Math.max(1, Math.ceil(pixels.length / this.MAX_PARTICLES));
		const sampledPixels = pixels.filter((_, index) => index % step === 0);

		return {
			pixels: sampledPixels,
			centerX: (Math.min(...xPixels) + Math.max(...xPixels)) / 2,
			centerY: (Math.min(...yPixels) + Math.max(...yPixels)) / 2
		};
	}

	private hasReadyFirework(): boolean {
		return this.fireworkImages.some(entry => entry.pixels.length > 0);
	}

	randomFireworkEntry(): FireworkImage | undefined {
		if (this.fireworkQueue.length === 0) {
			this.fireworkQueue = this.fireworkImages.filter(entry => entry.pixels.length > 0);

			for (let i = this.fireworkQueue.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[this.fireworkQueue[i], this.fireworkQueue[j]] = [this.fireworkQueue[j] as FireworkImage, this.fireworkQueue[i] as FireworkImage];
			}
		}

		return this.fireworkQueue.pop();
	}

	ensureAnimationStarts(): void {
		if (this.animationStarted || !this.hasReadyFirework()) {
			return;
		}

		this.animationStarted = true;
		this.launchRocket();
		requestAnimationFrame(() => this.update());
	}

	launchRocket(): void {
		const firework = this.randomFireworkEntry();
		if (!firework) {
			return;
		}

		const occupied = [
			...this.activeBursts,
			...this.rockets.map(rocket => ({
				x: rocket.targetX,
				y: rocket.targetY
			}))
		];

		const minDistance = Math.min(460, Math.max(280, this.canvas.width * 0.34));

		for (let attempt = 0; attempt < 60; attempt++) {
			const targetX = this.canvas.width * (0.12 + Math.random() * 0.76);
			const targetY = this.canvas.height * (0.12 + Math.random() * 0.4);

			const isFarEnough = occupied.every((burst) => {
				return Math.hypot(targetX - burst.x, targetY - burst.y) >= minDistance;
			});

			if (!isFarEnough) {
				continue;
			}

			const availableColors = this.colors.filter(color => color !== this.lastColor);
			let color = availableColors[Math.floor(Math.random() * availableColors.length)];

			if (!color) {
				color = this.colors[0] as string;
			}

			this.lastColor = color;

			this.rockets.push({
				x: this.canvas.width / 2,
				y: this.canvas.height,
				targetX,
				targetY,
				color,
				firework
			});

			return;
		}
	}

	explodeAt(x: number, y: number, color: string, firework: FireworkImage): void {
		this.activeBursts.push({ x, y, expiresAt: this.frameNumber + 250 });

		const tilt = (Math.random() - 0.5) * (Math.PI / 3.2);

		for (const pixel of firework.pixels) {
			const localX = (pixel.x - firework.centerX) * this.PARTICLE_SCALE;
			const localY = (pixel.y - firework.centerY) * this.PARTICLE_SCALE;

			const cos = Math.cos(tilt);
			const sin = Math.sin(tilt);

			this.sparks.push({
				startX: x,
				startY: y,
				targetX: x + localX * cos - localY * sin,
				targetY: y + localX * sin + localY * cos,
				x,
				y,
				alpha: 1,
				size: this.MIN_PARTICLE_SIZE + Math.random() * this.PARTICLE_SIZE_SCALE,
				color,
				life: 0,
				settleFrames: this.MIN_SETTLE_FRAMES + Math.random() * this.SETTLE_FRAMES_SCALE,
				holdFrames: 0,
				spreadFrames: this.MIN_SPREAD_FRAMES + Math.random() * this.SPREAD_FRAMES_SCALE,
				fadeFrames: this.MIN_FADE_FRAMES + Math.random() * this.FADE_FRAMES_SCALE
			});
		}
	}

	smoothStep(value: number): number {
		return value * value * (3 - 2 * value);
	}

	private createStars(): void {
		this.stars = Array.from({ length: 140 }, () => ({
			x: Math.random(),
			y: Math.random() * 0.68,
			radius: this.MIN_STAR_SIZE + Math.random() * this.STAR_SIZE_SCALE,
			alpha: this.MIN_STAR_ALPHA + Math.random() * this.STAR_ALPHA_SCALE,
			twinkleSpeed: 0.01 + Math.random() * 0.025
		}));
	}

	private drawStars(): void {
		for (const star of this.stars) {
			const twinkle = 0.8 + Math.sin(this.frameNumber * star.twinkleSpeed) * 0.2;

			this.ctx.globalAlpha = star.alpha * twinkle;
			this.ctx.fillStyle = '#ffffff';
			this.ctx.beginPath();
			this.ctx.arc(
				star.x * this.canvas.width,
				star.y * this.canvas.height,
				star.radius,
				0,
				Math.PI * 2
			);
			this.ctx.fill();
		}

		this.ctx.globalAlpha = 1;
	}

	update(): void {
		this.frameNumber++;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawStars();

		this.activeBursts = this.activeBursts.filter(burst => burst.expiresAt > this.frameNumber);

		for (let i = this.rockets.length - 1; i >= 0; i--) {
			const rocket = this.rockets[i];
			if (!rocket) {
				continue;
			}

			rocket.x += (rocket.targetX - rocket.x) * 0.07;
			rocket.y += (rocket.targetY - rocket.y) * 0.07;

			this.ctx.strokeStyle = rocket.color;
			this.ctx.lineWidth = 1.5;
			this.ctx.beginPath();
			this.ctx.moveTo(rocket.x, rocket.y);
			this.ctx.lineTo(rocket.x, rocket.y + 4);
			this.ctx.stroke();

			if (Math.hypot(rocket.x - rocket.targetX, rocket.y - rocket.targetY) < 5) {
				this.explodeAt(rocket.targetX, rocket.targetY, rocket.color, rocket.firework);

				this.rockets.splice(i, 1);
			}
		}

		for (let i = this.sparks.length - 1; i >= 0; i--) {
			const spark = this.sparks[i];
			if (!spark) {
				continue;
			}
			spark.life++;

			if (spark.life <= spark.settleFrames) {
				const t = this.smoothStep(spark.life / spark.settleFrames);

				spark.x = spark.startX + (spark.targetX - spark.startX) * t;
				spark.y = spark.startY + (spark.targetY - spark.startY) * t;
			} else {
				const elapsed = spark.life - spark.settleFrames - spark.holdFrames;

				const spreadTime = Math.max(0, Math.min(1, elapsed / spark.spreadFrames));

				const easedSpread = this.smoothStep(spreadTime);
				const spreadScale = 1 + easedSpread * 0.3;

				spark.x = spark.startX + (spark.targetX - spark.startX) * spreadScale;
				spark.y = spark.startY + (spark.targetY - spark.startY) * spreadScale;

				const fadeStart = 0.7;
				const fadeTime = Math.max(0, (spreadTime - fadeStart) / (1 - fadeStart));

				spark.alpha = 1 - this.smoothStep(fadeTime);

				if (spark.alpha <= 0.01) {
					this.sparks.splice(i, 1);
					continue;
				}
			}

			this.ctx.globalAlpha = spark.alpha;
			this.ctx.fillStyle = spark.color;
			this.ctx.fillRect(spark.x, spark.y, spark.size, spark.size);
		}

		this.ctx.globalAlpha = 1;

		if (Math.random() < this.ROCKET_LAUNCH_FREQUENCY) {
			this.launchRocket();
		}

		requestAnimationFrame(() => this.update());
	}

	start(): void {
		this.ensureAnimationStarts();
	}
}

export {
	Fireworks
};
