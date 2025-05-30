<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';
	import {
		FileExplorer,
		TextEditor,
		Terminal,
		Calculator,
		ImageViewer,
		SystemMonitor,
		Settings
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
			component: null // Will create this component
		},
		{
			id: 'system-monitor',
			name: 'System Monitor',
			icon: 'monitor',
			component: null // Will create this component
		},
		{
			id: 'settings',
			name: 'Settings',
			icon: 'settings',
			component: null // Will create this component
		},
		{
			id: 'web-browser',
			name: 'Web Browser',
			icon: 'browser',
			component: null // Will create this component
		},
		{
			id: 'music-player',
			name: 'Music Player',
			icon: 'music',
			component: null // Will create this component
		}
	];

	function launchApp(app) {
		desktopState.openWindow(app.id, app.name, app.component);
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
				'<g><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 1v6m0 8v6m11-5h-6m-8 0H1m15.5-8.5L19 9l-2.5 2.5M7.5 6.5L5 9l2.5 2.5m7 7L17 21l-2.5-2.5M7.5 17.5L5 15l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="1" fill="currentColor"/></g>'
		};
		return icons[iconType] || '';
	}
</script>

<div
	class="fixed top-8 bottom-0 left-0 z-40 flex w-16 flex-col items-center border-r border-gray-600 bg-gray-800 py-4"
>
	<!-- App Icons -->
	{#each apps as app}
		<button
			class="group relative mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700 transition-colors hover:bg-gray-600"
			onclick={() => launchApp(app)}
		>
			<svg
				class="h-6 w-6 text-gray-300 group-hover:text-white"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				{@html getIconSvg(app.icon)}
			</svg>

			<!-- Tooltip -->
			<div
				class="pointer-events-none absolute left-16 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
			>
				{app.name}
			</div>
		</button>
	{/each}

	<!-- Running Applications Indicator -->
	<div class="mt-auto w-full border-t border-gray-600 pt-2">
		{#each desktopState.windows as window}
			<div
				class="mx-auto mb-1 h-2 w-2 cursor-pointer rounded-full bg-blue-400 hover:bg-blue-300"
				onclick={() => desktopState.setActiveWindow(window.id)}
			></div>
		{/each}
	</div>
</div>
