<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';
	
	let activeTab = $state('appearance');

	// Theme-based styling
	const isDarkTheme = $derived(desktopState.currentTheme === 'dark' || 
		(desktopState.currentTheme === 'auto' && 
		typeof window !== 'undefined' && 
		window.matchMedia('(prefers-color-scheme: dark)').matches));

	const containerClasses = $derived(
		`flex h-full ${
			isDarkTheme 
				? 'text-white' 
				: 'text-gray-900'
		}`
	);

	const sidebarClasses = $derived(
		`w-64 border-r ${
			isDarkTheme 
				? 'border-gray-600/30' 
				: 'border-gray-200/30'
		}`
	);

	const titleClasses = $derived(
		`text-lg font-semibold ${
			isDarkTheme ? 'text-white' : 'text-gray-800'
		}`
	);

	const contentClasses = $derived(
		`flex-1 overflow-y-auto ${
			isDarkTheme 
				? 'bg-transparent text-white' 
				: 'bg-transparent text-gray-900'
		}`
	);

	function getTabClasses(isActive) {
		return `flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
			isActive
				? (isDarkTheme ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100/30 text-blue-700')
				: (isDarkTheme ? 'text-gray-300 hover:bg-gray-700/20' : 'text-gray-700 hover:bg-gray-100/20')
		}`;
	}

	const tabs = [
		{ id: 'appearance', name: 'Appearance', icon: 'palette' },
		{ id: 'system', name: 'System', icon: 'cog' },
		{ id: 'network', name: 'Network', icon: 'wifi' },
		{ id: 'about', name: 'About', icon: 'info' }
	];

	const wallpapers = [
		{ id: 'arch-nz', name: 'Arch NZ', preview: "background-image: url('/arch_wallpaper.png'); background-size: cover; background-position: center; background-repeat: no-repeat" },
		{ id: 'arch-blue', name: 'Arch Blue', preview: 'background: #1e3a8a' },
		{ id: 'arch-purple', name: 'Arch Purple', preview: 'background: #7c3aed' },
		{ id: 'minimal-dark', name: 'Minimal Dark', preview: 'background: #111827' },
		{ id: 'gradient', name: 'Gradient', preview: 'background: linear-gradient(45deg, #1e3a8a, #7c3aed)' }
	];

	// Reactive effects to auto-save settings when they change
	let previousTheme = $state(desktopState.settings.appearance.theme);
	let previousFontSize = $state(desktopState.settings.appearance.fontSize);
	let previousAutologin = $state(desktopState.settings.system.autologin);
	let previousNotifications = $state(desktopState.settings.system.showNotifications);
	let previousSound = $state(desktopState.settings.system.soundEnabled);
	let previousAnimations = $state(desktopState.settings.system.animationsEnabled);
	let previousWifi = $state(desktopState.settings.network.wifi);
	let previousEthernet = $state(desktopState.settings.network.ethernet);
	let previousProxy = $state(desktopState.settings.network.proxy);

	$effect(() => {
		if (desktopState.settings.appearance.theme !== previousTheme) {
			previousTheme = desktopState.settings.appearance.theme;
			desktopState.setTheme(desktopState.settings.appearance.theme);
		}
	});

	$effect(() => {
		if (desktopState.settings.appearance.fontSize !== previousFontSize) {
			previousFontSize = desktopState.settings.appearance.fontSize;
			desktopState.updateSetting('appearance', 'fontSize', desktopState.settings.appearance.fontSize);
		}
	});

	$effect(() => {
		if (desktopState.settings.system.autologin !== previousAutologin) {
			previousAutologin = desktopState.settings.system.autologin;
			desktopState.updateSetting('system', 'autologin', desktopState.settings.system.autologin);
		}
	});

	$effect(() => {
		if (desktopState.settings.system.showNotifications !== previousNotifications) {
			previousNotifications = desktopState.settings.system.showNotifications;
			desktopState.updateSetting('system', 'showNotifications', desktopState.settings.system.showNotifications);
		}
	});

	$effect(() => {
		if (desktopState.settings.system.soundEnabled !== previousSound) {
			previousSound = desktopState.settings.system.soundEnabled;
			desktopState.updateSetting('system', 'soundEnabled', desktopState.settings.system.soundEnabled);
		}
	});

	$effect(() => {
		if (desktopState.settings.system.animationsEnabled !== previousAnimations) {
			previousAnimations = desktopState.settings.system.animationsEnabled;
			desktopState.updateSetting('system', 'animationsEnabled', desktopState.settings.system.animationsEnabled);
		}
	});

	$effect(() => {
		if (desktopState.settings.network.wifi !== previousWifi) {
			previousWifi = desktopState.settings.network.wifi;
			desktopState.updateSetting('network', 'wifi', desktopState.settings.network.wifi);
		}
	});

	$effect(() => {
		if (desktopState.settings.network.ethernet !== previousEthernet) {
			previousEthernet = desktopState.settings.network.ethernet;
			desktopState.updateSetting('network', 'ethernet', desktopState.settings.network.ethernet);
		}
	});

	$effect(() => {
		if (desktopState.settings.network.proxy !== previousProxy) {
			previousProxy = desktopState.settings.network.proxy;
			desktopState.updateSetting('network', 'proxy', desktopState.settings.network.proxy);
		}
	});

	function updateSetting(category, key, value) {
		desktopState.updateSetting(category, key, value);
	}

	function getTabIcon(iconType) {
		const icons = {
			palette:
				'<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5S18.33 12 17.5 12z"/>',
			cog: '<path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>',
			wifi: '<path d="M1 9l2 2c2.88-2.88 6.12-2.88 9 0l2-2c-3.78-3.78-8.22-3.78-12 0zM9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zM5 13l2 2c1.23-1.23 2.77-1.23 4 0l2-2c-2.11-2.11-4.89-2.11-7 0z"/>',
			info: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>'
		};
		return icons[iconType] || '';
	}
</script>

<div class={containerClasses}>
	<!-- Sidebar -->
	<div class={sidebarClasses}>
		<div class="p-4">
			<h1 class={titleClasses}>Settings</h1>
		</div>
		<nav class="space-y-1 px-2">
			{#each tabs as tab}
				<button
					class={getTabClasses(activeTab === tab.id)}
					onclick={() => (activeTab = tab.id)}
				>
					<svg class="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
						{@html getTabIcon(tab.icon)}
					</svg>
					{tab.name}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Main Content -->
	<div class={contentClasses}>
		{#if activeTab === 'appearance'}
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold">Appearance</h2>

				<!-- Theme -->
				<div class="mb-6">
					<fieldset>
						<legend class={`mb-2 block text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Theme</legend>
						<div class="flex space-x-4">
							<label class="flex items-center">
								<input
									type="radio"
									bind:group={desktopState.settings.appearance.theme}
									value="light"
									class="mr-2"
								/>
								Light
							</label>
							<label class="flex items-center">
								<input
									type="radio"
									bind:group={desktopState.settings.appearance.theme}
									value="dark"
									class="mr-2"
								/>
								Dark
							</label>
							<label class="flex items-center">
								<input
									type="radio"
									bind:group={desktopState.settings.appearance.theme}
									value="auto"
									class="mr-2"
								/>
								Auto
							</label>
						</div>
					</fieldset>
				</div>

				<!-- Wallpaper -->
				<div class="mb-6">
					<fieldset>
						<legend class={`mb-3 block text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Wallpaper</legend>
						<div class="grid grid-cols-2 gap-3">
							{#each wallpapers as wallpaper}
								<button
									class="relative rounded-lg border-2 p-3 transition-colors {desktopState.settings.appearance
										.wallpaper === wallpaper.id
										? (isDarkTheme ? 'border-blue-400 bg-blue-500/10' : 'border-blue-500 bg-blue-50/30')
										: (isDarkTheme ? 'border-gray-600 hover:border-gray-500 bg-gray-800/10' : 'border-gray-300 hover:border-gray-400 bg-white/10')}"
									onclick={() => {
										console.log('Wallpaper clicked:', wallpaper.id);
										desktopState.setWallpaper(wallpaper.id);
										console.log('After setWallpaper - currentWallpaper:', desktopState.currentWallpaper);
									}}
								>
									<div class="mb-2 h-16 w-full rounded" style="{wallpaper.preview}"></div>
									<div class="text-center text-sm">{wallpaper.name}</div>
									{#if desktopState.settings.appearance.wallpaper === wallpaper.id}
										<div
											class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500"
										>
											<svg class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
												<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
											</svg>
										</div>
									{/if}
								</button>
							{/each}
						</div>
					</fieldset>
				</div>

				<!-- Font Size -->
				<div class="mb-6">
					<label for="fontSize" class={`mb-2 block text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Font Size</label>
					<input
						id="fontSize"
						type="range"
						min="12"
						max="20"
						bind:value={desktopState.settings.appearance.fontSize}
						class="w-full"
					/>
					<div class={`mt-1 text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{desktopState.settings.appearance.fontSize}px</div>
				</div>
			</div>
		{:else if activeTab === 'system'}
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold">System</h2>

				<div class="space-y-4">
					<label class={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkTheme ? 'border-gray-600/30 bg-gray-800/10 hover:bg-gray-700/20' : 'border-gray-200/50 bg-white/20 hover:bg-white/30'}`}>
						<span class="text-sm font-medium">Auto Login</span>
						<input
							type="checkbox"
							bind:checked={desktopState.settings.system.autologin}
							class="ml-2"
						/>
					</label>

					<label class={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkTheme ? 'border-gray-600/30 bg-gray-800/10 hover:bg-gray-700/20' : 'border-gray-200/50 bg-white/20 hover:bg-white/30'}`}>
						<span class="text-sm font-medium">Show Notifications</span>
						<input
							type="checkbox"
							bind:checked={desktopState.settings.system.showNotifications}
							class="ml-2"
						/>
					</label>

					<label class={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkTheme ? 'border-gray-600/30 bg-gray-800/10 hover:bg-gray-700/20' : 'border-gray-200/50 bg-white/20 hover:bg-white/30'}`}>
						<span class="text-sm font-medium">Sound Enabled</span>
						<input
							type="checkbox"
							bind:checked={desktopState.settings.system.soundEnabled}
							class="ml-2"
						/>
					</label>

					<label class={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkTheme ? 'border-gray-600/30 bg-gray-800/10 hover:bg-gray-700/20' : 'border-gray-200/50 bg-white/20 hover:bg-white/30'}`}>
						<span class="text-sm font-medium">Animations Enabled</span>
						<input
							type="checkbox"
							bind:checked={desktopState.settings.system.animationsEnabled}
							class="ml-2"
						/>
					</label>
				</div>
			</div>
		{:else if activeTab === 'network'}
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold">Network</h2>

				<div class="space-y-6">
					<div>
						<h3 class={`mb-3 text-lg font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Connection Status</h3>
						<div class={`rounded-lg border p-4 ${isDarkTheme ? 'border-green-500/50 bg-green-900/20' : 'border-green-200 bg-green-50/70'}`}>
							<div class="flex items-center">
								<div class="mr-3 h-3 w-3 rounded-full bg-green-500"></div>
								<span class={isDarkTheme ? 'text-green-300' : 'text-green-800'}>Connected to ArchLinux-WiFi</span>
							</div>
							<div class={`mt-1 text-sm ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>IP: 192.168.1.100</div>
						</div>
					</div>

					<div class="space-y-4">
						<label class={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkTheme ? 'border-gray-600/30 bg-gray-800/10 hover:bg-gray-700/20' : 'border-gray-200/50 bg-white/20 hover:bg-white/30'}`}>
							<span class="text-sm font-medium">WiFi</span>
							<input
								type="checkbox"
								bind:checked={desktopState.settings.network.wifi}
								class="ml-2"
							/>
						</label>

						<label class={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkTheme ? 'border-gray-600/30 bg-gray-800/10 hover:bg-gray-700/20' : 'border-gray-200/50 bg-white/20 hover:bg-white/30'}`}>
							<span class="text-sm font-medium">Ethernet</span>
							<input
								type="checkbox"
								bind:checked={desktopState.settings.network.ethernet}
								class="ml-2"
							/>
						</label>

						<label class={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkTheme ? 'border-gray-600/30 bg-gray-800/10 hover:bg-gray-700/20' : 'border-gray-200/50 bg-white/20 hover:bg-white/30'}`}>
							<span class="text-sm font-medium">Use Proxy</span>
							<input
								type="checkbox"
								bind:checked={desktopState.settings.network.proxy}
								class="ml-2"
							/>
						</label>
					</div>
				</div>
			</div>
		{:else if activeTab === 'about'}
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold">About</h2>

				<div class="max-w-2xl">
					<div class={`mb-6 rounded-lg p-6 ${isDarkTheme ? 'bg-gray-800/30 border border-gray-600/30' : 'bg-gray-50/30 border border-gray-200/30'}`}>
						<div class="mb-4 flex items-center">
							<div class="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500">
								<svg class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" />
								</svg>
							</div>
							<div>
								<h3 class={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Arch Linux Desktop Simulator</h3>
								<p class={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>Version 1.0.0</p>
							</div>
						</div>

						<div class={`space-y-2 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
							<div><strong>Built with:</strong> Svelte 5, Tailwind CSS 4</div>
							<div><strong>OS:</strong> Arch Linux x86_64</div>
							<div><strong>Kernel:</strong> 6.1.0-arch1-1</div>
							<div><strong>Desktop:</strong> GNOME 43.0</div>
						</div>
					</div>

					<div class={`prose text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
						<p>
							This is a web-based desktop simulator that replicates the look and feel of a GNOME
							desktop environment with an Arch Linux theme. It demonstrates modern web technologies
							and component-based architecture.
						</p>

						<p class="mt-4">
							<strong>Features:</strong><br />
							• Interactive window management<br />
							• Functional mini-applications<br />
							• Real-time system monitoring<br />
							• Customizable appearance<br />
							• File system exploration
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
