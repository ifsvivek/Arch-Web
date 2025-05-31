// Global desktop state management using Svelte 5 runes
export class DesktopState {
	windows = $state([]);
	activeWindowId = $state(null);
	nextWindowId = $state(1);
	currentWallpaper = $state('arch-nz');
	currentTheme = $state('dark');
	settings = $state({
		appearance: {
			theme: 'dark',
			wallpaper: 'arch-nz',
			iconTheme: 'papirus',
			fontSize: 14
		},
		system: {
			autologin: false,
			showNotifications: true,
			soundEnabled: true,
			animationsEnabled: true
		},
		network: {
			wifi: true,
			ethernet: false,
			proxy: false
		}
	});

	constructor() {
		// Initialize with current time
		this.currentTime = $state(new Date());

		// Load settings from localStorage
		this.loadSettings();

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
		
		// Set different sizes for different app types
		let size = { width: 600, height: 400 }; // default
		if (type === 'system-monitor') {
			size = { width: 800, height: 650 };
		} else if (type === 'file-explorer') {
			size = { width: 800, height: 600 };
		} else if (type === 'text-editor') {
			size = { width: 800, height: 500 };
		} else if (type === 'settings') {
			size = { width: 650, height: 550 };
		} else if (type === 'calculator') {
			size = { width: 350, height: 600 };
		} else if (type === 'web-browser') {
			size = { width: 1000, height: 700 };
		}

		const newWindow = {
			id: windowId,
			type,
			title,
			component,
			isOpen: true,
			position: { x: 100 + windowId * 30, y: 100 + windowId * 30 },
			size,
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
		console.log('setWallpaper called with:', wallpaperId);
		this.currentWallpaper = wallpaperId;
		this.settings.appearance.wallpaper = wallpaperId;
		console.log('Updated currentWallpaper to:', this.currentWallpaper);
		this.saveSettings();
	}

	setTheme(theme) {
		this.currentTheme = theme;
		this.settings.appearance.theme = theme;
		this.saveSettings();
		this.updateDocumentTheme(theme);
	}

	updateSetting(category, key, value) {
		this.settings[category][key] = value;

		// Update specific properties that affect the desktop
		if (category === 'appearance') {
			if (key === 'wallpaper') {
				this.currentWallpaper = value;
			} else if (key === 'theme') {
				this.currentTheme = value;
				this.updateDocumentTheme(value);
			}
		}

		this.saveSettings();
	}

	loadSettings() {
		// Check if we're in the browser before using localStorage
		if (typeof window === 'undefined') return;
		
		try {
			const saved = localStorage.getItem('desktop-settings');
			if (saved) {
				const parsedSettings = JSON.parse(saved);
				this.settings = { ...this.settings, ...parsedSettings };
				this.currentWallpaper = this.settings.appearance.wallpaper;
				this.currentTheme = this.settings.appearance.theme;
				this.updateDocumentTheme(this.currentTheme);
			}
		} catch (error) {
			console.warn('Failed to load settings from localStorage:', error);
		}
	}

	saveSettings() {
		// Check if we're in the browser before using localStorage
		if (typeof window === 'undefined') return;
		
		try {
			localStorage.setItem('desktop-settings', JSON.stringify(this.settings));
		} catch (error) {
			console.warn('Failed to save settings to localStorage:', error);
		}
	}

	updateDocumentTheme(theme) {
		// Check if we're in the browser before accessing document
		if (typeof window === 'undefined') return;
		
		const root = document.documentElement;
		root.classList.remove('light', 'dark');

		if (theme === 'auto') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			root.classList.add(prefersDark ? 'dark' : 'light');
		} else {
			root.classList.add(theme);
		}
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
			'arch-nz': "background-image: url('/arch_wallpaper.png'); background-size: cover; background-position: center; background-repeat: no-repeat;",
			'arch-blue': 'background-color: #1e3a8a;',
			'arch-purple': 'background-color: #7c3aed;',
			'minimal-dark': 'background-color: #111827;',
			'gradient': 'background: linear-gradient(45deg, #1e3a8a, #7c3aed);'
		};
		const style = wallpapers[this.currentWallpaper] || wallpapers['arch-nz'];
		console.log('wallpaperStyle computed for', this.currentWallpaper, ':', style);
		return style;
	});
}	

// Create a singleton instance
export const desktopState = new DesktopState();
