// Global desktop state management using Svelte 5 runes
export class DesktopState {
	windows = $state([]);
	activeWindowId = $state(null);
	nextWindowId = $state(1);
	currentWallpaper = $state('arch-nz');

	constructor() {
		// Initialize with current time
		this.currentTime = $state(new Date());

		// Update time every second using regular JavaScript
		// (Can't use $effect in constructor of singleton)
		this._timeInterval = setInterval(() => {
			this.currentTime = new Date();
		}, 1000);
	}

	// Method to clean up the interval if needed
	destroy() {
		if (this._timeInterval) {
			clearInterval(this._timeInterval);
		}
	}

	openWindow(type, title, component) {
		const windowId = this.nextWindowId++;
		const newWindow = {
			id: windowId,
			type,
			title,
			component,
			isOpen: true,
			position: { x: 100 + windowId * 30, y: 100 + windowId * 30 },
			size: { width: 600, height: 400 },
			isMinimized: false
		};

		this.windows.push(newWindow);
		this.activeWindowId = windowId;
		return windowId;
	}

	closeWindow(windowId) {
		const index = this.windows.findIndex((w) => w.id === windowId);
		if (index !== -1) {
			this.windows.splice(index, 1);
			if (this.activeWindowId === windowId) {
				this.activeWindowId =
					this.windows.length > 0 ? this.windows[this.windows.length - 1].id : null;
			}
		}
	}

	setActiveWindow(windowId) {
		if (this.windows.find((w) => w.id === windowId)) {
			this.activeWindowId = windowId;
		}
	}

	updateWindowPosition(windowId, position) {
		const window = this.windows.find((w) => w.id === windowId);
		if (window) {
			window.position = position;
		}
	}

	minimizeWindow(windowId) {
		const window = this.windows.find((w) => w.id === windowId);
		if (window) {
			window.isMinimized = !window.isMinimized;
		}
	}

	setWallpaper(wallpaperId) {
		this.currentWallpaper = wallpaperId;
	}

	formattedTime = $derived(
		this.currentTime.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		})
	);

	formattedDate = $derived(
		this.currentTime.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		})
	);

	wallpaperStyle = $derived(() => {
		const wallpapers = {
			'arch-nz': "background-image: url('https://roboticoverlords.org/wallpapers/arch_nz.png')",
			'arch-blue': 'background: #1e3a8a',
			'arch-purple': 'background: #7c3aed', 
			'minimal-dark': 'background: #111827',
			'gradient': 'background: linear-gradient(45deg, #1e3a8a, #7c3aed)'
		};
		return wallpapers[this.currentWallpaper] || wallpapers['arch-nz'];
	});
}

// Create a singleton instance
export const desktopState = new DesktopState();
