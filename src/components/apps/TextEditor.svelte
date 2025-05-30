<script>
	let content = $state('Welcome to Arch Text Editor!\n\nType your text here...');
	let filename = $state('untitled.txt');
	let hasUnsavedChanges = $state(false);
	let lastSavedContent = $state(content);

	$effect(() => {
		hasUnsavedChanges = content !== lastSavedContent;
	});

	function newFile() {
		if (hasUnsavedChanges) {
			if (!confirm('You have unsaved changes. Are you sure you want to create a new file?')) {
				return;
			}
		}
		content = '';
		filename = 'untitled.txt';
		lastSavedContent = '';
		hasUnsavedChanges = false;
	}

	function saveFile() {
		// Simulate saving
		lastSavedContent = content;
		hasUnsavedChanges = false;

		// Create a download link for the file
		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	function clearContent() {
		if (hasUnsavedChanges) {
			if (!confirm('Are you sure you want to clear all content?')) {
				return;
			}
		}
		content = '';
	}

	function openFile() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.txt,.md,.js,.html,.css,.json';
		input.onchange = (e) => {
			const file = e.target.files[0];
			if (file) {
				filename = file.name;
				const reader = new FileReader();
				reader.onload = (e) => {
					content = e.target.result;
					lastSavedContent = content;
					hasUnsavedChanges = false;
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}

	let wordCount = $derived(content.trim() === '' ? 0 : content.trim().split(/\s+/).length);
	let charCount = $derived(content.length);
	let lineCount = $derived(content.split('\n').length);
</script>

<div class="flex h-full flex-col">
	<!-- Toolbar -->
	<div class="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2">
		<div class="flex items-center space-x-2">
			<button
				class="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
				onclick={newFile}
			>
				New
			</button>
			<button
				class="rounded bg-green-500 px-3 py-1 text-sm text-white transition-colors hover:bg-green-600"
				onclick={openFile}
			>
				Open
			</button>
			<button
				class="rounded bg-purple-500 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-600"
				onclick={saveFile}
			>
				Save
			</button>
			<button
				class="rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600"
				onclick={clearContent}
			>
				Clear
			</button>
		</div>

		<div class="text-sm text-gray-600">
			{filename}{hasUnsavedChanges ? ' *' : ''}
		</div>
	</div>

	<!-- Editor Area -->
	<div class="flex-1 p-4">
		<textarea
			bind:value={content}
			class="h-full w-full resize-none rounded border border-gray-300 p-3 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder="Start typing..."
			spellcheck="false"
		></textarea>
	</div>

	<!-- Status Bar -->
	<div
		class="flex justify-between border-t border-gray-200 bg-gray-100 px-4 py-2 text-xs text-gray-600"
	>
		<div>
			Lines: {lineCount} | Words: {wordCount} | Characters: {charCount}
		</div>
		<div>
			{hasUnsavedChanges ? 'Modified' : 'Saved'}
		</div>
	</div>
</div>
