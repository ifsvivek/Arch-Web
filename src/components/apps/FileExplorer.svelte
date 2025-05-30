<script>
	let currentPath = $state('/home/archuser');
	let selectedItem = $state(null);

	const fileSystem = {
		'/': {
			type: 'directory',
			contents: {
				home: { type: 'directory', contents: { archuser: { type: 'directory', contents: {} } } },
				etc: { type: 'directory', contents: {} },
				usr: { type: 'directory', contents: {} },
				var: { type: 'directory', contents: {} },
				boot: { type: 'directory', contents: {} }
			}
		},
		'/home/archuser': {
			type: 'directory',
			contents: {
				Documents: {
					type: 'directory',
					contents: {
						'README.md': { type: 'file', size: '2.1 KB', modified: '2024-01-15' },
						projects: { type: 'directory', contents: {} },
						'notes.txt': { type: 'file', size: '845 B', modified: '2024-01-14' }
					}
				},
				Downloads: {
					type: 'directory',
					contents: {
						'arch-linux.iso': { type: 'file', size: '2.1 GB', modified: '2024-01-10' },
						'screenshot.png': { type: 'file', size: '1.2 MB', modified: '2024-01-13' }
					}
				},
				Pictures: {
					type: 'directory',
					contents: {
						wallpapers: { type: 'directory', contents: {} },
						'vacation.jpg': { type: 'file', size: '3.4 MB', modified: '2024-01-12' }
					}
				},
				Music: {
					type: 'directory',
					contents: {
						album1: { type: 'directory', contents: {} },
						'song.mp3': { type: 'file', size: '4.2 MB', modified: '2024-01-11' }
					}
				},
				Videos: { type: 'directory', contents: {} },
				Desktop: { type: 'directory', contents: {} },
				'.bashrc': { type: 'file', size: '3.2 KB', modified: '2024-01-08' },
				'.config': { type: 'directory', contents: {} }
			}
		}
	};

	function getDirectoryContents(path) {
		const dir = fileSystem[path];
		return dir ? dir.contents : {};
	}

	function navigateTo(path) {
		if (fileSystem[path] && fileSystem[path].type === 'directory') {
			currentPath = path;
			selectedItem = null;
		}
	}

	function navigateUp() {
		if (currentPath !== '/') {
			const parts = currentPath.split('/');
			parts.pop();
			const newPath = parts.join('/') || '/';
			navigateTo(newPath);
		}
	}

	function openItem(name, item) {
		if (item.type === 'directory') {
			const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
			navigateTo(newPath);
		} else {
			selectedItem = selectedItem === name ? null : name;
		}
	}

	function getItemIcon(item, name) {
		if (item.type === 'directory') {
			return 'M3 5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z';
		}

		const ext = name.split('.').pop()?.toLowerCase();
		switch (ext) {
			case 'txt':
			case 'md':
				return 'M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.414A2 2 0 0 0 19.414 5L15 .586A2 2 0 0 0 13.586 0H6z';
			case 'jpg':
			case 'png':
			case 'gif':
				return 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z';
			case 'mp3':
			case 'wav':
				return 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';
			case 'mp4':
			case 'avi':
				return 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z';
			case 'iso':
				return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z';
			default:
				return 'M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.414A2 2 0 0 0 19.414 5L15 .586A2 2 0 0 0 13.586 0H6z';
		}
	}

	let contents = $derived(getDirectoryContents(currentPath));
	let pathParts = $derived(currentPath.split('/').filter((part) => part));
</script>

<div class="flex h-full flex-col bg-white">
	<!-- Address Bar -->
	<div class="border-b border-gray-200 bg-gray-50 p-2">
		<div class="flex items-center space-x-2">
			<button
				onclick={navigateUp}
				class="rounded p-1 hover:bg-gray-200 disabled:opacity-50"
				disabled={currentPath === '/'}
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1 1 0 0 0 0 1.28l5 6a1 1 0 0 0 1.54-1.28L7.14 13H19a1 1 0 0 0 0-2z"
					/>
				</svg>
			</button>

			<div class="flex items-center text-sm">
				<button onclick={() => navigateTo('/')} class="rounded px-1 hover:bg-gray-200"> / </button>
				{#each pathParts as part, index}
					<span class="text-gray-400">/</span>
					<button
						onclick={() => navigateTo('/' + pathParts.slice(0, index + 1).join('/'))}
						class="rounded px-1 hover:bg-gray-200"
					>
						{part}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- File List -->
	<div class="flex-1 overflow-auto p-2">
		<div class="grid grid-cols-1 gap-1">
			{#each Object.entries(contents) as [name, item]}
				<div
					class="flex cursor-pointer items-center rounded p-2 select-none hover:bg-blue-50 {selectedItem ===
					name
						? 'bg-blue-100'
						: ''}"
					onclick={() => openItem(name, item)}
					ondblclick={() => {
						if (item.type === 'directory') {
							const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
							navigateTo(newPath);
						}
					}}
				>
					<div class="mr-3 h-6 w-6 {item.type === 'directory' ? 'text-blue-500' : 'text-gray-500'}">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d={getItemIcon(item, name)} />
						</svg>
					</div>

					<div class="flex-1">
						<div class="text-sm font-medium">{name}</div>
						{#if item.type === 'file'}
							<div class="text-xs text-gray-500">
								{item.size} • Modified {item.modified}
							</div>
						{:else}
							<div class="text-xs text-gray-500">Folder</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if Object.keys(contents).length === 0}
			<div class="mt-8 text-center text-gray-500">
				<svg class="mx-auto mb-2 h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M3 5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"
					/>
				</svg>
				<p>This folder is empty</p>
			</div>
		{/if}
	</div>

	<!-- Status Bar -->
	<div class="border-t border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600">
		{Object.keys(contents).length} items in {currentPath}
	</div>
</div>
