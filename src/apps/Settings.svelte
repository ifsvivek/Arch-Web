<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/apps/Settings.svelte -->
<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let activeSection = $state('appearance');
	let settings = $state({
		appearance: {
			theme: 'dark',
			accentColor: '#3b82f6',
			fontSize: 14,
			transparency: 80,
			animations: true,
			backgroundBlur: true
		},
		system: {
			language: 'en-US',
			timezone: 'America/New_York',
			dateFormat: 'MM/DD/YYYY',
			timeFormat: '12h',
			notifications: true,
			sounds: true,
			autoSave: true
		},
		privacy: {
			analytics: false,
			crashReports: true,
			locationServices: false,
			cookies: 'essential',
			dataCollection: false
		},
		network: {
			wifi: true,
			bluetooth: true,
			hotspot: false,
			vpn: false,
			proxy: '',
			dns: 'auto'
		},
		applications: {
			defaultBrowser: 'built-in',
			defaultEditor: 'text-editor',
			defaultTerminal: 'terminal',
			autoUpdate: true,
			backgroundApps: true
		},
		accessibility: {
			highContrast: false,
			largeText: false,
			screenReader: false,
			keyboardNavigation: true,
			reducedMotion: false,
			colorBlindMode: 'none'
		}
	});

	const sections = [
		{ id: 'appearance', name: 'Appearance', icon: '🎨' },
		{ id: 'system', name: 'System', icon: '⚙️' },
		{ id: 'privacy', name: 'Privacy', icon: '🔒' },
		{ id: 'network', name: 'Network', icon: '🌐' },
		{ id: 'applications', name: 'Applications', icon: '📱' },
		{ id: 'accessibility', name: 'Accessibility', icon: '♿' }
	];

	const accentColors = [
		{ name: 'Blue', value: '#3b82f6' },
		{ name: 'Purple', value: '#8b5cf6' },
		{ name: 'Green', value: '#10b981' },
		{ name: 'Orange', value: '#f59e0b' },
		{ name: 'Red', value: '#ef4444' },
		{ name: 'Pink', value: '#ec4899' }
	];

	function updateSetting(section, key, value) {
		settings[section][key] = value;
		
		// Apply appearance changes immediately
		if (section === 'appearance') {
			applyAppearanceSettings();
		}
	}

	function applyAppearanceSettings() {
		// Update theme
		desktopState.currentTheme = settings.appearance.theme;
		
		// Apply other appearance settings
		document.documentElement.style.setProperty('--accent-color', settings.appearance.accentColor);
		document.documentElement.style.setProperty('--font-size', `${settings.appearance.fontSize}px`);
		document.documentElement.style.setProperty('--transparency', `${settings.appearance.transparency}%`);
	}

	function resetSection() {
		if (confirm(`Reset all ${sections.find(s => s.id === activeSection)?.name} settings to default?`)) {
			// Reset logic would go here
			console.log(`Reset ${activeSection} settings`);
		}
	}

	function exportSettings() {
		const dataStr = JSON.stringify(settings, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'desktop-settings.json';
		link.click();
		URL.revokeObjectURL(url);
	}

	function importSettings() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = (e) => {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const importedSettings = JSON.parse(e.target.result);
						settings = { ...settings, ...importedSettings };
						applyAppearanceSettings();
					} catch (err) {
						alert('Invalid settings file');
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}

	// Apply settings on mount
	$effect(() => {
		applyAppearanceSettings();
	});

	const isDark = $derived(desktopState.currentTheme === 'dark');

	const containerClasses = $derived(
		`h-full flex backdrop-blur-xl border ${
			isDark 
				? 'bg-neutral-900/20 border-white/10 text-white' 
				: 'bg-white/20 border-neutral-200/30 text-neutral-900'
		}`
	);

	const sidebarClasses = $derived(
		`w-64 border-r ${
			isDark 
				? 'bg-neutral-800/50 border-white/10' 
				: 'bg-neutral-50/50 border-neutral-200/50'
		}`
	);

	const sectionButtonClasses = $derived(
		`w-full p-3 text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
			isDark 
				? 'hover:bg-neutral-700/50' 
				: 'hover:bg-neutral-100/50'
		}`
	);

	const activeSectionClasses = $derived(
		`w-full p-3 text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm border-r-2 ${
			isDark 
				? 'bg-neutral-700/70 border-blue-400 text-blue-400' 
				: 'bg-neutral-100/70 border-blue-500 text-blue-600'
		}`
	);

	const inputClasses = $derived(
		`px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
			isDark 
				? 'bg-neutral-700/50 border-white/10 text-white' 
				: 'bg-white/50 border-neutral-200/30 text-neutral-900'
		}`
	);

	const buttonClasses = $derived(
		`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
			isDark 
				? 'bg-neutral-700/50 hover:bg-neutral-600/70 border-white/10 text-white' 
				: 'bg-white/50 hover:bg-neutral-100/70 border-neutral-200/30 text-neutral-900'
		}`
	);

	const primaryButtonClasses = $derived(
		`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
			isDark 
				? 'bg-blue-600/70 hover:bg-blue-500/80 border-blue-400/30 text-white' 
				: 'bg-blue-500/70 hover:bg-blue-600/80 border-blue-300/40 text-white'
		}`
	);
</script>

<div class={containerClasses}>
	<!-- Sidebar -->
	<div class={sidebarClasses}>
		<div class="p-4 border-b {isDark ? 'border-white/10' : 'border-neutral-200/50'}">
			<h2 class="text-lg font-semibold">Settings</h2>
		</div>
		
		<nav class="p-2">
			{#each sections as section}
				<button 
					class={section.id === activeSection ? activeSectionClasses : sectionButtonClasses}
					onclick={() => activeSection = section.id}
				>
					<div class="flex items-center space-x-3">
						<span class="text-xl">{section.icon}</span>
						<span class="font-medium">{section.name}</span>
					</div>
				</button>
			{/each}
		</nav>

		<div class="absolute bottom-4 left-4 right-4 space-y-2">
			<button class={buttonClasses} onclick={exportSettings}>Export Settings</button>
			<button class={buttonClasses} onclick={importSettings}>Import Settings</button>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 overflow-auto">
		<div class="p-6">
			<!-- Appearance Settings -->
			{#if activeSection === 'appearance'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Appearance</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>

					<!-- Theme -->
					<div class="space-y-3">
						<label class="text-sm font-medium">Theme</label>
						<div class="flex space-x-3">
							{#each ['light', 'dark', 'auto'] as theme}
								<button 
									class="px-4 py-2 rounded-lg font-medium transition-all duration-200 border {
										settings.appearance.theme === theme 
											? (isDark ? 'bg-blue-600/70 border-blue-400/50 text-white' : 'bg-blue-500/70 border-blue-300/50 text-white')
											: (isDark ? 'bg-neutral-700/50 border-white/10 hover:bg-neutral-600/70' : 'bg-white/50 border-neutral-200/30 hover:bg-neutral-100/70')
									}"
									onclick={() => updateSetting('appearance', 'theme', theme)}
								>
									{theme.charAt(0).toUpperCase() + theme.slice(1)}
								</button>
							{/each}
						</div>
					</div>

					<!-- Accent Color -->
					<div class="space-y-3">
						<label class="text-sm font-medium">Accent Color</label>
						<div class="flex space-x-3">
							{#each accentColors as color}
								<button 
									class="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 {
										settings.appearance.accentColor === color.value 
											? 'border-white shadow-lg' 
											: 'border-transparent'
									}"
									style="background-color: {color.value}"
									onclick={() => updateSetting('appearance', 'accentColor', color.value)}
									title={color.name}
								></button>
							{/each}
						</div>
					</div>

					<!-- Font Size -->
					<div class="space-y-3">
						<label class="text-sm font-medium">Font Size</label>
						<div class="flex items-center space-x-4">
							<input 
								type="range" 
								min="12" 
								max="20" 
								bind:value={settings.appearance.fontSize}
								onchange={() => updateSetting('appearance', 'fontSize', settings.appearance.fontSize)}
								class="flex-1"
							/>
							<span class="text-sm w-12">{settings.appearance.fontSize}px</span>
						</div>
					</div>

					<!-- Transparency -->
					<div class="space-y-3">
						<label class="text-sm font-medium">Window Transparency</label>
						<div class="flex items-center space-x-4">
							<input 
								type="range" 
								min="50" 
								max="100" 
								bind:value={settings.appearance.transparency}
								onchange={() => updateSetting('appearance', 'transparency', settings.appearance.transparency)}
								class="flex-1"
							/>
							<span class="text-sm w-12">{settings.appearance.transparency}%</span>
						</div>
					</div>

					<!-- Toggles -->
					<div class="space-y-4">
						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">Animations</span>
							<input 
								type="checkbox" 
								bind:checked={settings.appearance.animations}
								onchange={() => updateSetting('appearance', 'animations', settings.appearance.animations)}
								class="rounded"
							/>
						</label>
						
						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">Background Blur</span>
							<input 
								type="checkbox" 
								bind:checked={settings.appearance.backgroundBlur}
								onchange={() => updateSetting('appearance', 'backgroundBlur', settings.appearance.backgroundBlur)}
								class="rounded"
							/>
						</label>
					</div>
				</div>
			{/if}

			<!-- System Settings -->
			{#if activeSection === 'system'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">System</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-3">
							<label class="text-sm font-medium">Language</label>
							<select bind:value={settings.system.language} class={inputClasses}>
								<option value="en-US">English (US)</option>
								<option value="en-GB">English (UK)</option>
								<option value="es-ES">Español</option>
								<option value="fr-FR">Français</option>
								<option value="de-DE">Deutsch</option>
							</select>
						</div>

						<div class="space-y-3">
							<label class="text-sm font-medium">Timezone</label>
							<select bind:value={settings.system.timezone} class={inputClasses}>
								<option value="America/New_York">Eastern Time</option>
								<option value="America/Chicago">Central Time</option>
								<option value="America/Denver">Mountain Time</option>
								<option value="America/Los_Angeles">Pacific Time</option>
								<option value="UTC">UTC</option>
							</select>
						</div>

						<div class="space-y-3">
							<label class="text-sm font-medium">Date Format</label>
							<select bind:value={settings.system.dateFormat} class={inputClasses}>
								<option value="MM/DD/YYYY">MM/DD/YYYY</option>
								<option value="DD/MM/YYYY">DD/MM/YYYY</option>
								<option value="YYYY-MM-DD">YYYY-MM-DD</option>
							</select>
						</div>

						<div class="space-y-3">
							<label class="text-sm font-medium">Time Format</label>
							<select bind:value={settings.system.timeFormat} class={inputClasses}>
								<option value="12h">12 Hour</option>
								<option value="24h">24 Hour</option>
							</select>
						</div>
					</div>

					<div class="space-y-4">
						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">Notifications</span>
							<input type="checkbox" bind:checked={settings.system.notifications} class="rounded" />
						</label>
						
						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">System Sounds</span>
							<input type="checkbox" bind:checked={settings.system.sounds} class="rounded" />
						</label>

						<label class="flex items-center justify-between">
							<span class="text-sm font-medium">Auto Save</span>
							<input type="checkbox" bind:checked={settings.system.autoSave} class="rounded" />
						</label>
					</div>
				</div>
			{/if}

			<!-- Privacy Settings -->
			{#if activeSection === 'privacy'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Privacy & Security</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>

					<div class="space-y-4">
						<label class="flex items-center justify-between">
							<div>
								<span class="text-sm font-medium">Analytics</span>
								<p class="text-xs opacity-60">Help improve the system by sharing usage data</p>
							</div>
							<input type="checkbox" bind:checked={settings.privacy.analytics} class="rounded" />
						</label>
						
						<label class="flex items-center justify-between">
							<div>
								<span class="text-sm font-medium">Crash Reports</span>
								<p class="text-xs opacity-60">Automatically send crash reports to developers</p>
							</div>
							<input type="checkbox" bind:checked={settings.privacy.crashReports} class="rounded" />
						</label>

						<label class="flex items-center justify-between">
							<div>
								<span class="text-sm font-medium">Location Services</span>
								<p class="text-xs opacity-60">Allow apps to access your location</p>
							</div>
							<input type="checkbox" bind:checked={settings.privacy.locationServices} class="rounded" />
						</label>

						<div class="space-y-3">
							<label class="text-sm font-medium">Cookie Policy</label>
							<select bind:value={settings.privacy.cookies} class={inputClasses}>
								<option value="all">Accept All Cookies</option>
								<option value="essential">Essential Only</option>
								<option value="none">Block All Cookies</option>
							</select>
						</div>

						<label class="flex items-center justify-between">
							<div>
								<span class="text-sm font-medium">Data Collection</span>
								<p class="text-xs opacity-60">Allow collection of usage patterns for personalization</p>
							</div>
							<input type="checkbox" bind:checked={settings.privacy.dataCollection} class="rounded" />
						</label>
					</div>
				</div>
			{/if}

			<!-- Add other sections similarly... -->
			{#if activeSection === 'network'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Network & Connectivity</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>
					<p class="text-sm opacity-60">Network settings and connectivity options.</p>
				</div>
			{/if}

			{#if activeSection === 'applications'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Applications</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>
					<p class="text-sm opacity-60">Default applications and app management.</p>
				</div>
			{/if}

			{#if activeSection === 'accessibility'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Accessibility</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>
					<p class="text-sm opacity-60">Accessibility features and options.</p>
				</div>
			{/if}
		</div>
	</div>
</div>