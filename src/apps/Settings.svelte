<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/apps/Settings.svelte -->
<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let activeSection = $state('appearance');
	let settings = $state({
		appearance: {
			theme: 'dark',
			wallpaper: 'arch-nz',
			accentColor: '#3b82f6',
			fontSize: 14,
			transparency: 80,
			animations: true,
			backgroundBlur: true,
			iconTheme: 'default',
			cursorTheme: 'default'
		},
		system: {
			language: 'en-US',
			timezone: 'America/New_York',
			dateFormat: 'MM/DD/YYYY',
			timeFormat: '12h',
			notifications: true,
			sounds: true,
			autoSave: true,
			powerManagement: 'balanced',
			bootTimeout: 5,
			autoLogin: false
		},
		privacy: {
			analytics: false,
			crashReports: true,
			locationServices: false,
			cookies: 'essential',
			dataCollection: false,
			telemetry: false,
			historyClear: 'never',
			trackingProtection: true
		},
		network: {
			wifi: true,
			bluetooth: true,
			hotspot: false,
			vpn: false,
			proxy: '',
			dns: 'auto',
			firewall: true,
			networkDiscovery: true
		},
		applications: {
			defaultBrowser: 'built-in',
			defaultEditor: 'text-editor',
			defaultTerminal: 'terminal',
			defaultImageViewer: 'image-viewer',
			defaultMusicPlayer: 'music-player',
			autoUpdate: true,
			backgroundApps: true,
			startupApps: []
		},
		accessibility: {
			highContrast: false,
			largeText: false,
			screenReader: false,
			keyboardNavigation: true,
			reducedMotion: false,
			colorBlindMode: 'none',
			mouseKeys: false,
			stickyKeys: false,
			slowKeys: false
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
		{ name: 'Pink', value: '#ec4899' },
		{ name: 'Cyan', value: '#06b6d4' },
		{ name: 'Indigo', value: '#6366f1' }
	];

	const wallpapers = [
		{ id: 'arch-nz', name: 'Arch New Zealand', preview: '/arch_wallpaper.png' },
		{ id: 'arch-blue', name: 'Arch Blue', preview: '', color: '#1e3a8a' },
		{ id: 'arch-purple', name: 'Arch Purple', preview: '', color: '#7c3aed' },
		{ id: 'minimal-dark', name: 'Minimal Dark', preview: '', color: '#111827' },
		{ id: 'gradient', name: 'Gradient', preview: '', gradient: 'linear-gradient(45deg, #1e3a8a, #7c3aed)' },
		{ id: 'forest', name: 'Forest', preview: '', color: '#065f46' },
		{ id: 'sunset', name: 'Sunset', preview: '', gradient: 'linear-gradient(45deg, #f59e0b, #ef4444)' }
	];

	const iconThemes = [
		{ id: 'default', name: 'Default' },
		{ id: 'papirus', name: 'Papirus' },
		{ id: 'breeze', name: 'Breeze' },
		{ id: 'numix', name: 'Numix' }
	];

	const cursorThemes = [
		{ id: 'default', name: 'Default' },
		{ id: 'adwaita', name: 'Adwaita' },
		{ id: 'breeze', name: 'Breeze' },
		{ id: 'oxygen', name: 'Oxygen' }
	];

	function updateSetting(section, key, value) {
		settings[section][key] = value;
		
		// Apply appearance changes immediately
		if (section === 'appearance') {
			applyAppearanceSettings();
			
			// Update wallpaper through desktop state
			if (key === 'wallpaper') {
				console.log('Settings: Calling setWallpaper with', value);
				desktopState.setWallpaper(value);
			}
		}
		
		// Update desktop state for other settings
		if (section === 'appearance' && key === 'theme') {
			desktopState.setTheme(value);
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
						<h5 class="text-sm font-medium">Theme</h5>
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

					<!-- Wallpaper -->
					<div class="space-y-3">
						<h5 class="text-sm font-medium">Wallpaper</h5>
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
							{#each wallpapers as wallpaper}
								<button 
									class="relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 {
										settings.appearance.wallpaper === wallpaper.id 
											? 'border-blue-500 shadow-lg' 
											: (isDark ? 'border-white/20' : 'border-neutral-300')
									}"
									onclick={() => updateSetting('appearance', 'wallpaper', wallpaper.id)}
								>
									{#if wallpaper.preview}
										<img src={wallpaper.preview} alt={wallpaper.name} class="w-full h-full object-cover" />
									{:else if wallpaper.gradient}
										<div class="w-full h-full" style="background: {wallpaper.gradient}"></div>
									{:else}
										<div class="w-full h-full" style="background-color: {wallpaper.color}"></div>
									{/if}
									<div class="absolute inset-0 bg-black/40 flex items-end p-2">
										<span class="text-white text-xs font-medium">{wallpaper.name}</span>
									</div>
									{#if settings.appearance.wallpaper === wallpaper.id}
										<div class="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
											<span class="text-white text-xs">✓</span>
										</div>
									{/if}
								</button>
							{/each}
						</div>
					</div>

					<!-- Accent Color -->
					<div class="space-y-3">
						<h5 class="text-sm font-medium">Accent Color</h5>
						<div class="flex space-x-3 flex-wrap">
							{#each accentColors as color}
								<button 
									class="w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 {
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

					<!-- Icon Theme -->
					<div class="space-y-3">
						<label for="iconTheme" class="text-sm font-medium">Icon Theme</label>
						<select id="iconTheme" bind:value={settings.appearance.iconTheme} 
								onchange={() => updateSetting('appearance', 'iconTheme', settings.appearance.iconTheme)}
								class={inputClasses}>
							{#each iconThemes as theme}
								<option value={theme.id}>{theme.name}</option>
							{/each}
						</select>
					</div>

					<!-- Cursor Theme -->
					<div class="space-y-3">
						<label for="cursorTheme" class="text-sm font-medium">Cursor Theme</label>
						<select id="cursorTheme" bind:value={settings.appearance.cursorTheme} 
								onchange={() => updateSetting('appearance', 'cursorTheme', settings.appearance.cursorTheme)}
								class={inputClasses}>
							{#each cursorThemes as theme}
								<option value={theme.id}>{theme.name}</option>
							{/each}
						</select>
					</div>

					<!-- Font Size -->
					<div class="space-y-3">
						<label for="fontSize" class="text-sm font-medium">Font Size</label>
						<div class="flex items-center space-x-4">
							<input 
								id="fontSize"
								type="range" 
								min="10" 
								max="24" 
								bind:value={settings.appearance.fontSize}
								onchange={() => updateSetting('appearance', 'fontSize', settings.appearance.fontSize)}
								class="flex-1"
							/>
							<span class="text-sm w-12">{settings.appearance.fontSize}px</span>
						</div>
					</div>

					<!-- Transparency -->
					<div class="space-y-3">
						<label for="transparency" class="text-sm font-medium">Window Transparency</label>
						<div class="flex items-center space-x-4">
							<input 
								id="transparency"
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
							<div>
								<span class="text-sm font-medium">Animations</span>
								<p class="text-xs opacity-60">Enable smooth animations and transitions</p>
							</div>
							<input 
								type="checkbox" 
								bind:checked={settings.appearance.animations}
								onchange={() => updateSetting('appearance', 'animations', settings.appearance.animations)}
								class="rounded"
							/>
						</label>
						
						<label class="flex items-center justify-between">
							<div>
								<span class="text-sm font-medium">Background Blur</span>
								<p class="text-xs opacity-60">Add blur effect to window backgrounds</p>
							</div>
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

					<!-- Language & Region -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Language & Region</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-3">
								<label for="language" class="text-sm font-medium">Language</label>
								<select id="language" bind:value={settings.system.language} 
										onchange={() => updateSetting('system', 'language', settings.system.language)}
										class={inputClasses}>
									<option value="en-US">English (US)</option>
									<option value="en-GB">English (UK)</option>
									<option value="es-ES">Español</option>
									<option value="fr-FR">Français</option>
									<option value="de-DE">Deutsch</option>
									<option value="it-IT">Italiano</option>
									<option value="pt-BR">Português (Brasil)</option>
									<option value="ru-RU">Русский</option>
									<option value="zh-CN">中文 (简体)</option>
									<option value="ja-JP">日本語</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="timezone" class="text-sm font-medium">Timezone</label>
								<select id="timezone" bind:value={settings.system.timezone} 
										onchange={() => updateSetting('system', 'timezone', settings.system.timezone)}
										class={inputClasses}>
									<option value="America/New_York">Eastern Time (UTC-5)</option>
									<option value="America/Chicago">Central Time (UTC-6)</option>
									<option value="America/Denver">Mountain Time (UTC-7)</option>
									<option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
									<option value="UTC">UTC</option>
									<option value="Europe/London">London (UTC+0)</option>
									<option value="Europe/Paris">Paris (UTC+1)</option>
									<option value="Asia/Tokyo">Tokyo (UTC+9)</option>
									<option value="Australia/Sydney">Sydney (UTC+10)</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="dateFormat" class="text-sm font-medium">Date Format</label>
								<select id="dateFormat" bind:value={settings.system.dateFormat} 
										onchange={() => updateSetting('system', 'dateFormat', settings.system.dateFormat)}
										class={inputClasses}>
									<option value="MM/DD/YYYY">MM/DD/YYYY (American)</option>
									<option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
									<option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
									<option value="DD MMM YYYY">DD MMM YYYY</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="timeFormat" class="text-sm font-medium">Time Format</label>
								<select id="timeFormat" bind:value={settings.system.timeFormat} 
										onchange={() => updateSetting('system', 'timeFormat', settings.system.timeFormat)}
										class={inputClasses}>
									<option value="12h">12 Hour (AM/PM)</option>
									<option value="24h">24 Hour</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Power Management -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Power Management</h4>
						<div class="space-y-3">
							<h5 class="text-sm font-medium">Power Profile</h5>
							<div class="flex space-x-3">
								{#each ['power-saver', 'balanced', 'performance'] as profile}
									<button 
										class="px-4 py-2 rounded-lg font-medium transition-all duration-200 border {
											settings.system.powerManagement === profile 
												? (isDark ? 'bg-blue-600/70 border-blue-400/50 text-white' : 'bg-blue-500/70 border-blue-300/50 text-white')
												: (isDark ? 'bg-neutral-700/50 border-white/10 hover:bg-neutral-600/70' : 'bg-white/50 border-neutral-200/30 hover:bg-neutral-100/70')
										}"
										onclick={() => updateSetting('system', 'powerManagement', profile)}
									>
										{profile.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
									</button>
								{/each}
							</div>
						</div>
					</div>

					<!-- Boot Settings -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Boot Settings</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-3">
								<label for="bootTimeout" class="text-sm font-medium">Boot Menu Timeout</label>
								<div class="flex items-center space-x-4">
									<input 
										id="bootTimeout"
										type="range" 
										min="0" 
										max="30" 
										bind:value={settings.system.bootTimeout}
										onchange={() => updateSetting('system', 'bootTimeout', settings.system.bootTimeout)}
										class="flex-1"
									/>
									<span class="text-sm w-16">{settings.system.bootTimeout}s</span>
								</div>
							</div>

							<div class="space-y-3">
								<label class="flex items-center justify-between">
									<div>
										<span class="text-sm font-medium">Auto Login</span>
										<p class="text-xs opacity-60">Skip login screen on boot</p>
									</div>
									<input 
										type="checkbox" 
										bind:checked={settings.system.autoLogin}
										onchange={() => updateSetting('system', 'autoLogin', settings.system.autoLogin)}
										class="rounded" 
									/>
								</label>
							</div>
						</div>
					</div>

					<!-- System Preferences -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Preferences</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Desktop Notifications</span>
									<p class="text-xs opacity-60">Show system and app notifications</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.system.notifications} 
									onchange={() => updateSetting('system', 'notifications', settings.system.notifications)}
									class="rounded" 
								/>
							</label>
							
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">System Sounds</span>
									<p class="text-xs opacity-60">Play sounds for system events</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.system.sounds} 
									onchange={() => updateSetting('system', 'sounds', settings.system.sounds)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Auto Save Documents</span>
									<p class="text-xs opacity-60">Automatically save changes to documents</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.system.autoSave} 
									onchange={() => updateSetting('system', 'autoSave', settings.system.autoSave)}
									class="rounded" 
								/>
							</label>
						</div>
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

					<!-- Data Collection -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Data Collection</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Usage Analytics</span>
									<p class="text-xs opacity-60">Help improve the system by sharing anonymous usage data</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.privacy.analytics} 
									onchange={() => updateSetting('privacy', 'analytics', settings.privacy.analytics)}
									class="rounded" 
								/>
							</label>
							
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Crash Reports</span>
									<p class="text-xs opacity-60">Automatically send crash reports to help fix bugs</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.privacy.crashReports} 
									onchange={() => updateSetting('privacy', 'crashReports', settings.privacy.crashReports)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Telemetry Data</span>
									<p class="text-xs opacity-60">Send diagnostic and performance data</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.privacy.telemetry} 
									onchange={() => updateSetting('privacy', 'telemetry', settings.privacy.telemetry)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Personalization Data</span>
									<p class="text-xs opacity-60">Collect usage patterns for app personalization</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.privacy.dataCollection} 
									onchange={() => updateSetting('privacy', 'dataCollection', settings.privacy.dataCollection)}
									class="rounded" 
								/>
							</label>
						</div>
					</div>

					<!-- Location & Services -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Location & Services</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Location Services</span>
									<p class="text-xs opacity-60">Allow apps to access your location for relevant features</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.privacy.locationServices} 
									onchange={() => updateSetting('privacy', 'locationServices', settings.privacy.locationServices)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Tracking Protection</span>
									<p class="text-xs opacity-60">Block tracking scripts and cookies</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.privacy.trackingProtection} 
									onchange={() => updateSetting('privacy', 'trackingProtection', settings.privacy.trackingProtection)}
									class="rounded" 
								/>
							</label>
						</div>
					</div>

					<!-- Web Browsing -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Web Browsing</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-3">
								<label for="cookies" class="text-sm font-medium">Cookie Policy</label>
								<select 
									id="cookies"
									bind:value={settings.privacy.cookies} 
									onchange={() => updateSetting('privacy', 'cookies', settings.privacy.cookies)}
									class={inputClasses}
								>
									<option value="all">Accept All Cookies</option>
									<option value="essential">Essential Only</option>
									<option value="none">Block All Cookies</option>
									<option value="custom">Custom Settings</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="historyClear" class="text-sm font-medium">Clear History</label>
								<select 
									id="historyClear"
									bind:value={settings.privacy.historyClear} 
									onchange={() => updateSetting('privacy', 'historyClear', settings.privacy.historyClear)}
									class={inputClasses}
								>
									<option value="never">Never</option>
									<option value="daily">Daily</option>
									<option value="weekly">Weekly</option>
									<option value="monthly">Monthly</option>
									<option value="on-exit">On Browser Exit</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Security Actions -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Security Actions</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<button class={buttonClasses}>
								Clear Browsing Data
							</button>
							<button class={buttonClasses}>
								Clear Cache
							</button>
							<button class={buttonClasses}>
								Reset Permissions
							</button>
							<button class={buttonClasses}>
								View Privacy Report
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Network Settings -->
			{#if activeSection === 'network'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Network & Connectivity</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>

					<!-- Wireless -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Wireless</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Wi-Fi</span>
									<p class="text-xs opacity-60">Enable wireless network connectivity</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.network.wifi} 
									onchange={() => updateSetting('network', 'wifi', settings.network.wifi)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Bluetooth</span>
									<p class="text-xs opacity-60">Enable Bluetooth device connections</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.network.bluetooth} 
									onchange={() => updateSetting('network', 'bluetooth', settings.network.bluetooth)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Mobile Hotspot</span>
									<p class="text-xs opacity-60">Share internet connection with other devices</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.network.hotspot} 
									onchange={() => updateSetting('network', 'hotspot', settings.network.hotspot)}
									class="rounded" 
								/>
							</label>
						</div>
					</div>

					<!-- Security -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Security</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Firewall</span>
									<p class="text-xs opacity-60">Block unauthorized network access</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.network.firewall} 
									onchange={() => updateSetting('network', 'firewall', settings.network.firewall)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">VPN Connection</span>
									<p class="text-xs opacity-60">Connect through a Virtual Private Network</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.network.vpn} 
									onchange={() => updateSetting('network', 'vpn', settings.network.vpn)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Network Discovery</span>
									<p class="text-xs opacity-60">Allow this device to be found on the network</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.network.networkDiscovery} 
									onchange={() => updateSetting('network', 'networkDiscovery', settings.network.networkDiscovery)}
									class="rounded" 
								/>
							</label>
						</div>
					</div>

					<!-- Advanced -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Advanced</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-3">
								<label for="dns" class="text-sm font-medium">DNS Server</label>
								<select 
									id="dns"
									bind:value={settings.network.dns} 
									onchange={() => updateSetting('network', 'dns', settings.network.dns)}
									class={inputClasses}
								>
									<option value="auto">Automatic</option>
									<option value="8.8.8.8">Google DNS (8.8.8.8)</option>
									<option value="1.1.1.1">Cloudflare DNS (1.1.1.1)</option>
									<option value="208.67.222.222">OpenDNS (208.67.222.222)</option>
									<option value="custom">Custom</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="proxy" class="text-sm font-medium">Proxy Server</label>
								<input 
									id="proxy"
									type="text" 
									bind:value={settings.network.proxy}
									onchange={() => updateSetting('network', 'proxy', settings.network.proxy)}
									placeholder="http://proxy.example.com:8080"
									class={inputClasses}
								/>
							</div>
						</div>
					</div>

					<!-- Network Actions -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Network Actions</h4>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<button class={buttonClasses}>
								Network Test
							</button>
							<button class={buttonClasses}>
								Reset Network
							</button>
							<button class={buttonClasses}>
								Forget Wi-Fi Networks
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Applications Settings -->
			{#if activeSection === 'applications'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Applications</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>

					<!-- Default Applications -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Default Applications</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-3">
								<label for="defaultBrowser" class="text-sm font-medium">Web Browser</label>
								<select 
									id="defaultBrowser"
									bind:value={settings.applications.defaultBrowser} 
									onchange={() => updateSetting('applications', 'defaultBrowser', settings.applications.defaultBrowser)}
									class={inputClasses}
								>
									<option value="built-in">Built-in Browser</option>
									<option value="firefox">Firefox</option>
									<option value="chrome">Chrome</option>
									<option value="safari">Safari</option>
									<option value="edge">Edge</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="defaultEditor" class="text-sm font-medium">Text Editor</label>
								<select 
									id="defaultEditor"
									bind:value={settings.applications.defaultEditor} 
									onchange={() => updateSetting('applications', 'defaultEditor', settings.applications.defaultEditor)}
									class={inputClasses}
								>
									<option value="text-editor">Text Editor</option>
									<option value="notepad">Notepad</option>
									<option value="vim">Vim</option>
									<option value="nano">Nano</option>
									<option value="code">VS Code</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="defaultTerminal" class="text-sm font-medium">Terminal</label>
								<select 
									id="defaultTerminal"
									bind:value={settings.applications.defaultTerminal} 
									onchange={() => updateSetting('applications', 'defaultTerminal', settings.applications.defaultTerminal)}
									class={inputClasses}
								>
									<option value="terminal">Default Terminal</option>
									<option value="gnome-terminal">GNOME Terminal</option>
									<option value="konsole">Konsole</option>
									<option value="xterm">XTerm</option>
									<option value="alacritty">Alacritty</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="defaultImageViewer" class="text-sm font-medium">Image Viewer</label>
								<select 
									id="defaultImageViewer"
									bind:value={settings.applications.defaultImageViewer} 
									onchange={() => updateSetting('applications', 'defaultImageViewer', settings.applications.defaultImageViewer)}
									class={inputClasses}
								>
									<option value="image-viewer">Image Viewer</option>
									<option value="eog">Eye of GNOME</option>
									<option value="gwenview">Gwenview</option>
									<option value="feh">Feh</option>
								</select>
							</div>

							<div class="space-y-3">
								<label for="defaultMusicPlayer" class="text-sm font-medium">Music Player</label>
								<select 
									id="defaultMusicPlayer"
									bind:value={settings.applications.defaultMusicPlayer} 
									onchange={() => updateSetting('applications', 'defaultMusicPlayer', settings.applications.defaultMusicPlayer)}
									class={inputClasses}
								>
									<option value="music-player">Music Player</option>
									<option value="rhythmbox">Rhythmbox</option>
									<option value="amarok">Amarok</option>
									<option value="vlc">VLC</option>
								</select>
							</div>
						</div>
					</div>

					<!-- App Management -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">App Management</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Auto Update Apps</span>
									<p class="text-xs opacity-60">Automatically download and install app updates</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.applications.autoUpdate} 
									onchange={() => updateSetting('applications', 'autoUpdate', settings.applications.autoUpdate)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Background Apps</span>
									<p class="text-xs opacity-60">Allow apps to run in the background</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.applications.backgroundApps} 
									onchange={() => updateSetting('applications', 'backgroundApps', settings.applications.backgroundApps)}
									class="rounded" 
								/>
							</label>
						</div>
					</div>

					<!-- Startup Apps -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Startup Applications</h4>
						<p class="text-sm opacity-60">Manage which applications start automatically when you log in.</p>
						<div class="space-y-3">
							<div class="flex items-center justify-between p-3 rounded-lg border {isDark ? 'border-white/10 bg-neutral-800/50' : 'border-neutral-200/30 bg-white/50'}">
								<div class="flex items-center space-x-3">
									<span>🌐</span>
									<div>
										<span class="text-sm font-medium">Web Browser</span>
										<p class="text-xs opacity-60">Launches browser on startup</p>
									</div>
								</div>
								<input type="checkbox" class="rounded" />
							</div>

							<div class="flex items-center justify-between p-3 rounded-lg border {isDark ? 'border-white/10 bg-neutral-800/50' : 'border-neutral-200/30 bg-white/50'}">
								<div class="flex items-center space-x-3">
									<span>💻</span>
									<div>
										<span class="text-sm font-medium">Terminal</span>
										<p class="text-xs opacity-60">Starts terminal application</p>
									</div>
								</div>
								<input type="checkbox" class="rounded" />
							</div>
						</div>

						<button class={buttonClasses}>
							Add Startup App
						</button>
					</div>
				</div>
			{/if}

			<!-- Accessibility Settings -->
			{#if activeSection === 'accessibility'}
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-2xl font-bold">Accessibility</h3>
						<button class={buttonClasses} onclick={resetSection}>Reset</button>
					</div>

					<!-- Visual -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Visual</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">High Contrast</span>
									<p class="text-xs opacity-60">Increase contrast for better visibility</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.highContrast} 
									onchange={() => updateSetting('accessibility', 'highContrast', settings.accessibility.highContrast)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Large Text</span>
									<p class="text-xs opacity-60">Increase text size throughout the system</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.largeText} 
									onchange={() => updateSetting('accessibility', 'largeText', settings.accessibility.largeText)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Reduce Motion</span>
									<p class="text-xs opacity-60">Minimize animations and transitions</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.reducedMotion} 
									onchange={() => updateSetting('accessibility', 'reducedMotion', settings.accessibility.reducedMotion)}
									class="rounded" 
								/>
							</label>

							<div class="space-y-3">
								<label for="colorBlindMode" class="text-sm font-medium">Color Blind Support</label>
								<select 
									id="colorBlindMode"
									bind:value={settings.accessibility.colorBlindMode} 
									onchange={() => updateSetting('accessibility', 'colorBlindMode', settings.accessibility.colorBlindMode)}
									class={inputClasses}
								>
									<option value="none">None</option>
									<option value="deuteranopia">Deuteranopia (Green-blind)</option>
									<option value="protanopia">Protanopia (Red-blind)</option>
									<option value="tritanopia">Tritanopia (Blue-blind)</option>
									<option value="monochrome">Monochrome</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Audio -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Audio</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Screen Reader</span>
									<p class="text-xs opacity-60">Enable text-to-speech for UI elements</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.screenReader} 
									onchange={() => updateSetting('accessibility', 'screenReader', settings.accessibility.screenReader)}
									class="rounded" 
								/>
							</label>
						</div>
					</div>

					<!-- Motor -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold">Motor</h4>
						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Keyboard Navigation</span>
									<p class="text-xs opacity-60">Navigate using keyboard only</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.keyboardNavigation} 
									onchange={() => updateSetting('accessibility', 'keyboardNavigation', settings.accessibility.keyboardNavigation)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Mouse Keys</span>
									<p class="text-xs opacity-60">Control mouse pointer with numeric keypad</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.mouseKeys} 
									onchange={() => updateSetting('accessibility', 'mouseKeys', settings.accessibility.mouseKeys)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Sticky Keys</span>
									<p class="text-xs opacity-60">Press modifier keys one at a time</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.stickyKeys} 
									onchange={() => updateSetting('accessibility', 'stickyKeys', settings.accessibility.stickyKeys)}
									class="rounded" 
								/>
							</label>

							<label class="flex items-center justify-between">
								<div>
									<span class="text-sm font-medium">Slow Keys</span>
									<p class="text-xs opacity-60">Ignore brief or repeated keystrokes</p>
								</div>
								<input 
									type="checkbox" 
									bind:checked={settings.accessibility.slowKeys} 
									onchange={() => updateSetting('accessibility', 'slowKeys', settings.accessibility.slowKeys)}
									class="rounded" 
								/>
							</label>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>