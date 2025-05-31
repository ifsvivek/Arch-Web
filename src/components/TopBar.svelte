<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let { onActivitiesClick } = $props();

	let showUserMenu = $state(false);
	let showSystemMenu = $state(false);
	let notifications = $state([
		{ id: 1, title: 'System Update', message: 'Updates are available', time: '2m ago' },
		{ id: 2, title: 'WiFi Connected', message: 'Connected to ArchLinux-WiFi', time: '5m ago' }
	]);
	let showNotifications = $state(false);

	function toggleUserMenu() {
		showUserMenu = !showUserMenu;
		showSystemMenu = false;
		showNotifications = false;
	}

	function toggleSystemMenu() {
		showSystemMenu = !showSystemMenu;
		showUserMenu = false;
		showNotifications = false;
	}

	function toggleNotifications() {
		showNotifications = !showNotifications;
		showUserMenu = false;
		showSystemMenu = false;
	}

	function closeAllMenus() {
		showUserMenu = false;
		showSystemMenu = false;
		showNotifications = false;
	}

	function handleActivities() {
		if (onActivitiesClick) {
			onActivitiesClick();
		} else {
			// Show all windows overview (fallback)
			console.log('Activities overview');
		}
	}

	function dismissNotification(id) {
		notifications = notifications.filter((n) => n.id !== id);
	}

	// Reactive theme classes with enhanced styling
	const topBarClasses = $derived(() => {
		const baseClasses = "fixed top-0 right-0 left-0 z-50 flex h-10 items-center justify-between px-6 select-none backdrop-blur-2xl border-b shadow-lg";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'bg-white/20 text-neutral-900 border-neutral-200/50' 
			: 'bg-black/30 text-white border-neutral-700/50';
		return `${baseClasses} ${themeClasses}`;
	});

	const buttonClasses = $derived(() => {
		const baseClasses = "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'hover:bg-neutral-200/70 hover:shadow-md' 
			: 'hover:bg-neutral-700/70 hover:shadow-md';
		return `${baseClasses} ${themeClasses}`;
	});

	const clockButtonClasses = $derived(() => {
		const baseClasses = "flex flex-col items-center rounded-lg px-3 py-1 text-xs leading-tight transition-all duration-200 hover:scale-105 active:scale-95";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'hover:bg-neutral-200/70 hover:shadow-md' 
			: 'hover:bg-neutral-700/70 hover:shadow-md';
		return `${baseClasses} ${themeClasses}`;
	});

	const timeTextClasses = $derived(() => {
		const baseClasses = "font-semibold text-base";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-900' 
			: 'text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const dateTextClasses = $derived(() => {
		const baseClasses = "text-xs font-medium";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-600' 
			: 'text-neutral-300';
		return `${baseClasses} ${themeClasses}`;
	});

	const iconClasses = $derived(() => {
		const baseClasses = "h-5 w-5 cursor-pointer transition-all duration-200 hover:scale-110";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-600 hover:text-neutral-900' 
			: 'text-neutral-300 hover:text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const notificationIconClasses = $derived(() => {
		const baseClasses = "relative h-5 w-5 cursor-pointer transition-all duration-200 hover:scale-110";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-600 hover:text-neutral-900' 
			: 'text-neutral-300 hover:text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const userMenuButtonClasses = $derived(() => {
		const baseClasses = "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ring-2 ring-offset-2";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 ring-blue-500/20 ring-offset-white' 
			: 'bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 ring-blue-400/20 ring-offset-neutral-900';
		return `${baseClasses} ${themeClasses}`;
	});

	const dropdownClasses = $derived(() => {
		const baseClasses = "absolute top-12 right-0 z-50 w-80 rounded-xl border backdrop-blur-xl shadow-2xl transform transition-all duration-200 origin-top-right";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'border-neutral-200/50 bg-white/90' 
			: 'border-neutral-700/50 bg-neutral-800/90';
		return `${baseClasses} ${themeClasses}`;
	});

	const dropdownHeaderClasses = $derived(() => {
		const baseClasses = "px-4 py-3 text-sm font-semibold border-b";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-900 border-neutral-200/50' 
			: 'text-white border-neutral-700/50';
		return `${baseClasses} ${themeClasses}`;
	});

	const dropdownButtonClasses = $derived(() => {
		const baseClasses = "text-xs transition-all duration-200 hover:scale-105";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-600 hover:text-neutral-900' 
			: 'text-neutral-400 hover:text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const emptyStateClasses = $derived(() => {
		const baseClasses = "py-8 text-center text-sm font-medium";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-500' 
			: 'text-neutral-400';
		return `${baseClasses} ${themeClasses}`;
	});

	const notificationItemClasses = $derived(() => {
		const baseClasses = "flex items-start justify-between rounded-lg p-3 m-2 transition-all duration-200 hover:scale-[1.02]";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'bg-neutral-100/70 hover:bg-neutral-200/70' 
			: 'bg-neutral-700/70 hover:bg-neutral-600/70';
		return `${baseClasses} ${themeClasses}`;
	});

	const notificationTitleClasses = $derived(() => {
		const baseClasses = "text-sm font-semibold";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-900' 
			: 'text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const notificationTextClasses = $derived(() => {
		const baseClasses = "text-xs";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-600' 
			: 'text-neutral-300';
		return `${baseClasses} ${themeClasses}`;
	});

	const notificationTimeClasses = $derived(() => {
		const baseClasses = "mt-1 text-xs font-medium";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-500' 
			: 'text-neutral-400';
		return `${baseClasses} ${themeClasses}`;
	});

	const systemMenuClasses = $derived(() => {
		const baseClasses = "absolute top-12 right-0 z-50 w-72 rounded-xl border backdrop-blur-xl shadow-2xl transform transition-all duration-200 origin-top-right";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'border-neutral-200/50 bg-white/90' 
			: 'border-neutral-700/50 bg-neutral-800/90';
		return `${baseClasses} ${themeClasses}`;
	});

	const systemMenuTextClasses = $derived(() => {
		const baseClasses = "text-sm font-medium";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-900' 
			: 'text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const systemMenuSubtextClasses = $derived(() => {
		const baseClasses = "text-xs";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-500' 
			: 'text-neutral-400';
		return `${baseClasses} ${themeClasses}`;
	});

	const sliderClasses = $derived(() => {
		const baseClasses = "h-2 w-full appearance-none rounded-full cursor-pointer transition-all duration-200";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'bg-neutral-300 accent-blue-600' 
			: 'bg-neutral-600 accent-blue-400';
		return `${baseClasses} ${themeClasses}`;
	});

	const userMenuClasses = $derived(() => {
		const baseClasses = "absolute top-12 right-0 z-50 w-52 rounded-xl border backdrop-blur-xl shadow-2xl transform transition-all duration-200 origin-top-right";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'border-neutral-200/50 bg-white/90' 
			: 'border-neutral-700/50 bg-neutral-800/90';
		return `${baseClasses} ${themeClasses}`;
	});

	const userMenuHeaderClasses = $derived(() => {
		const baseClasses = "px-4 py-3 border-b";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'border-neutral-200/50' 
			: 'border-neutral-700/50';
		return `${baseClasses} ${themeClasses}`;
	});

	const userMenuUsernameClasses = $derived(() => {
		const baseClasses = "text-sm font-semibold";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-900' 
			: 'text-white';
		return `${baseClasses} ${themeClasses}`;
	});

	const userMenuOSClasses = $derived(() => {
		const baseClasses = "text-xs font-medium";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-500' 
			: 'text-neutral-400';
		return `${baseClasses} ${themeClasses}`;
	});

	const userMenuItemClasses = $derived(() => {
		const baseClasses = "w-full rounded-lg mx-2 my-1 px-3 py-2 text-left text-sm font-medium transition-all duration-200 hover:scale-[1.02]";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'text-neutral-900 hover:bg-neutral-100/70' 
			: 'text-white hover:bg-neutral-700/70';
		return `${baseClasses} ${themeClasses}`;
	});

	const userMenuDangerButtonClasses = $derived(() => {
		const baseClasses = "w-full rounded-lg mx-2 my-1 px-3 py-2 text-left text-sm font-medium text-red-500 transition-all duration-200 hover:scale-[1.02]";
		const themeClasses = desktopState.currentTheme === 'light' 
			? 'hover:bg-red-50/70' 
			: 'hover:bg-red-900/20';
		return `${baseClasses} ${themeClasses}`;
	});
</script>

<svelte:window onclick={closeAllMenus} />

<div class={topBarClasses()}>
	<!-- Activities Button -->
	<button class={buttonClasses()} onclick={handleActivities}>
		<span class="text-sm font-semibold">Activities</span>
	</button>

	<!-- Center - Clock -->
	<button
		class={clockButtonClasses()}
		onclick={(e) => {
			e.stopPropagation();
			toggleNotifications();
		}}
	>
		<div class={timeTextClasses()}>
			{desktopState.formattedTime}
		</div>
		<div class={dateTextClasses()}>
			{desktopState.formattedDate}
		</div>
	</button>

	<!-- Right - System Status -->
	<div class="relative flex items-center space-x-3">
		<!-- Notifications -->
		<button
			class={notificationIconClasses()}
			onclick={(e) => {
				e.stopPropagation();
				toggleNotifications();
			}}
			aria-label="Notifications"
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
				/>
			</svg>
			{#if notifications.length > 0}
				<div
					class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center"
				>
					{notifications.length}
				</div>
			{/if}
		</button>

		<!-- Network Icon -->
		<button
			class={iconClasses()}
			onclick={(e) => {
				e.stopPropagation();
				toggleSystemMenu();
			}}
			aria-label="Network settings"
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"
				/>
			</svg>
		</button>

		<!-- Volume Icon -->
		<button class={iconClasses()} aria-label="Volume control">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
				/>
			</svg>
		</button>

		<!-- Battery Icon -->
		<button class={iconClasses()} aria-label="Battery status">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M15.67 4H14V2c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4.33C3.6 4 3 4.6 3 5.33v15.33C3 21.4 3.6 22 4.33 22h11.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"
				/>
			</svg>
		</button>

		<!-- User Menu Button -->
		<button
			class={userMenuButtonClasses()}
			onclick={(e) => {
				e.stopPropagation();
				toggleUserMenu();
			}}
			aria-label="User menu"
		>
			<svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
				/>
			</svg>
		</button>
	</div>

	<!-- Notifications Dropdown -->
	{#if showNotifications}
		<div class={dropdownClasses()}>
			<div class="flex items-center justify-between {dropdownHeaderClasses()}">
				<span>Notifications</span>
				<button class={dropdownButtonClasses()}>Clear All</button>
			</div>
			
			<div class="max-h-80 overflow-y-auto">
				{#if notifications.length === 0}
					<div class={emptyStateClasses()}>
						<svg class="mx-auto h-12 w-12 text-neutral-400 mb-2" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
						</svg>
						No new notifications
					</div>
				{:else}
					{#each notifications as notification}
						<div class={notificationItemClasses()}>
							<div class="flex-1">
								<div class={notificationTitleClasses()}>
									{notification.title}
								</div>
								<div class={notificationTextClasses()}>
									{notification.message}
								</div>
								<div class={notificationTimeClasses()}>
									{notification.time}
								</div>
							</div>
							<button
								class="ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
								onclick={() => dismissNotification(notification.id)}
								aria-label="Dismiss notification"
							>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
								</svg>
							</button>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}

	<!-- System Menu -->
	{#if showSystemMenu}
		<div class={systemMenuClasses()}>
			<div class="p-4 space-y-4">
				<!-- Network Status -->
				<div class="flex items-center justify-between">
					<div>
						<div class={systemMenuTextClasses()}>WiFi</div>
						<div class={systemMenuSubtextClasses()}>ArchLinux-WiFi</div>
					</div>
					<div class="flex items-center space-x-2">
						<div class="h-2 w-2 rounded-full bg-green-500"></div>
						<span class="text-xs text-green-500 font-medium">Connected</span>
					</div>
				</div>

				<hr class="border-neutral-300 dark:border-neutral-600" />

				<!-- Volume Control -->
				<div>
					<div class={systemMenuTextClasses()}>Volume</div>
					<div class="mt-2 flex items-center space-x-3">
						<svg class="h-4 w-4 text-current" viewBox="0 0 24 24" fill="currentColor">
							<path d="M3 9v6h4l5 5V4L7 9H3z"/>
						</svg>
						<input
							type="range"
							min="0"
							max="100"
							value="75"
							class={sliderClasses()}
						/>
						<span class="text-xs font-medium min-w-[2rem]">75%</span>
					</div>
				</div>

				<!-- Brightness Control -->
				<div>
					<div class={systemMenuTextClasses()}>Brightness</div>
					<div class="mt-2 flex items-center space-x-3">
						<svg class="h-4 w-4 text-current" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
						</svg>
						<input
							type="range"
							min="0"
							max="100"
							value="60"
							class={sliderClasses()}
						/>
						<span class="text-xs font-medium min-w-[2rem]">60%</span>
					</div>
				</div>

				<hr class="border-neutral-300 dark:border-neutral-600" />

				<!-- Battery Status -->
				<div class="flex items-center justify-between">
					<div>
						<div class={systemMenuTextClasses()}>Battery</div>
						<div class={systemMenuSubtextClasses()}>2h 45m remaining</div>
					</div>
					<div class="flex items-center space-x-2">
						<div class="text-lg font-bold text-green-500">87%</div>
						<svg class="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
							<path d="M15.67 4H14V2c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4.33C3.6 4 3 4.6 3 5.33v15.33C3 21.4 3.6 22 4.33 22h11.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- User Menu -->
	{#if showUserMenu}
		<div class={userMenuClasses()}>
			<div class={userMenuHeaderClasses()}>
				<div class={userMenuUsernameClasses()}>vivek</div>
				<div class={userMenuOSClasses()}>Arch Linux</div>
			</div>
			
			<div class="py-2">
				<button class={userMenuItemClasses()}>
					<svg class="inline h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					</svg>
					Account Settings
				</button>
				
				<button class={userMenuItemClasses()}>
					<svg class="inline h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
					</svg>
					Preferences
				</button>
				
				<button class={userMenuItemClasses()}>
					<svg class="inline h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-6h2V17z M13,9h-2V7h2V9z"/>
					</svg>
					Help & Support
				</button>
				
				<hr class="my-2 border-neutral-300 dark:border-neutral-600" />
				
				<button class={userMenuDangerButtonClasses()}>
					<svg class="inline h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
						<path d="M17,7l-1.41,1.41L18.17,11H8v2h10.17l-2.58,2.58L17,17l5-5L17,7z M4,5h8V3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h8v-2H4V5z"/>
					</svg>
					Sign Out
				</button>
			</div>
		</div>
	{/if}
</div>
