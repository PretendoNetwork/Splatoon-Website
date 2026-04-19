const frame = document.getElementById('content');
const timeline = document.querySelector('.TimelineWrapper');

if (!!frame && !!timeline) {
	frame.addEventListener("scroll", (event) => {
		if (!event.target) return;
		timeline.scrollLeft = event.target.scrollLeft;
	});
}

function storageAvailable(type) {
	let storage;
	try {
		storage = window[type];
		if (!storage) return false;

		const x = "__storage_test__";
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (e) {
		return (
			e instanceof DOMException &&
			e.name === "QuotaExceededError" &&
			storage &&
			storage.length !== 0
		);
	}
}

// If we can use session storage
if (storageAvailable('localStorage')) {
	let storedTheme = localStorage.getItem("theme");
	if (!storedTheme) {
		storedTheme = 'OrangeBlue';
		localStorage.setItem("theme", storedTheme)
	}

	frame.className = storedTheme;
}
