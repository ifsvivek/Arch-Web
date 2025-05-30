<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/components/apps/Settings.svelte -->
<script>
	let activeTab = $state('appearance');
	let settings = $state({
		appearance: {
			theme: 'dark',
			wallpaper: 'arch-blue',
			iconTheme: 'papirus',
			fontSize: 14
		},
		system: {
			autologin: false,
			showNotifications: true,
			soundEnabled: true,
			animationsEnabled: true
		},
		network: {
			wifi: true,
			ethernet: false,
			proxy: false
		}
	});

	const tabs = [
		{ id: 'appearance', name: 'Appearance', icon: 'palette' },
		{ id: 'system', name: 'System', icon: 'cog' },
		{ id: 'network', name: 'Network', icon: 'wifi' },
		{ id: 'about', name: 'About', icon: 'info' }
	];

	const wallpapers = [
		{ id: 'arch-blue', name: 'Arch Blue', preview: '#1e3a8a' },
		{ id: 'arch-purple', name: 'Arch Purple', preview: '#7c3aed' },
		{ id: 'minimal-dark', name: 'Minimal Dark', preview: '#111827' },
		{ id: 'gradient', name: 'Gradient', preview: 'linear-gradient(45deg, #1e3a8a, #7c3aed)' }
	];

	function updateSetting(category, key, value) {
		settings[category][key] = value;
		// Here you would typically save to localStorage or send to a backend
		console.log(`Updated ${category}.${key} to:`, value);
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

<div class="flex h-full bg-white">
	<!-- Sidebar -->
	<div class="w-64 border-r border-gray-200 bg-gray-50">
		<div class="p-4">
			<h1 class="text-lg font-semibold text-gray-800">Settings</h1>
		</div>
		<nav class="space-y-1 px-2">
			{#each tabs as tab}
				<button
					class="flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors {activeTab ===
					tab.id
						? 'bg-blue-100 text-blue-700'
						: 'text-gray-700 hover:bg-gray-100'}"
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
	<div class="flex-1 overflow-y-auto">
		{#if activeTab === 'appearance'}
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold">Appearance</h2>

				<!-- Theme -->
				<div class="mb-6">
					<label class="mb-2 block text-sm font-medium text-gray-700">Theme</label>
					<div class="flex space-x-4">
						<label class="flex items-center">
							<input
								type="radio"
								bind:group={settings.appearance.theme}
								value="light"
								onchange={() => updateSetting('appearance', 'theme', 'light')}
								class="mr-2"
							/>
							Light
						</label>
						<label class="flex items-center">
							<input
								type="radio"
								bind:group={settings.appearance.theme}
								value="dark"
								onchange={() => updateSetting('appearance', 'theme', 'dark')}
								class="mr-2"
							/>
							Dark
						</label>
						<label class="flex items-center">
							<input
								type="radio"
								bind:group={settings.appearance.theme}
								value="auto"
								onchange={() => updateSetting('appearance', 'theme', 'auto')}
								class="mr-2"
							/>
							Auto
						</label>
					</div>
				</div>

				<!-- Wallpaper -->
				<div class="mb-6">
					<label class="mb-3 block text-sm font-medium text-gray-700">Wallpaper</label>
					<div class="grid grid-cols-2 gap-3">
						{#each wallpapers as wallpaper}
							<button
								class="relative rounded-lg border-2 p-3 transition-colors {settings.appearance
									.wallpaper === wallpaper.id
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200 hover:border-gray-300'}"
								onclick={() => updateSetting('appearance', 'wallpaper', wallpaper.id)}
							>
								<div class="mb-2 h-16 w-full rounded" style="background: {wallpaper.preview}"></div>
								<div class="text-center text-sm">{wallpaper.name}</div>
								{#if settings.appearance.wallpaper === wallpaper.id}
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
				</div>

				<!-- Font Size -->
				<div class="mb-6">
					<label class="mb-2 block text-sm font-medium text-gray-700">Font Size</label>
					<input
						type="range"
						min="12"
						max="20"
						bind:value={settings.appearance.fontSize}
						onchange={() => updateSetting('appearance', 'fontSize', settings.appearance.fontSize)}
						class="w-full"
					/>
					<div class="mt-1 text-sm text-gray-600">{settings.appearance.fontSize}px</div>
				</div>
			</div>
		{:else if activeTab === 'system'}
			<div class="p-6">
				<h2 class="mb-6 text-xl font-semibold">System</h2>

				<div class="space-y-4">
					<label class="flex items-center justify-between">
						<span class="text-sm font-medium">Auto Login</span>
						<input
							type="checkbox"
							bind:checked={settings.system.autologin}
							onchange={() => updateSetting('system', 'autologin', settings.system.autologin)}
							class="ml-2"
						/>
					</label>

					<label class="flex items-center justify-between">
						<span class="text-sm font-medium">Show Notifications</span>
						<input
							type="checkbox"
							bind:checked={settings.system.showNotifications}
							onchange={() =>
								updateSetting('system', 'showNotifications', settings.system.showNotifications)}
							class="ml-2"
						/>
					</label>

					<label class="flex items-center justify-between">
						<span class="text-sm font-medium">Sound Enabled</span>
						<input
							type="checkbox"
							bind:checked={settings.system.soundEnabled}
							onchange={() => updateSetting('system', 'soundEnabled', settings.system.soundEnabled)}
							class="ml-2"
						/>
					</label>

					<label class="flex items-center justify-between">
						<span class="text-sm font-medium">Animations Enabled</span>
						<input
							type="checkbox"
							bind:checked={settings.system.animationsEnabled}
							onchange={() =>
								updateSetting('system', 'animationsEnabled', settings.system.animationsEnabled)}
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
						<h3 class="mb-3 text-lg font-medium">Connection Status</h3>
						<div class="rounded-lg border border-green-200 bg-green-50 p-4">
							<div class="flex items-center">
								<div class="mr-3 h-3 w-3 rounded-full bg-green-500"></div>
								<span class="text-green-800">Connected to ArchLinux-WiFi</span>
							</div>
							<div class="mt-1 text-sm text-green-600">IP: 192.168.1.100</div>
						</div>
					</div>

					<div class="space-y-4">
						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">WiFi</span>
							<input
								type="checkbox"
								bind:checked={settings.network.wifi}
								onchange={() => updateSetting('network', 'wifi', settings.network.wifi)}
								class="ml-2"
							/>
						</label>

						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">Ethernet</span>
							<input
								type="checkbox"
								bind:checked={settings.network.ethernet}
								onchange={() => updateSetting('network', 'ethernet', settings.network.ethernet)}
								class="ml-2"
							/>
						</label>

						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">Use Proxy</span>
							<input
								type="checkbox"
								bind:checked={settings.network.proxy}
								onchange={() => updateSetting('network', 'proxy', settings.network.proxy)}
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
					<div class="mb-6 rounded-lg bg-gray-50 p-6">
						<div class="mb-4 flex items-center">
							<div class="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500">
								<svg class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-semibold">Arch Linux Desktop Simulator</h3>
								<p class="text-gray-600">Version 1.0.0</p>
							</div>
						</div>

						<div class="space-y-2 text-sm">
							<div><strong>Built with:</strong> Svelte 5, Tailwind CSS 4</div>
							<div><strong>OS:</strong> Arch Linux x86_64</div>
							<div><strong>Kernel:</strong> 6.1.0-arch1-1</div>
							<div><strong>Desktop:</strong> GNOME 43.0</div>
						</div>
					</div>

					<div class="prose text-sm text-gray-600">
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
