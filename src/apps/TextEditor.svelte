<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/apps/TextEditor.svelte -->
<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let content = $state('# Welcome to Text Editor\n\nThis is a modern text editor with syntax highlighting, multiple tabs, and advanced features.\n\n## Features\n- Syntax highlighting\n- Multiple tabs\n- Find and replace\n- Line numbers\n- Word wrap\n- Auto-save\n\n```javascript\nfunction hello() {\n    console.log("Hello, World!");\n}\n```\n\nStart typing to see the editor in action!');
	let currentFile = $state('Untitled.md');
	let isModified = $state(false);
	let findText = $state('');
	let replaceText = $state('');
	let showFindReplace = $state(false);
	let showLineNumbers = $state(true);
	let wordWrap = $state(true);
	let fontSize = $state(14);
	let theme = $state('dark');
	let language = $state('markdown');
	let cursorPosition = $state({ line: 1, column: 1 });
	let wordCount = $state(0);
	let charCount = $state(0);
	let selectedText = $state('');
	let tabs = $state([
		{ id: 1, name: 'Untitled.md', content: content, modified: false, language: 'markdown' }
	]);
	let activeTab = $state(1);
	let nextTabId = $state(2);

	// Auto-save functionality
	let autoSaveTimer = $state(null);

	const isDark = $derived(desktopState.currentTheme === 'dark');

	// Update stats when content changes
	$effect(() => {
		const words = content.trim().split(/\s+/).filter(word => word.length > 0);
		wordCount = words.length;
		charCount = content.length;
		
		// Mark as modified
		if (isModified !== true) {
			isModified = true;
			updateCurrentTab();
		}

		// Auto-save after 2 seconds of inactivity
		if (autoSaveTimer) clearTimeout(autoSaveTimer);
		autoSaveTimer = setTimeout(() => {
			saveFile();
		}, 2000);
	});

	function updateCurrentTab() {
		tabs = tabs.map(tab => 
			tab.id === activeTab 
				? { ...tab, content, modified: isModified }
				: tab
		);
	}

	function switchTab(tabId) {
		// Save current content to current tab
		updateCurrentTab();
		
		// Switch to new tab
		activeTab = tabId;
		const tab = tabs.find(t => t.id === tabId);
		if (tab) {
			content = tab.content;
			currentFile = tab.name;
			isModified = tab.modified;
			language = tab.language;
		}
	}

	function createNewTab() {
		const newTab = {
			id: nextTabId,
			name: `Untitled-${nextTabId}.txt`,
			content: '',
			modified: false,
			language: 'text'
		};
		tabs = [...tabs, newTab];
		nextTabId++;
		switchTab(newTab.id);
	}

	function closeTab(tabId, event) {
		event?.stopPropagation();
		if (tabs.length === 1) return; // Don't close last tab
		
		tabs = tabs.filter(t => t.id !== tabId);
		if (activeTab === tabId) {
			switchTab(tabs[0].id);
		}
	}

	function saveFile() {
		isModified = false;
		updateCurrentTab();
		console.log(`Saved: ${currentFile}`);
	}

	function openFile() {
		// Simulate file opening
		const filename = prompt('Enter filename:');
		if (filename) {
			const newTab = {
				id: nextTabId,
				name: filename,
				content: `// Content of ${filename}\n\nThis is a sample file content.`,
				modified: false,
				language: getLanguageFromFilename(filename)
			};
			tabs = [...tabs, newTab];
			nextTabId++;
			switchTab(newTab.id);
		}
	}

	function getLanguageFromFilename(filename) {
		const ext = filename.split('.').pop()?.toLowerCase();
		const languageMap = {
			'js': 'javascript',
			'ts': 'typescript',
			'py': 'python',
			'md': 'markdown',
			'html': 'html',
			'css': 'css',
			'json': 'json',
			'xml': 'xml',
			'yaml': 'yaml',
			'yml': 'yaml'
		};
		return languageMap[ext] || 'text';
	}

	function findAndReplace() {
		if (!findText) return;
		
		const regex = new RegExp(findText, 'gi');
		content = content.replace(regex, replaceText);
		showFindReplace = false;
	}

	function insertText(text) {
		content += text;
	}

	function toggleWordWrap() {
		wordWrap = !wordWrap;
	}

	function toggleLineNumbers() {
		showLineNumbers = !showLineNumbers;
	}

	function changeFontSize(delta) {
		fontSize = Math.max(10, Math.min(24, fontSize + delta));
	}

	function handleTextareaInput(event) {
		content = event.target.value;
		
		// Update cursor position
		const textarea = event.target;
		const beforeCursor = textarea.value.substring(0, textarea.selectionStart);
		const lines = beforeCursor.split('\n');
		cursorPosition = {
			line: lines.length,
			column: lines[lines.length - 1].length + 1
		};

		// Update selected text
		if (textarea.selectionStart !== textarea.selectionEnd) {
			selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
		} else {
			selectedText = '';
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
		`px-4 py-2 border-b flex items-center justify-between ${
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

	const tabClasses = $derived(
		`px-4 py-2 rounded-t-lg transition-all duration-200 cursor-pointer border-b-2 ${
			isDark 
				? 'hover:bg-neutral-700/50' 
				: 'hover:bg-neutral-100/50'
		}`
	);

	const activeTabClasses = $derived(
		`px-4 py-2 rounded-t-lg transition-all duration-200 cursor-pointer border-b-2 ${
			isDark 
				? 'bg-neutral-700/70 border-blue-400 text-blue-400' 
				: 'bg-neutral-100/70 border-blue-500 text-blue-600'
		}`
	);

	const textareaClasses = $derived(
		`flex-1 p-4 bg-transparent resize-none outline-none font-mono ${
			wordWrap ? '' : 'whitespace-pre overflow-x-auto'
		}`
	);

	const lineNumberClasses = $derived(
		`w-12 p-4 pr-2 text-right text-xs font-mono select-none border-r ${
			isDark 
				? 'bg-neutral-800/30 border-white/10 text-neutral-500' 
				: 'bg-neutral-100/30 border-neutral-200/50 text-neutral-400'
		}`
	);
</script>

<div class={containerClasses}>
	<!-- Toolbar -->
	<div class={toolbarClasses}>
		<div class="flex items-center space-x-3">
			<button class={buttonClasses} onclick={openFile}>Open</button>
			<button class={buttonClasses} onclick={saveFile}>Save</button>
			<button class={buttonClasses} onclick={createNewTab}>New</button>
			<button class={buttonClasses} onclick={() => showFindReplace = !showFindReplace}>
				Find & Replace
			</button>
			
			<div class="h-4 w-px bg-neutral-400 mx-2"></div>
			
			<button class={buttonClasses} onclick={toggleLineNumbers}>
				{showLineNumbers ? 'Hide' : 'Show'} Numbers
			</button>
			<button class={buttonClasses} onclick={toggleWordWrap}>
				{wordWrap ? 'No' : ''} Wrap
			</button>
		</div>

		<div class="flex items-center space-x-3">
			<div class="flex items-center space-x-1">
				<button class={buttonClasses} onclick={() => changeFontSize(-1)}>A-</button>
				<span class="text-sm px-2">{fontSize}px</span>
				<button class={buttonClasses} onclick={() => changeFontSize(1)}>A+</button>
			</div>
			
			<select 
				bind:value={language}
				class="px-2 py-1 rounded text-sm {isDark ? 'bg-neutral-700 text-white' : 'bg-white text-neutral-900'}"
			>
				<option value="text">Plain Text</option>
				<option value="markdown">Markdown</option>
				<option value="javascript">JavaScript</option>
				<option value="python">Python</option>
				<option value="html">HTML</option>
				<option value="css">CSS</option>
				<option value="json">JSON</option>
			</select>
		</div>
	</div>

	<!-- Find & Replace Panel -->
	{#if showFindReplace}
		<div class="px-4 py-3 border-b flex items-center space-x-3 {isDark ? 'bg-neutral-800/30 border-white/10' : 'bg-neutral-100/30 border-neutral-200/50'}">
			<input 
				type="text" 
				placeholder="Find..." 
				bind:value={findText}
				class="px-3 py-1 rounded text-sm {isDark ? 'bg-neutral-700 text-white' : 'bg-white text-neutral-900'}"
			/>
			<input 
				type="text" 
				placeholder="Replace..." 
				bind:value={replaceText}
				class="px-3 py-1 rounded text-sm {isDark ? 'bg-neutral-700 text-white' : 'bg-white text-neutral-900'}"
			/>
			<button class={buttonClasses} onclick={findAndReplace}>Replace All</button>
			<button class="text-lg hover:bg-neutral-500/20 p-1 rounded" onclick={() => showFindReplace = false}>×</button>
		</div>
	{/if}

	<!-- Tabs -->
	<div class="flex items-center border-b overflow-x-auto {isDark ? 'border-white/10' : 'border-neutral-200/50'}">
		{#each tabs as tab}
			<div 
				class={tab.id === activeTab ? activeTabClasses : tabClasses}
				onclick={() => switchTab(tab.id)}
			>
				<div class="flex items-center space-x-2">
					<span class="text-sm">{tab.name}</span>
					{#if tab.modified}
						<span class="w-2 h-2 bg-orange-500 rounded-full"></span>
					{/if}
					{#if tabs.length > 1}
						<button 
							class="text-xs hover:bg-red-500/20 w-4 h-4 rounded flex items-center justify-center"
							onclick={(e) => closeTab(tab.id, e)}
						>
							×
						</button>
					{/if}
				</div>
			</div>
		{/each}
		<button 
			class="px-2 py-2 text-lg hover:bg-neutral-500/20 rounded"
			onclick={createNewTab}
		>
			+
		</button>
	</div>

	<!-- Editor Area -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Line Numbers -->
		{#if showLineNumbers}
			<div class={lineNumberClasses}>
				{#each { length: content.split('\n').length } as _, i}
					<div class="leading-6">{i + 1}</div>
				{/each}
			</div>
		{/if}

		<!-- Text Area -->
		<textarea 
			bind:value={content}
			oninput={handleTextareaInput}
			class={textareaClasses}
			style="font-size: {fontSize}px; line-height: 1.5;"
			placeholder="Start typing..."
			spellcheck="false"
		></textarea>
	</div>

	<!-- Status Bar -->
	<div class="px-4 py-2 border-t text-xs flex items-center justify-between {isDark ? 'border-white/10 bg-neutral-800/30' : 'border-neutral-200/50 bg-neutral-50/30'}">
		<div class="flex items-center space-x-4">
			<span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
			<span>{language}</span>
			{#if isModified}
				<span class="text-orange-500">Modified</span>
			{:else}
				<span class="text-green-500">Saved</span>
			{/if}
		</div>
		<div class="flex items-center space-x-4">
			<span>{wordCount} words</span>
			<span>{charCount} characters</span>
			{#if selectedText}
				<span>{selectedText.length} selected</span>
			{/if}
		</div>
	</div>
</div>