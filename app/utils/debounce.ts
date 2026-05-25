const debounce = (callback: any, wait: number) => {
	let timeoutId: any = null;
	return (...args: any[]): void => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback(...args);
		}, wait);
	};
};

export {
	debounce
};
