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

	const apps = [
		{
			id: 'file-explorer',
			name: 'Files',
			icon: 'folder',
			component: FileExplorer
		},
		{
			id: 'text-editor',
			name: 'Text Editor',
			icon: 'document',
			component: TextEditor
		},
		{
			id: 'terminal',
			name: 'Terminal',
			icon: 'terminal',
			component: Terminal
		},
		{
			id: 'calculator',
			name: 'Calculator',
			icon: 'calculator',
			component: Calculator
		},
		{
			id: 'image-viewer',
			name: 'Image Viewer',
			icon: 'image',
			component: ImageViewer
		},
		{
			id: 'system-monitor',
			name: 'System Monitor',
			icon: 'monitor',
			component: SystemMonitor
		},
		{
			id: 'settings',
			name: 'Settings',
			icon: 'settings',
			component: Settings
		},
		{
			id: 'web-browser',
			name: 'Web Browser',
			icon: 'browser',
			component: WebBrowser
		},
		{
			id: 'music-player',
			name: 'Music Player',
			icon: 'music',
			component: MusicPlayer
		}
	];

	function launchApp(app) {
		if (app.component) {
			desktopState.openWindow(app.id, app.name, app.component);
		} else {
			console.warn(`No component available for ${app.name}`);
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
				'<g><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/><path d="M9 12h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 12h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.09 9.09L12 12l2.91-2.91" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>'
		};
		return icons[iconType] || '';
	}

	// Reactive theme classes
	const dockClasses = $derived(() => {
		const baseClasses = "fixed top-8 bottom-0 left-0 z-40 flex w-16 flex-col items-center py-4";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'border-r border-gray-300 bg-gray-200' 
			: 'border-r border-gray-600 bg-gray-800';
		return `${baseClasses} ${themeClasses}`;
	});

	const appButtonClasses = $derived(() => {
		const baseClasses = "group relative mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-colors";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'bg-gray-300 hover:bg-gray-400' 
			: 'bg-gray-700 hover:bg-gray-600';
		return `${baseClasses} ${themeClasses}`;
	});

	const iconClasses = $derived(() => {
		const baseClasses = "h-6 w-6 group-hover:text-white";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-gray-700' 
			: 'text-gray-300';
		return `${baseClasses} ${themeClasses}`;
	});

	const tooltipClasses = $derived(() => {
		const baseClasses = "pointer-events-none absolute left-16 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'bg-gray-800 text-white' 
			: 'bg-gray-900 text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const separatorClasses = $derived(() => {
		const baseClasses = "mt-auto w-full pt-2";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'border-t border-gray-400' 
			: 'border-t border-gray-600';
		return `${baseClasses} ${themeClasses}`;
	});
</script>

<div
	class={dockClasses()}
>
	<!-- App Icons -->
	{#each apps as app}
		<button
			class={appButtonClasses()}
			onclick={() => launchApp(app)}
		>
			<svg
				class={iconClasses()}
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				{@html getIconSvg(app.icon)}
			</svg>

			<!-- Tooltip -->
			<div
				class={tooltipClasses()}
			>
				{app.name}
			</div>
		</button>
	{/each}

	<!-- Running Applications Indicator -->
	<div class={separatorClasses()}>
		{#each desktopState.windows as window}
			<button
				class="mx-auto mb-1 h-2 w-2 cursor-pointer rounded-full bg-blue-400 hover:bg-blue-300 block border-0 p-0"
				onclick={() => desktopState.setActiveWindow(window.id)}
				aria-label={`Switch to ${window.name}`}
			></button>
		{/each}
	</div>
</div>
