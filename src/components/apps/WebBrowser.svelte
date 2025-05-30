<script>
	let currentUrl = $state('https://archlinux.org');
	let history = $state(['https://archlinux.org']);
	let historyIndex = $state(0);
	let isLoading = $state(false);
	let bookmarks = $state([
		{ title: 'Arch Linux', url: 'https://archlinux.org' },
		{ title: 'AUR', url: 'https://aur.archlinux.org' },
		{ title: 'Arch Wiki', url: 'https://wiki.archlinux.org' },
		{ title: 'Reddit - Arch Linux', url: 'https://reddit.com/r/archlinux' }
	]);

	const simulatedPages = {
		'https://archlinux.org': {
			title: 'Arch Linux',
			content: `
				<div class="text-center py-8">
					<h1 class="text-4xl font-bold text-blue-600 mb-4">Arch Linux</h1>
					<p class="text-lg text-gray-600 mb-6">A simple, lightweight distribution</p>
					<div class="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto">
						<h2 class="text-xl font-semibold mb-4">Latest News</h2>
						<div class="space-y-3 text-left">
							<div class="border-b pb-2">
								<h3 class="font-medium">System Update Available</h3>
								<p class="text-sm text-gray-600">New kernel version 6.1.0-arch1-1 is now available</p>
							</div>
							<div class="border-b pb-2">
								<h3 class="font-medium">Package Repository Updates</h3>
								<p class="text-sm text-gray-600">Over 500 packages updated this week</p>
							</div>
						</div>
					</div>
				</div>
			`
		},
		'https://aur.archlinux.org': {
			title: 'AUR - Arch User Repository',
			content: `
				<div class="p-6">
					<h1 class="text-3xl font-bold mb-4">Arch User Repository</h1>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="bg-gray-100 p-4 rounded">
							<h3 class="font-semibold mb-2">Popular Packages</h3>
							<ul class="space-y-1 text-sm">
								<li>• google-chrome</li>
								<li>• visual-studio-code-bin</li>
								<li>• discord</li>
								<li>• spotify</li>
							</ul>
						</div>
						<div class="bg-gray-100 p-4 rounded">
							<h3 class="font-semibold mb-2">Recently Updated</h3>
							<ul class="space-y-1 text-sm">
								<li>• firefox-developer-edition</li>
								<li>• jetbrains-toolbox</li>
								<li>• obs-studio-git</li>
								<li>• zoom</li>
							</ul>
						</div>
					</div>
				</div>
			`
		}
	};

	function navigate(url) {
		if (!url.startsWith('http')) {
			url = 'https://' + url;
		}

		isLoading = true;
		setTimeout(() => {
			currentUrl = url;
			if (historyIndex < history.length - 1) {
				history = history.slice(0, historyIndex + 1);
			}
			history.push(url);
			historyIndex = history.length - 1;
			isLoading = false;
		}, 500);
	}

	function goBack() {
		if (historyIndex > 0) {
			historyIndex--;
			currentUrl = history[historyIndex];
		}
	}

	function goForward() {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			currentUrl = history[historyIndex];
		}
	}

	function refresh() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 300);
	}

	function handleUrlSubmit(event) {
		if (event.key === 'Enter') {
			navigate(currentUrl);
		}
	}

	let currentPage = $derived(
		simulatedPages[currentUrl] || {
			title: 'Page Not Found',
			content: `
			<div class="text-center py-12">
				<h1 class="text-2xl font-bold text-gray-600 mb-4">Page Not Available</h1>
				<p class="text-gray-500">This is a simulated browser. Only a few demo pages are available.</p>
				<div class="mt-6">
					<h3 class="font-semibold mb-2">Available pages:</h3>
					<ul class="space-y-1 text-blue-600">
						<li><a href="#" onclick="navigate('https://archlinux.org')">https://archlinux.org</a></li>
						<li><a href="#" onclick="navigate('https://aur.archlinux.org')">https://aur.archlinux.org</a></li>
					</ul>
				</div>
			</div>
		`
		}
	);
</script>

<div class="flex h-full flex-col bg-white">
	<!-- Browser Toolbar -->
	<div class="border-b border-gray-200 bg-gray-100 p-2">
		<div class="flex items-center space-x-2">
			<!-- Navigation Buttons -->
			<button
				class="rounded p-1 hover:bg-gray-200 disabled:opacity-50"
				onclick={goBack}
				disabled={historyIndex <= 0}
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1 1 0 0 0 0 1.28l5 6a1 1 0 0 0 1.54-1.28L7.14 13H19a1 1 0 0 0 0-2z"
					/>
				</svg>
			</button>

			<button
				class="rounded p-1 hover:bg-gray-200 disabled:opacity-50"
				onclick={goForward}
				disabled={historyIndex >= history.length - 1}
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M5 13h11.86l-3.63 4.36a1 1 0 0 0 1.54 1.28l5-6a1 1 0 0 0 0-1.28l-5-6a1 1 0 1 0-1.54 1.28L17.86 11H5a1 1 0 0 0 0 2z"
					/>
				</svg>
			</button>

			<button class="rounded p-1 hover:bg-gray-200" onclick={refresh}>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
					/>
				</svg>
			</button>

			<!-- URL Bar -->
			<div class="flex flex-1 items-center rounded border border-gray-300 bg-white px-3 py-1">
				{#if isLoading}
					<div class="mr-2 h-4 w-4">
						<svg class="h-full w-full animate-spin" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6z"
							/>
						</svg>
					</div>
				{:else}
					<svg class="mr-2 h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
					</svg>
				{/if}
				<input
					type="text"
					bind:value={currentUrl}
					onkeydown={handleUrlSubmit}
					class="flex-1 text-sm outline-none"
					placeholder="Enter URL..."
				/>
			</div>
		</div>

		<!-- Bookmarks -->
		<div class="mt-2 flex items-center space-x-1">
			{#each bookmarks as bookmark}
				<button
					class="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
					onclick={() => navigate(bookmark.url)}
				>
					{bookmark.title}
				</button>
			{/each}
		</div>
	</div>

	<!-- Browser Content -->
	<div class="flex-1 overflow-auto">
		{#if isLoading}
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<svg class="mx-auto mb-2 h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6z"
						/>
					</svg>
					<p class="text-gray-500">Loading...</p>
				</div>
			</div>
		{:else}
			<div class="p-4">
				{@html currentPage.content}
			</div>
		{/if}
	</div>

	<!-- Status Bar -->
	<div class="border-t border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600">
		{isLoading ? 'Loading...' : 'Done'} | {currentPage.title}
	</div>
</div>
