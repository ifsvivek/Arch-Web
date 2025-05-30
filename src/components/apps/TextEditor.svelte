<script>
	let content = $state('');
	let filename = $state('untitled.txt');
	let saved = $state(true);

	$effect(() => {
		if (content) {
			saved = false;
		}
	});

	function newFile() {
		content = '';
		filename = 'untitled.txt';
		saved = true;
	}

	function saveFile() {
		// Simulate saving
		console.log(`Saving ${filename}:`, content);
		saved = true;
		
		// Create a blob and trigger download
		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function clearContent() {
		content = '';
	}
</script>

<div class="bg-gray-800 text-white h-full flex flex-col">
	<!-- Toolbar -->
	<div class="bg-gray-700 border-b border-gray-600 p-2 flex items-center space-x-2">
		<button 
			class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition-colors"
			onclick={newFile}
		>
			New
		</button>
		<button 
			class="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition-colors"
			onclick={saveFile}
		>
			Save
		</button>
		<button 
			class="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm transition-colors"
			onclick={clearContent}
		>
			Clear
		</button>
		<div class="flex-1"></div>
		<span class="text-xs text-gray-300">
			{filename} {saved ? '' : '(modified)'}
		</span>
	</div>

	<!-- Editor -->
	<div class="flex-1 p-4">
		<textarea 
			bind:value={content}
			class="w-full h-full bg-gray-900 text-white border border-gray-600 rounded p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
			placeholder="Start typing..."
		></textarea>
	</div>

	<!-- Status Bar -->
	<div class="bg-gray-700 border-t border-gray-600 p-2 text-xs text-gray-300 flex justify-between">
		<span>Lines: {content.split('\n').length}</span>
		<span>Characters: {content.length}</span>
	</div>
</div>
