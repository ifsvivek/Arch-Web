<script>
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

<div class="bg-gray-800 text-white h-full flex flex-col">
	<!-- Toolbar -->
	<div class="bg-gray-700 border-b border-gray-600 p-2 flex items-center space-x-2">
		<button 
			class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors disabled:opacity-50"
			onclick={goBack}
			disabled={historyIndex <= 0}
		>
			←
		</button>
		<button 
			class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors disabled:opacity-50"
			onclick={goForward}
			disabled={historyIndex >= pathHistory.length - 1}
		>
			→
		</button>
		<button 
			class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors disabled:opacity-50"
			onclick={goUp}
			disabled={currentPath === '/'}
		>
			↑
		</button>
		<div class="bg-gray-900 border border-gray-600 rounded px-3 py-1 flex-1 text-sm font-mono">
			{currentPath}
		</div>
	</div>

	<!-- File List -->
	<div class="flex-1 overflow-auto p-4">
		{#if currentDir && currentDir.children}
			<div class="grid grid-cols-1 gap-1">
				{#each Object.entries(currentDir.children) as [name, item]}
					<div 
						class="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
						onclick={() => navigateTo(name)}
					>
						<div class="w-6 h-6 flex items-center justify-center">
							{#if item.type === 'folder'}
								<div class="w-5 h-4 bg-blue-500 rounded-sm"></div>
							{:else}
								<div class="w-4 h-5 bg-gray-400 rounded-sm"></div>
							{/if}
						</div>
						<div class="flex-1">
							<div class="text-sm">{item.name}</div>
						</div>
						{#if item.type === 'file' && item.size}
							<div class="text-xs text-gray-400">{item.size}</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-gray-400 text-center mt-8">Empty directory</div>
		{/if}
	</div>

	<!-- Status Bar -->
	<div class="bg-gray-700 border-t border-gray-600 p-2 text-xs text-gray-300">
		{#if currentDir && currentDir.children}
			{Object.keys(currentDir.children).length} items
		{:else}
			0 items
		{/if}
	</div>
</div>
