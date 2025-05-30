<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	// Theme-based styling
	const isDarkTheme = $derived(desktopState.currentTheme === 'dark' || 
		(desktopState.currentTheme === 'auto' && 
		typeof window !== 'undefined' && 
		window.matchMedia('(prefers-color-scheme: dark)').matches));

	const containerClasses = $derived(
		`h-full flex flex-col ${
			isDarkTheme 
				? 'text-white' 
				: 'text-gray-900'
		}`
	);

	const toolbarClasses = $derived(
		`border-b p-2 flex items-center space-x-2 ${
			isDarkTheme 
				? 'border-gray-600/30' 
				: 'border-gray-200/30'
		}`
	);

	const buttonClasses = $derived(
		`px-2 py-1 rounded text-sm transition-colors disabled:opacity-50 ${
			isDarkTheme 
				? 'bg-gray-600/20 hover:bg-gray-500/30 border border-gray-600/30' 
				: 'bg-gray-200/30 hover:bg-gray-300/40 border border-gray-300/30'
		}`
	);

	const pathBarClasses = $derived(
		`border rounded px-3 py-1 flex-1 text-sm font-mono ${
			isDarkTheme 
				? 'bg-gray-900/20 border-gray-600/30' 
				: 'bg-gray-100/30 border-gray-300/30'
		}`
	);

	const fileListClasses = $derived(
		`flex-1 overflow-auto p-4`
	);

	const fileItemClasses = $derived(
		`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
			isDarkTheme 
				? 'hover:bg-gray-700/20' 
				: 'hover:bg-gray-200/30'
		}`
	);

	const statusBarClasses = $derived(
		`border-t p-2 text-xs ${
			isDarkTheme 
				? 'border-gray-600/30 text-gray-300' 
				: 'border-gray-200/30 text-gray-600'
		}`
	);

	const fileSystem = {
		'/': {
			type: 'folder',
			name: 'Root',
			children: {
				'home': {
					type: 'folder',
					name: 'home',
					children: {
						'user': {
							type: 'folder',
							name: 'user',
							children: {
								'Documents': {
									type: 'folder',
									name: 'Documents',
									children: {
										'readme.txt': { type: 'file', name: 'readme.txt', size: '2.1 KB' },
										'project.md': { type: 'file', name: 'project.md', size: '5.3 KB' }
									}
								},
								'Downloads': {
									type: 'folder',
									name: 'Downloads',
									children: {
										'image.png': { type: 'file', name: 'image.png', size: '128 KB' },
										'archive.zip': { type: 'file', name: 'archive.zip', size: '1.2 MB' }
									}
								},
								'Desktop': { type: 'folder', name: 'Desktop', children: {} },
								'Pictures': { type: 'folder', name: 'Pictures', children: {} },
								'config.conf': { type: 'file', name: 'config.conf', size: '1.8 KB' }
							}
						}
					}
				},
				'etc': {
					type: 'folder',
					name: 'etc',
					children: {
						'hosts': { type: 'file', name: 'hosts', size: '432 B' },
						'passwd': { type: 'file', name: 'passwd', size: '1.1 KB' }
					}
				}
			}
		}
	};

	let currentPath = $state('/home/user');
	let currentDir = $derived(getCurrentDirectory());
	let pathHistory = $state(['/home/user']);
	let historyIndex = $state(0);

	function getCurrentDirectory() {
		const parts = currentPath.split('/').filter(p => p);
		let current = fileSystem['/'];
		
		for (const part of parts) {
			if (current.children && current.children[part]) {
				current = current.children[part];
			} else {
				return fileSystem['/'];
			}
		}
		return current;
	}

	function navigateTo(itemName) {
		const item = currentDir.children[itemName];
		if (item && item.type === 'folder') {
			const newPath = currentPath === '/' ? `/${itemName}` : `${currentPath}/${itemName}`;
			currentPath = newPath;
			pathHistory = [...pathHistory.slice(0, historyIndex + 1), newPath];
			historyIndex = pathHistory.length - 1;
		}
	}

	function goUp() {
		if (currentPath !== '/') {
			const parts = currentPath.split('/').filter(p => p);
			parts.pop();
			const newPath = parts.length === 0 ? '/' : '/' + parts.join('/');
			currentPath = newPath;
			pathHistory = [...pathHistory.slice(0, historyIndex + 1), newPath];
			historyIndex = pathHistory.length - 1;
		}
	}

	function goBack() {
		if (historyIndex > 0) {
			historyIndex--;
			currentPath = pathHistory[historyIndex];
		}
	}

	function goForward() {
		if (historyIndex < pathHistory.length - 1) {
			historyIndex++;
			currentPath = pathHistory[historyIndex];
		}
	}
</script>

<div class={containerClasses}>
	<!-- Toolbar -->
	<div class={toolbarClasses}>
		<button 
			class={buttonClasses}
			onclick={goBack}
			disabled={historyIndex <= 0}
		>
			←
		</button>
		<button 
			class={buttonClasses}
			onclick={goForward}
			disabled={historyIndex >= pathHistory.length - 1}
		>
			→
		</button>
		<button 
			class={buttonClasses}
			onclick={goUp}
			disabled={currentPath === '/'}
		>
			↑
		</button>
		<div class={pathBarClasses}>
			{currentPath}
		</div>
	</div>

	<!-- File List -->
	<div class={fileListClasses}>
		{#if currentDir && currentDir.children}
			<div class="grid grid-cols-1 gap-1">
				{#each Object.entries(currentDir.children) as [name, item]}
					<div 
						class={fileItemClasses}
						onclick={() => navigateTo(name)}
					>
						<div class="w-6 h-6 flex items-center justify-center">
							{#if item.type === 'folder'}
								<div class={`w-5 h-4 rounded-sm ${isDarkTheme ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
							{:else}
								<div class={`w-4 h-5 rounded-sm ${isDarkTheme ? 'bg-gray-400' : 'bg-gray-500'}`}></div>
							{/if}
						</div>
						<div class="flex-1">
							<div class="text-sm">{item.name}</div>
						</div>
						{#if item.type === 'file' && item.size}
							<div class={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{item.size}</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class={`text-center mt-8 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Empty directory</div>
		{/if}
	</div>

	<!-- Status Bar -->
	<div class={statusBarClasses}>
		{#if currentDir && currentDir.children}
			{Object.keys(currentDir.children).length} items
		{:else}
			0 items
		{/if}
	</div>
</div>
