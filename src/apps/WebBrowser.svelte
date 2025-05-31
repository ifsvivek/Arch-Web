<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let tabs = $state([
		{ id: 1, title: 'New Tab', url: 'about:blank', active: true, loading: false }
	]);
	let currentTab = $state(tabs[0]);
	let addressBar = $state('https://ifsvivek.in');
	let showBookmarks = $state(false);
	let history = $state([
		{ url: 'https://ifsvivek.in', title: 'ifsvivek.in', timestamp: Date.now() }
	]);
	let bookmarks = $state([
		{ title: 'ifsvivek.in', url: 'https://ifsvivek.in', favicon: '🔖' },
		{ title: 'ImageCDN', url: 'https://imagecdn.ifsvivek.in', favicon: '🔖' },
		{ title: 'Sugar Tracker', url: 'https://sugar.ifsvivek.in', favicon: '🔖' }
	]);
	let showHistory = $state(false);
	let canGoBack = $state(false);
	let canGoForward = $state(false);

	const isDarkTheme = $derived(
		desktopState.currentTheme === 'dark' ||
			(desktopState.currentTheme === 'auto' &&
				typeof window !== 'undefined' &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	function createNewTab(url = 'about:blank') {
		const newTab = {
			id: Date.now(),
			title: 'New Tab',
			url,
			active: false,
			loading: url !== 'about:blank'
		};
		tabs = [...tabs, newTab];
		switchToTab(newTab);
	}

	function closeTab(tabId) {
		if (tabs.length === 1) return;

		const tabIndex = tabs.findIndex((t) => t.id === tabId);
		const wasActive = tabs[tabIndex].active;

		tabs = tabs.filter((t) => t.id !== tabId);

		if (wasActive && tabs.length > 0) {
			const newActiveIndex = Math.min(tabIndex, tabs.length - 1);
			switchToTab(tabs[newActiveIndex]);
		}
	}

	function switchToTab(tab) {
		tabs = tabs.map((t) => ({ ...t, active: t.id === tab.id }));
		currentTab = tab;
		addressBar = tab.url === 'about:blank' ? '' : tab.url;
	}

	function navigateTo(url) {
		// Only allow navigation to your portfolio domains
		const allowedDomains = ['ifsvivek.in', 'imagecdn.ifsvivek.in', 'sugar.ifsvivek.in'];

		try {
			const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
			const domain = urlObj.hostname;

			if (!allowedDomains.includes(domain)) {
				// Redirect to main portfolio if trying to access other domains
				url = 'https://ifsvivek.in';
			}
		} catch {
			// If URL parsing fails, redirect to main portfolio
			url = 'https://ifsvivek.in';
		}

		currentTab.loading = true;
		currentTab.url = url;
		currentTab.title = 'Loading...';
		addressBar = url;
		tabs = [...tabs];

		// Add to history
		history = [
			{ url, title: getDomainFromUrl(url), timestamp: Date.now() },
			...history.slice(0, 49)
		];
	}

	function handleAddressBarKeydown(event) {
		if (event.key === 'Enter') {
			navigateTo(addressBar);
		}
	}

	function goBack() {
		canGoBack = false;
		canGoForward = true;
		// Simulate navigation
		console.log('Going back');
	}

	function goForward() {
		canGoForward = false;
		canGoBack = true;
		// Simulate navigation
		console.log('Going forward');
	}

	function refresh() {
		if (currentTab.url !== 'about:blank' && currentTab.url) {
			currentTab.loading = true;
			tabs = [...tabs];
			// The iframe onload event will handle setting loading to false
		}
	}

	function toggleBookmarks() {
		showBookmarks = !showBookmarks;
		showHistory = false;
	}

	function toggleHistory() {
		showHistory = !showHistory;
		showBookmarks = false;
	}

	function addBookmark() {
		const newBookmark = {
			title: currentTab.title,
			url: currentTab.url,
			favicon: '🔖'
		};
		bookmarks = [...bookmarks, newBookmark];
	}

	function getDomainFromUrl(url) {
		try {
			return new URL(url).hostname;
		} catch {
			return url;
		}
	}

	// Sample portfolio sites for demonstration
	const sampleSites = [
		{ name: 'ifsvivek.in', url: 'https://ifsvivek.in', description: 'Personal website of Vivek' },
		{ name: 'ImageCDN', url: 'https://imagecdn.ifsvivek.in', description: 'Image hosting service' },
		{
			name: 'Sugar Tracker',
			url: 'https://sugar.ifsvivek.in',
			description: 'Diabetes management tool'
		}
	];
</script>

<div
	class="flex h-full flex-col {isDarkTheme
		? 'bg-neutral-900/80 text-white'
		: 'bg-white/80 text-neutral-900'} backdrop-blur-xl"
>
	<!-- Tab Bar -->
	<div
		class="flex items-center {isDarkTheme
			? 'border-neutral-700 bg-neutral-800/90'
			: 'border-neutral-300 bg-neutral-100/90'} border-b px-2 py-1"
	>
		<div class="flex flex-1 space-x-1 overflow-x-auto">
			{#each tabs as tab}
				<button
					class="group flex max-w-48 min-w-32 cursor-pointer items-center rounded-lg px-3 py-2 transition-all duration-200
					{tab.active
						? isDarkTheme
							? 'bg-neutral-700 text-white'
							: 'bg-white text-neutral-900'
						: isDarkTheme
							? 'text-neutral-300 hover:bg-neutral-700/50'
							: 'text-neutral-700 hover:bg-neutral-200/50'}"
					onclick={() => switchToTab(tab)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							switchToTab(tab);
						}
					}}
					aria-label="Switch to tab: {tab.title}"
				>
					{#if tab.loading}
						<div
							class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
						></div>
					{:else}
						<div class="mr-2 text-sm">🌐</div>
					{/if}
					<span class="flex-1 truncate text-sm font-medium">{tab.title}</span>
					{#if tabs.length > 1}
						<div
							class="ml-2 cursor-pointer rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/20"
							onclick={(e) => {
								e.stopPropagation();
								closeTab(tab.id);
							}}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									e.stopPropagation();
									closeTab(tab.id);
								}
							}}
							role="button"
							tabindex="0"
							aria-label="Close tab: {tab.title}"
						>
							<svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
								/>
							</svg>
						</div>
					{/if}
				</button>
			{/each}
		</div>
		<button
			onclick={() => createNewTab()}
			class="ml-2 rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme
				? 'hover:bg-neutral-700'
				: 'hover:bg-neutral-200'}"
			title="New Tab"
			aria-label="Open new tab"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
		</button>
	</div>

	<!-- Navigation Bar -->
	<div
		class="flex items-center space-x-2 {isDarkTheme
			? 'border-neutral-700 bg-neutral-800/80'
			: 'border-neutral-200 bg-neutral-50/80'} border-b px-3 py-2"
	>
		<!-- Navigation Buttons -->
		<div class="flex items-center space-x-1">
			<button
				onclick={goBack}
				disabled={!canGoBack}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50
				{isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				title="Go Back"
				aria-label="Go back in history"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
				</svg>
			</button>
			<button
				onclick={goForward}
				disabled={!canGoForward}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50
				{isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				title="Go Forward"
				aria-label="Go forward in history"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
				</svg>
			</button>
			<button
				onclick={refresh}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme
					? 'hover:bg-neutral-700'
					: 'hover:bg-neutral-200'}"
				title="Refresh"
				aria-label="Refresh current page"
			>
				<svg
					class="h-4 w-4 {currentTab.loading ? 'animate-spin' : ''}"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
					/>
				</svg>
			</button>
		</div>

		<!-- Address Bar -->
		<div class="relative flex-1">
			<div class="relative">
				<input
					type="text"
					bind:value={addressBar}
					onkeydown={handleAddressBarKeydown}
					placeholder="Enter portfolio address"
					class="w-full rounded-lg border px-4 py-2 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 focus:outline-none
					{isDarkTheme
						? 'border-neutral-600 bg-neutral-700/80 text-white placeholder-neutral-400'
						: 'border-neutral-300 bg-white/80 text-neutral-900 placeholder-neutral-500'}"
				/>
				<div class="absolute top-1/2 right-3 -translate-y-1/2">
					{#if currentTab.loading}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
						></div>
					{:else}
						<svg class="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
							/>
						</svg>
					{/if}
				</div>
			</div>
		</div>

		<!-- Menu Buttons -->
		<div class="flex items-center space-x-1">
			<button
				onclick={toggleBookmarks}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme
					? 'hover:bg-neutral-700'
					: 'hover:bg-neutral-200'}"
				title="Bookmarks"
				aria-label="Toggle bookmarks"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
				</svg>
			</button>
			<button
				onclick={toggleHistory}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme
					? 'hover:bg-neutral-700'
					: 'hover:bg-neutral-200'}"
				title="History"
				aria-label="Toggle history"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
					/>
				</svg>
			</button>
			<button
				onclick={addBookmark}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme
					? 'hover:bg-neutral-700'
					: 'hover:bg-neutral-200'}"
				title="Add Bookmark"
				aria-label="Add current page to bookmarks"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Bookmarks Bar -->
	{#if showBookmarks}
		<div
			class="flex items-center space-x-2 overflow-x-auto {isDarkTheme
				? 'border-neutral-700 bg-neutral-800/60'
				: 'border-neutral-200 bg-neutral-50/60'} border-b px-3 py-2"
		>
			{#each bookmarks as bookmark}
				<button
					onclick={() => navigateTo(bookmark.url)}
					class="flex items-center space-x-2 rounded-lg px-3 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105
					{isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				>
					<span>{bookmark.favicon}</span>
					<span>{bookmark.title}</span>
				</button>
			{/each}
		</div>
	{/if}

	<!-- History Panel -->
	{#if showHistory}
		<div
			class="flex items-center space-x-2 overflow-x-auto {isDarkTheme
				? 'border-neutral-700 bg-neutral-800/60'
				: 'border-neutral-200 bg-neutral-50/60'} border-b px-3 py-2"
		>
			{#each history.slice(0, 10) as item}
				<button
					onclick={() => navigateTo(item.url)}
					class="flex items-center space-x-2 rounded-lg px-3 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105
					{isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				>
					<span>🌐</span>
					<span>{item.title}</span>
				</button>
			{/each}
		</div>
	{/if}

	<!-- Main Content Area -->
	<div class="relative flex-1 overflow-hidden">
		{#if currentTab.url === 'about:blank' || !currentTab.url || currentTab.url === ''}
			<!-- New Tab Page -->
			<div class="flex h-full flex-col items-center justify-center p-8">
				<div class="mb-8 text-6xl">🌐</div>
				<h2 class="mb-4 text-2xl font-bold">Welcome to Arch Web Browser</h2>
				<p class="mb-8 text-center opacity-70">Browse my portfolio projects</p>

				<div class="w-full max-w-md">
					<input
						type="text"
						placeholder="Enter portfolio address"
						bind:value={addressBar}
						onkeydown={handleAddressBarKeydown}
						class="w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 focus:outline-none
						{isDarkTheme
							? 'border-neutral-600 bg-neutral-700/80 text-white placeholder-neutral-400'
							: 'border-neutral-300 bg-white/80 text-neutral-900 placeholder-neutral-500'}"
					/>
				</div>

				<div class="mt-12 grid w-full max-w-2xl grid-cols-2 gap-4">
					{#each sampleSites as site}
						<button
							onclick={() => navigateTo(site.url)}
							class="rounded-xl border p-6 text-left transition-all duration-200 hover:scale-105
							{isDarkTheme
								? 'border-neutral-600 bg-neutral-800/80 hover:bg-neutral-700/80'
								: 'border-neutral-200 bg-white/80 hover:bg-neutral-50/80'}"
						>
							<h3 class="mb-2 text-lg font-bold">{site.name}</h3>
							<p class="text-sm opacity-70">{site.description}</p>
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Actual Website Content -->
			<div class="relative h-full w-full">
				{#if currentTab.loading}
					<div
						class="absolute inset-0 z-10 flex items-center justify-center {isDarkTheme
							? 'bg-neutral-900/80'
							: 'bg-white/80'} backdrop-blur-sm"
					>
						<div class="text-center">
							<div
								class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
							></div>
							<p class="text-sm opacity-70">Loading {getDomainFromUrl(currentTab.url)}...</p>
						</div>
					</div>
				{/if}

				<iframe
					key={currentTab.url}
					src={currentTab.url}
					title={currentTab.title}
					class="h-full w-full border-0"
					sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
					onload={() => {
						currentTab.loading = false;
						if (!currentTab.title || currentTab.title === 'Loading...') {
							currentTab.title = getDomainFromUrl(currentTab.url);
						}
						tabs = [...tabs];
					}}
					onerror={() => {
						currentTab.loading = false;
						currentTab.title = 'Failed to load';
						tabs = [...tabs];
					}}
				></iframe>
			</div>
		{/if}
	</div>
</div>
