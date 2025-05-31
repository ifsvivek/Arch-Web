<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/apps/FileExplorer.svelte -->
<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let currentPath = $state('/home/user');
	let files = $state([
		{ name: 'Documents', type: 'folder', size: '-', modified: '2024-01-15', icon: '📁' },
		{ name: 'Downloads', type: 'folder', size: '-', modified: '2024-01-14', icon: '📁' },
		{ name: 'Pictures', type: 'folder', size: '-', modified: '2024-01-13', icon: '📁' },
		{ name: 'Music', type: 'folder', size: '-', modified: '2024-01-12', icon: '📁' },
		{ name: 'Videos', type: 'folder', size: '-', modified: '2024-01-11', icon: '📁' },
		{ name: 'Desktop', type: 'folder', size: '-', modified: '2024-01-10', icon: '📁' },
		{ name: 'README.md', type: 'file', size: '2.4 KB', modified: '2024-01-15', icon: '📄' },
		{ name: 'config.json', type: 'file', size: '1.2 KB', modified: '2024-01-14', icon: '⚙️' },
		{ name: 'image.png', type: 'file', size: '256 KB', modified: '2024-01-13', icon: '🖼️' },
		{ name: 'script.sh', type: 'file', size: '892 B', modified: '2024-01-12', icon: '📜' },
	]);
	let viewMode = $state('grid'); // 'grid' or 'list'
	let selectedFiles = $state(new Set());
	let searchTerm = $state('');
	let sortBy = $state('name'); // 'name', 'size', 'modified'
	let sortOrder = $state('asc'); // 'asc' or 'desc'
	let showHidden = $state(false);
	let breadcrumbs = $state(['home', 'user']);

	const isDark = $derived(desktopState.currentTheme === 'dark');

	const filteredFiles = $derived.by(() => {
		let filtered = files.filter(file => 
			file.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (!showHidden) {
			filtered = filtered.filter(file => !file.name.startsWith('.'));
		}

		// Sort files
		filtered.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'size':
					comparison = a.size.localeCompare(b.size);
					break;
				case 'modified':
					comparison = new Date(a.modified) - new Date(b.modified);
					break;
			}
			return sortOrder === 'asc' ? comparison : -comparison;
		});

		// Folders first
		return filtered.sort((a, b) => {
			if (a.type === 'folder' && b.type === 'file') return -1;
			if (a.type === 'file' && b.type === 'folder') return 1;
			return 0;
		});
	});

	function navigateToFolder(folderName) {
		if (folderName === '..') {
			if (breadcrumbs.length > 1) {
				breadcrumbs = breadcrumbs.slice(0, -1);
				currentPath = '/' + breadcrumbs.join('/');
			}
		} else {
			breadcrumbs = [...breadcrumbs, folderName];
			currentPath = '/' + breadcrumbs.join('/');
		}
		selectedFiles = new Set();
	}

	function navigateToBreadcrumb(index) {
		breadcrumbs = breadcrumbs.slice(0, index + 1);
		currentPath = '/' + breadcrumbs.join('/');
		selectedFiles = new Set();
	}

	function toggleFileSelection(fileName) {
		const newSelected = new Set(selectedFiles);
		if (newSelected.has(fileName)) {
			newSelected.delete(fileName);
		} else {
			newSelected.add(fileName);
		}
		selectedFiles = newSelected;
	}

	function openFile(file) {
		if (file.type === 'folder') {
			navigateToFolder(file.name);
		} else {
			// Open file based on type
			console.log(`Opening file: ${file.name}`);
		}
	}

	function deleteSelected() {
		if (selectedFiles.size > 0 && confirm(`Delete ${selectedFiles.size} item(s)?`)) {
			files = files.filter(file => !selectedFiles.has(file.name));
			selectedFiles = new Set();
		}
	}

	function createNewFolder() {
		const name = prompt('Folder name:');
		if (name) {
			files = [...files, {
				name,
				type: 'folder',
				size: '-',
				modified: new Date().toISOString().split('T')[0],
				icon: '📁'
			}];
		}
	}

	function toggleSort(field) {
		if (sortBy === field) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortOrder = 'asc';
		}
	}

	const containerClasses = $derived(
		`h-full flex flex-col backdrop-blur-xl border ${
			isDark 
				? 'bg-neutral-900/20 border-white/10 text-white' 
				: 'bg-white/20 border-neutral-200/30 text-neutral-900'
		}`
	);

	const toolbarClasses = $derived(
		`p-4 border-b flex items-center justify-between ${
			isDark 
				? 'bg-neutral-800/50 border-white/10' 
				: 'bg-neutral-50/50 border-neutral-200/50'
		}`
	);

	const buttonClasses = $derived(
		`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
			isDark 
				? 'bg-neutral-700/50 hover:bg-neutral-600/70 border-white/10 text-white' 
				: 'bg-white/50 hover:bg-neutral-100/70 border-neutral-200/30 text-neutral-900'
		}`
	);

	const searchInputClasses = $derived(
		`px-3 py-2 rounded-lg text-sm backdrop-blur-sm border ${
			isDark 
				? 'bg-neutral-700/50 border-white/10 text-white placeholder-neutral-400' 
				: 'bg-white/50 border-neutral-200/30 text-neutral-900 placeholder-neutral-500'
		}`
	);

	const fileItemClasses = $derived(
		`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm border ${
			isDark 
				? 'hover:bg-neutral-700/50 border-white/5' 
				: 'hover:bg-neutral-100/50 border-neutral-200/20'
		}`
	);

	const selectedFileClasses = $derived(
		`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm border ${
			isDark 
				? 'bg-blue-600/30 border-blue-400/50' 
				: 'bg-blue-100/50 border-blue-300/50'
		}`
	);
</script>

<div class={containerClasses}>
	<!-- Toolbar -->
	<div class={toolbarClasses}>
		<div class="flex items-center space-x-3">
			<!-- Navigation buttons -->
			<button 
				class={buttonClasses}
				onclick={() => navigateToFolder('..')}
				disabled={breadcrumbs.length <= 1}
			>
				← Back
			</button>
			
			<!-- Breadcrumbs -->
			<nav class="flex items-center space-x-1 text-sm">
				{#each breadcrumbs as crumb, index}
					<button 
						class="hover:underline {index === breadcrumbs.length - 1 ? 'font-semibold' : ''}"
						onclick={() => navigateToBreadcrumb(index)}
					>
						{crumb}
					</button>
					{#if index < breadcrumbs.length - 1}
						<span class="text-neutral-400">/</span>
					{/if}
				{/each}
			</nav>
		</div>

		<div class="flex items-center space-x-3">
			<!-- Search -->
			<input 
				type="text" 
				placeholder="Search files..." 
				bind:value={searchTerm}
				class={searchInputClasses}
			/>
			
			<!-- View mode toggle -->
			<button 
				class={buttonClasses}
				onclick={() => viewMode = viewMode === 'grid' ? 'list' : 'grid'}
			>
				{viewMode === 'grid' ? '☰' : '⊞'}
			</button>
		</div>
	</div>

	<!-- Action bar -->
	<div class="px-4 py-2 flex items-center justify-between text-sm border-b {isDark ? 'border-white/10' : 'border-neutral-200/50'}">
		<div class="flex items-center space-x-3">
			<button class={buttonClasses} onclick={createNewFolder}>
				+ New Folder
			</button>
			
			{#if selectedFiles.size > 0}
				<button class="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/70 hover:bg-red-600/80 text-white transition-all duration-200" onclick={deleteSelected}>
					Delete ({selectedFiles.size})
				</button>
			{/if}
		</div>

		<div class="flex items-center space-x-3">
			<label class="flex items-center space-x-2">
				<input type="checkbox" bind:checked={showHidden} class="rounded" />
				<span>Show hidden</span>
			</label>
			
			<span class="text-xs opacity-60">
				{filteredFiles.length} items
			</span>
		</div>
	</div>

	<!-- File listing -->
	<div class="flex-1 overflow-auto p-4">
		{#if viewMode === 'grid'}
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each filteredFiles as file}
					<div 
						class={selectedFiles.has(file.name) ? selectedFileClasses : fileItemClasses}
						onclick={() => toggleFileSelection(file.name)}
						ondblclick={() => openFile(file)}
					>
						<div class="text-center">
							<div class="text-4xl mb-2">{file.icon}</div>
							<div class="text-sm font-medium truncate">{file.name}</div>
							<div class="text-xs opacity-60 mt-1">{file.size}</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="space-y-1">
				<!-- List header -->
				<div class="grid grid-cols-12 gap-4 px-3 py-2 text-sm font-semibold border-b {isDark ? 'border-white/10' : 'border-neutral-200/50'}">
					<div class="col-span-6 cursor-pointer hover:underline" onclick={() => toggleSort('name')}>
						Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
					</div>
					<div class="col-span-2 cursor-pointer hover:underline" onclick={() => toggleSort('size')}>
						Size {sortBy === 'size' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
					</div>
					<div class="col-span-3 cursor-pointer hover:underline" onclick={() => toggleSort('modified')}>
						Modified {sortBy === 'modified' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
					</div>
					<div class="col-span-1">Type</div>
				</div>

				<!-- File rows -->
				{#each filteredFiles as file}
					<div 
						class="grid grid-cols-12 gap-4 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] {selectedFiles.has(file.name) ? (isDark ? 'bg-blue-600/30' : 'bg-blue-100/50') : (isDark ? 'hover:bg-neutral-700/30' : 'hover:bg-neutral-100/30')}"
						onclick={() => toggleFileSelection(file.name)}
						ondblclick={() => openFile(file)}
					>
						<div class="col-span-6 flex items-center space-x-2">
							<span class="text-lg">{file.icon}</span>
							<span class="text-sm font-medium truncate">{file.name}</span>
						</div>
						<div class="col-span-2 text-sm opacity-80">{file.size}</div>
						<div class="col-span-3 text-sm opacity-80">{file.modified}</div>
						<div class="col-span-1 text-xs opacity-60 uppercase">{file.type}</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if filteredFiles.length === 0}
			<div class="text-center py-12">
				<div class="text-4xl mb-4 opacity-30">📁</div>
				<p class="text-lg font-medium opacity-60">No files found</p>
				<p class="text-sm opacity-40 mt-1">Try adjusting your search or filters</p>
			</div>
		{/if}
	</div>

	<!-- Status bar -->
	<div class="px-4 py-2 border-t text-xs flex items-center justify-between {isDark ? 'border-white/10 bg-neutral-800/30' : 'border-neutral-200/50 bg-neutral-50/30'}">
		<span>{selectedFiles.size} selected</span>
		<span>{currentPath}</span>
	</div>
</div>