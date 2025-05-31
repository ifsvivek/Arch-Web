<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';
	import {
		FileExplorer,
		TextEditor,
		Terminal,
		Calculator,
		ImageViewer,
		SystemMonitor,
		Settings,
		WebBrowser,
		MusicPlayer
	} from '$apps';

	// Props
	let { onShowAllApps = () => {}, showAppMenu = false } = $props();

	// Search state with debouncing
	let searchTerm = $state('');
	let searchInput = $state(null);
	let searchDebounceTimer = $state(null);
	let debouncedSearchTerm = $state('');

	// Search performance tracking
	let searchStartTime = $state(0);
	let lastSearchDuration = $state(0);

	const apps = [
		{
			id: 'file-explorer',
			name: 'Files',
			icon: 'folder',
			component: FileExplorer,
			category: 'System',
			description: 'Browse and manage your files and folders'
		},
		{
			id: 'text-editor',
			name: 'Text Editor',
			icon: 'document',
			component: TextEditor,
			category: 'Productivity',
			description: 'Create and edit text documents and code'
		},
		{
			id: 'terminal',
			name: 'Terminal',
			icon: 'terminal',
			component: Terminal,
			category: 'Development',
			description: 'Command line interface for system operations'
		},
		{
			id: 'calculator',
			name: 'Calculator',
			icon: 'calculator',
			component: Calculator,
			category: 'Utilities',
			description: 'Perform mathematical calculations'
		},
		{
			id: 'image-viewer',
			name: 'Image Viewer',
			icon: 'image',
			component: ImageViewer,
			category: 'Media',
			description: 'View and manage your images and photos'
		},
		{
			id: 'system-monitor',
			name: 'System Monitor',
			icon: 'monitor',
			component: SystemMonitor,
			category: 'System',
			description: 'Monitor system performance and resources'
		},
		{
			id: 'settings',
			name: 'Settings',
			icon: 'settings',
			component: Settings,
			category: 'System',
			description: 'Configure system preferences and options'
		},
		{
			id: 'web-browser',
			name: 'Web Browser',
			icon: 'browser',
			component: WebBrowser,
			category: 'Internet',
			description: 'Browse the web and access online content'
		},
		{
			id: 'music-player',
			name: 'Music Player',
			icon: 'music',
			component: MusicPlayer,
			category: 'Media',
			description: 'Play and manage your music collection'
		}
	];

	// Enhanced search with debouncing
	function updateSearchTerm(event) {
		searchTerm = event.target.value;

		// Clear existing timer
		if (searchDebounceTimer) {
			clearTimeout(searchDebounceTimer);
		}

		// Set new timer for debounced search
		searchDebounceTimer = setTimeout(() => {
			searchStartTime = performance.now();
			debouncedSearchTerm = searchTerm;
			updateSearchDuration();
		}, 150); // 150ms debounce delay
	}

	// Function to toggle app menu with search
	function toggleAppMenu() {
		onShowAllApps();
		if (!showAppMenu) {
			searchTerm = '';
			debouncedSearchTerm = '';
			if (searchInput) {
				setTimeout(() => searchInput?.focus(), 100);
			}
		}
	}

	function launchApp(app) {
		if (app.component) {
			desktopState.openWindow(app.id, app.name, app.component);
		} else {
			console.warn(`No component available for ${app.name}`);
			return;
		}

		// Close app menu if open
		if (showAppMenu) {
			showAppMenu = false;
			searchTerm = '';
			debouncedSearchTerm = '';
		}
	}

	// Enhanced search algorithm with scoring
	function calculateSearchScore(app, searchTerms) {
		let score = 0;
		const name = app.name.toLowerCase();
		const id = app.id.toLowerCase();
		const description = app.description.toLowerCase();
		const category = app.category.toLowerCase();
		const keywords = getAppKeywords(app.id);

		for (const term of searchTerms) {
			const termLower = term.toLowerCase();

			// Exact name match (highest priority)
			if (name === termLower) score += 100;
			// Name starts with term (high priority)
			else if (name.startsWith(termLower)) score += 80;
			// Name contains term (medium-high priority)
			else if (name.includes(termLower)) score += 60;

			// Word boundary matches in name
			const nameWords = name.split(/[\s-_]/);
			for (const word of nameWords) {
				if (word.startsWith(termLower)) score += 50;
				else if (word.includes(termLower)) score += 30;
			}

			// ID matches
			if (id.includes(termLower)) score += 40;

			// Category matches
			if (category.includes(termLower)) score += 35;

			// Description matches
			if (description.includes(termLower)) score += 25;

			// Keyword matches
			for (const keyword of keywords) {
				if (keyword.toLowerCase().includes(termLower)) {
					score += keyword.toLowerCase().startsWith(termLower) ? 45 : 20;
				}
			}

			// Fuzzy matching for typos (basic implementation)
			if (termLower.length > 2) {
				for (const word of [...nameWords, ...keywords]) {
					if (calculateLevenshteinDistance(termLower, word.toLowerCase()) <= 1) {
						score += 15;
					}
				}
			}
		}

		return score;
	}

	// Simple Levenshtein distance for fuzzy matching
	function calculateLevenshteinDistance(a, b) {
		if (a.length === 0) return b.length;
		if (b.length === 0) return a.length;

		const matrix = Array(b.length + 1)
			.fill(null)
			.map(() => Array(a.length + 1).fill(null));

		for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
		for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

		for (let j = 1; j <= b.length; j++) {
			for (let i = 1; i <= a.length; i++) {
				const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
				matrix[j][i] = Math.min(
					matrix[j][i - 1] + 1,
					matrix[j - 1][i] + 1,
					matrix[j - 1][i - 1] + indicator
				);
			}
		}

		return matrix[b.length][a.length];
	}

	// Function to update search duration
	function updateSearchDuration() {
		if (searchStartTime > 0) {
			lastSearchDuration = performance.now() - searchStartTime;
			searchStartTime = 0;
		}
	}

	// Enhanced filtered apps with scoring
	const filteredApps = $derived.by(() => {
		if (!debouncedSearchTerm.trim()) {
			return apps;
		}

		const searchTerms = debouncedSearchTerm
			.trim()
			.split(/\s+/)
			.filter((term) => term.length > 0);

		return apps
			.map((app) => ({
				...app,
				searchScore: calculateSearchScore(app, searchTerms)
			}))
			.filter((app) => app.searchScore > 0)
			.sort((a, b) => b.searchScore - a.searchScore);
	});

	// Enhanced keywords with more comprehensive coverage
	function getAppKeywords(appId) {
		const keywords = {
			'file-explorer': [
				'files',
				'folder',
				'browse',
				'directory',
				'explorer',
				'file manager',
				'finder',
				'nautilus',
				'documents'
			],
			'text-editor': [
				'text',
				'edit',
				'write',
				'document',
				'note',
				'code',
				'editor',
				'notepad',
				'vim',
				'nano'
			],
			terminal: [
				'console',
				'command',
				'shell',
				'bash',
				'cli',
				'cmd',
				'powershell',
				'zsh',
				'terminal'
			],
			calculator: ['calc', 'math', 'numbers', 'arithmetic', 'compute', 'calculate', 'mathematics'],
			'image-viewer': [
				'image',
				'picture',
				'photo',
				'view',
				'gallery',
				'jpeg',
				'png',
				'gif',
				'viewer'
			],
			'system-monitor': [
				'system',
				'monitor',
				'performance',
				'task',
				'process',
				'resource',
				'cpu',
				'memory',
				'ram'
			],
			settings: [
				'config',
				'preferences',
				'options',
				'setup',
				'configuration',
				'control panel',
				'system'
			],
			'web-browser': [
				'browser',
				'web',
				'internet',
				'surf',
				'firefox',
				'chrome',
				'safari',
				'edge',
				'www'
			],
			'music-player': [
				'music',
				'audio',
				'sound',
				'player',
				'mp3',
				'media',
				'spotify',
				'itunes',
				'song'
			]
		};
		return keywords[appId] || [];
	}

	// Enhanced highlighting with better regex handling
	function highlightMatch(text, searchTerm) {
		if (!searchTerm.trim()) return text;

		const terms = searchTerm.trim().split(/\s+/);
		let highlightedText = text;

		for (const term of terms) {
			if (term.length > 0) {
				const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const regex = new RegExp(`(${escapedTerm})`, 'gi');
				highlightedText = highlightedText.replace(
					regex,
					'<mark class="bg-yellow-300/40 text-yellow-100 rounded px-1 font-semibold">$1</mark>'
				);
			}
		}

		return highlightedText;
	}

	// Enhanced keyboard handling
	function handleKeydown(event) {
		if (showAppMenu) {
			if (event.key === 'Escape') {
				toggleAppMenu();
			} else if (event.key === 'Enter' && filteredApps.length > 0) {
				launchApp(filteredApps[0]);
			} else if (event.key === 'ArrowDown' && searchInput) {
				// Future: implement keyboard navigation through results
				event.preventDefault();
			}
		}
	}

	// Clear search function
	function clearSearch() {
		searchTerm = '';
		debouncedSearchTerm = '';
		if (searchInput) {
			searchInput.focus();
		}
	}

	// Search suggestions based on popular terms
	const searchSuggestions = [
		'calculator',
		'files',
		'terminal',
		'browser',
		'settings',
		'music',
		'images'
	];

	function applySuggestion(suggestion) {
		searchTerm = suggestion;
		debouncedSearchTerm = suggestion;
		if (searchInput) {
			searchInput.focus();
		}
	}

	function getIconSvg(iconType) {
		const icons = {
			calculator:
				'<g><rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="4" width="12" height="3" fill="currentColor" opacity="0.8"/><g fill="currentColor" opacity="0.6"><circle cx="8" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="16" cy="10" r="1"/><circle cx="8" cy="13" r="1"/><circle cx="12" cy="13" r="1"/><circle cx="16" cy="13" r="1"/><circle cx="8" cy="16" r="1"/><rect x="11" y="15" width="2" height="4" rx="1"/><circle cx="16" cy="16" r="1"/><rect x="7" y="19" width="4" height="2" rx="1"/></g></g>',
			document:
				'<g><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.414A2 2 0 0 0 19.414 5L15 .586A2 2 0 0 0 13.586 0H6z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M14 0v4a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" stroke-width="1.5"/><g stroke="currentColor" stroke-width="1" opacity="0.7"><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="14" x2="14" y2="14"/><line x1="8" y1="17" x2="12" y2="17"/></g></g>',
			terminal:
				'<g><rect x="2" y="3" width="20" height="18" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="3" width="20" height="4" rx="2" fill="currentColor" opacity="0.3"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="7,11 10,14 7,17"/><line x1="13" y1="17" x2="17" y2="17"/></g><circle cx="6" cy="5" r="1" fill="#ff5f56"/><circle cx="8.5" cy="5" r="1" fill="#ffbd2e"/><circle cx="11" cy="5" r="1" fill="#27ca3f"/></g>',
			folder:
				'<g><path d="M3 5a2 2 0 0 1 2-2h3.586a2 2 0 0 1 1.414.586L12.414 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="currentColor" opacity="0.2"/><path d="M10 3h2.586a2 2 0 0 1 1.414.586L12.414 6" fill="none" stroke="currentColor" stroke-width="1.5"/></g>',
			image:
				'<g><rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" opacity="0.6"/><path d="M21 15l-5-5L5 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 10l7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>',
			monitor:
				'<g><rect x="2" y="3" width="20" height="14" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="21" width="8" height="2" rx="1" fill="currentColor" opacity="0.6"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1" opacity="0.6"><line x1="6" y1="7" x2="18" y2="7"/><line x1="6" y1="9" x2="16" y2="9"/><line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="13" x2="12" y2="13"/></g></g>',
			settings:
				'<g><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/></g>',
			browser:
				'<g><rect x="2" y="3" width="20" height="18" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" stroke-width="1.5"/><circle cx="6.5" cy="6" r="1" fill="currentColor" opacity="0.6"/><circle cx="9.5" cy="6" r="1" fill="currentColor" opacity="0.6"/><circle cx="12.5" cy="6" r="1" fill="currentColor" opacity="0.6"/><rect x="6" y="13" width="12" height="2" rx="1" fill="currentColor" opacity="0.4"/><rect x="6" y="16" width="8" height="2" rx="1" fill="currentColor" opacity="0.4"/></g>',
			music:
				'<g><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M9 12h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 12h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.09 9.09L12 12l2.91-2.91" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>',
			grid: '<g><rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/></g>'
		};
		return icons[iconType] || '';
	}

	// Reactive theme classes with enhanced styling
	const dockClasses = $derived.by(() => {
		const baseClasses =
			'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex h-16 flex-row items-center justify-center px-4 backdrop-blur-2xl border shadow-2xl rounded-2xl transition-all duration-300';
		const themeClasses =
			desktopState.currentTheme === 'light'
				? 'border-white/30 bg-white/20 shadow-black/10'
				: 'border-white/20 bg-black/30 shadow-black/30';
		return `${baseClasses} ${themeClasses}`;
	});

	const appButtonClasses = $derived.by(() => {
		const baseClasses =
			'group relative mx-1.5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-125 active:scale-105 hover:-translate-y-2 hover:shadow-lg';
		const themeClasses =
			desktopState.currentTheme === 'light'
				? 'bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/40 hover:border-white/60'
				: 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-white/40';
		return `${baseClasses} ${themeClasses}`;
	});

	const iconClasses = $derived.by(() => {
		const baseClasses = 'h-6 w-6 transition-all duration-300 group-hover:scale-110';
		const themeClasses =
			desktopState.currentTheme === 'light'
				? 'text-neutral-800 group-hover:text-blue-600'
				: 'text-white group-hover:text-blue-400';
		return `${baseClasses} ${themeClasses}`;
	});

	const tooltipClasses = $derived.by(() => {
		const baseClasses =
			'pointer-events-none absolute bottom-16 left-1/2 transform -translate-x-1/2 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-2 shadow-xl backdrop-blur-lg border z-10';
		const themeClasses =
			desktopState.currentTheme === 'light'
				? 'bg-neutral-900/90 text-white border-neutral-700/50'
				: 'bg-white/95 text-neutral-900 border-neutral-200/50';
		return `${baseClasses} ${themeClasses}`;
	});

	const separatorClasses = $derived.by(() => {
		const baseClasses = 'h-8 w-px mx-2 rounded-full';
		const themeClasses = desktopState.currentTheme === 'light' ? 'bg-white/40' : 'bg-white/25';
		return `${baseClasses} ${themeClasses}`;
	});

	const runningIndicatorClasses = $derived.by(() => {
		const baseClasses = 'h-1 w-1 rounded-full transition-all duration-200 hover:scale-150';
		const themeClasses =
			desktopState.currentTheme === 'light'
				? 'bg-blue-600 shadow-lg shadow-blue-600/50'
				: 'bg-blue-400 shadow-lg shadow-blue-400/50';
		return `${baseClasses} ${themeClasses}`;
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class={dockClasses}>
	<!-- Show All Apps Button -->
	<button class={appButtonClasses} onclick={toggleAppMenu} aria-label="Show All Apps">
		<svg class={iconClasses} viewBox="0 0 24 24" fill="currentColor">
			{@html getIconSvg('grid')}
		</svg>
		<!-- Tooltip -->
		<div class={tooltipClasses}>Show All Apps</div>
	</button>

	<!-- Separator -->
	<div class={separatorClasses}></div>

	<!-- App Icons -->
	{#each apps as app}
		<button
			class={appButtonClasses}
			onclick={() => launchApp(app)}
			aria-label={`Launch ${app.name}`}
		>
			<svg class={iconClasses} viewBox="0 0 24 24" fill="currentColor">
				{@html getIconSvg(app.icon)}
			</svg>
			<!-- Tooltip -->
			<div class={tooltipClasses}>{app.name}</div>
		</button>
	{/each}

	<!-- Running Applications Indicator -->
	{#if desktopState.windows.length > 0}
		<!-- Separator -->
		<div class={separatorClasses}></div>

		<div class="flex flex-row items-center space-x-3 px-2">
			{#each desktopState.windows as window}
				<button
					class="group relative flex flex-col items-center transition-all duration-200 hover:scale-125"
					onclick={() => desktopState.setActiveWindow(window.id)}
					aria-label={`Switch to ${window.name}`}
				>
					<div class={runningIndicatorClasses}></div>
					<div
						class="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 {desktopState.currentTheme ===
						'light'
							? 'bg-black/80 text-white'
							: 'bg-white/90 text-neutral-900'}"
					>
						{window.name}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- App Menu Modal -->
{#if showAppMenu}
	<div
		class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		style="z-index: 99999;"
		role="presentation"
		onclick={toggleAppMenu}
		onkeydown={handleKeydown}
	>
		<div
			class="mx-6 max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/20 bg-black/30 p-6 shadow-2xl backdrop-blur-xl"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-label="All Applications"
			tabindex="-1"
		>
			<div class="mb-8 flex items-center justify-between">
				<div>
					<h2 class="text-3xl font-bold text-white">All Applications</h2>
					{#if lastSearchDuration > 0}
						<p class="mt-1 text-sm text-white/60">
							Search completed in {lastSearchDuration.toFixed(1)}ms
						</p>
					{/if}
				</div>
				<button
					class="rounded-xl p-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
					onclick={toggleAppMenu}
					aria-label="Close"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
			</div>

			<!-- Enhanced Search Bar -->
			<div class="mb-8">
				<div class="relative">
					<svg
						class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-white/40"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
					<input
						type="text"
						value={searchTerm}
						oninput={updateSearchTerm}
						bind:this={searchInput}
						placeholder="Search applications... (try 'calc', 'files', or 'browser')"
						class="w-full rounded-2xl border border-white/20 bg-white/10 py-4 pr-12 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-200 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 focus:outline-none"
						autocomplete="off"
					/>
					{#if searchTerm.trim()}
						<button
							class="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform text-white/40 transition-colors hover:text-white/80"
							onclick={clearSearch}
							aria-label="Clear search"
						>
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					{/if}
				</div>

				<!-- Search Status and Shortcuts -->
				<div class="mt-3 flex items-center justify-between text-sm">
					<div class="text-white/60">
						{#if debouncedSearchTerm.trim() && filteredApps.length > 0}
							Press Enter to open "{filteredApps[0].name}"
						{:else if debouncedSearchTerm.trim()}
							No results found
						{:else}
							Type to search through {apps.length} applications
						{/if}
					</div>
					<div class="text-xs text-white/40">ESC to close • ↵ to open first result</div>
				</div>
			</div>

			<!-- Apps Grid -->
			{#if filteredApps.length > 0}
				<div class="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each filteredApps as app, index}
						<button
							class="group flex flex-col items-center space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-white/30 hover:bg-white/20 active:scale-95 {index ===
								0 && debouncedSearchTerm.trim()
								? 'ring-2 ring-blue-400/50'
								: ''}"
							onclick={() => launchApp(app)}
							aria-label={`Launch ${app.name}`}
						>
							<div class="text-5xl transition-transform duration-200 group-hover:scale-110">
								{#if app.icon === 'folder'}📁
								{:else if app.icon === 'document'}📝
								{:else if app.icon === 'terminal'}💻
								{:else if app.icon === 'calculator'}🧮
								{:else if app.icon === 'image'}🖼️
								{:else if app.icon === 'monitor'}📊
								{:else if app.icon === 'settings'}⚙️
								{:else if app.icon === 'browser'}🌐
								{:else if app.icon === 'music'}🎵
								{:else}📱{/if}
							</div>
							<div class="text-center">
								<div class="mb-1 text-sm leading-tight font-medium text-white">
									{@html highlightMatch(app.name, debouncedSearchTerm)}
								</div>
								<div class="text-xs leading-tight text-white/60">
									{app.category}
								</div>
								{#if debouncedSearchTerm.trim() && app.searchScore}
									<div class="mt-1 text-xs text-blue-400/80">
										Score: {app.searchScore}
									</div>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			{:else}
				<div class="py-12 text-center">
					<div class="mb-6 text-8xl text-white/30">🔍</div>
					<h3 class="mb-3 text-xl font-medium text-white">No applications found</h3>
					<p class="mb-4 text-base text-white/60">Try searching for:</p>
					<div class="mb-6 flex flex-wrap justify-center gap-2">
						{#each searchSuggestions as suggestion}
							<button
								class="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/20 hover:text-white"
								onclick={() => applySuggestion(suggestion)}
								aria-label={`Apply suggestion: ${suggestion}`}
							>
								{suggestion}
							</button>
						{/each}
					</div>
					<div class="space-y-1 text-sm text-white/40">
						<p>• Use keywords like "calc" for Calculator</p>
						<p>• Try partial matches like "term" for Terminal</p>
						<p>• Search by category like "media" or "system"</p>
					</div>
				</div>
			{/if}

			<!-- Enhanced Quick Info -->
			<div class="mt-8 border-t border-white/20 pt-6">
				<div class="flex items-center justify-between text-sm text-white/60">
					<div>
						{#if debouncedSearchTerm.trim()}
							{filteredApps.length} of {apps.length} applications match "{debouncedSearchTerm}"
						{:else}
							{apps.length} applications available
						{/if}
					</div>
					{#if debouncedSearchTerm.trim() && filteredApps.length > 0}
						<div class="text-xs text-white/40">Sorted by relevance</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
