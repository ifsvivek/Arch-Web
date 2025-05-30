<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

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
		// Show all windows overview
		console.log('Activities overview');
	}

	function dismissNotification(id) {
		notifications = notifications.filter((n) => n.id !== id);
	}
</script>

<svelte:window onclick={closeAllMenus} />

<div
	class="fixed top-0 right-0 left-0 z-50 flex h-8 items-center justify-between bg-gray-900 px-4 text-white select-none"
>
	<!-- Activities Button -->
	<button
		class="rounded px-3 py-1 text-sm transition-colors hover:bg-gray-700"
		onclick={handleActivities}
	>
		Activities
	</button>

	<!-- Center - Clock -->  <button
    class="flex flex-col items-center rounded px-2 py-1 text-xs leading-tight transition-colors hover:bg-gray-700"
    onclick={(e) => { e.stopPropagation(); toggleNotifications(); }}
  >
		<div class="font-medium text-white">
			{desktopState.formattedTime}
		</div>
		<div class="text-xs text-gray-300">
			{desktopState.formattedDate}
		</div>
	</button>

	<!-- Right - System Status -->
	<div class="relative flex items-center space-x-2">
		<!-- Notifications -->
		{#if notifications.length > 0}
			<button
				class="relative h-4 w-4 cursor-pointer text-gray-300 hover:text-white"
				onclick={(e) => { e.stopPropagation(); toggleNotifications(); }}
			>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
					/>
				</svg>
				<div class="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></div>
			</button>
		{/if}

		<!-- Network Icon -->
		<button
			class="h-4 w-4 cursor-pointer text-gray-300 hover:text-white"
			onclick={(e) => { e.stopPropagation(); toggleSystemMenu(); }}
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12.01 21.49 23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"
				/>
			</svg>
		</button>

		<!-- Volume Icon -->
		<div class="h-4 w-4 cursor-pointer text-gray-300 hover:text-white">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
				/>
			</svg>
		</div>

		<!-- Battery Icon -->
		<div class="h-4 w-4 cursor-pointer text-gray-300 hover:text-white">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M15.67 4H14V2c0-1.1-.9-2-2-2s-2 .9-2 2v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"
				/>
			</svg>
		</div>

		<!-- User Menu -->
		<button
			class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 transition-colors hover:bg-gray-500"
			onclick={(e) => { e.stopPropagation(); toggleUserMenu(); }}
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
				/>
			</svg>
		</button>

		<!-- Notification Panel -->
		{#if showNotifications}
			<div
				class="absolute top-8 right-0 z-50 w-80 rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-xl"
			>
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-sm font-semibold">Notifications</h3>
					<button
						class="text-xs text-gray-400 hover:text-white"
						onclick={() => (notifications = [])}
					>
						Clear All
					</button>
				</div>
				{#if notifications.length === 0}
					<div class="py-4 text-center text-sm text-gray-400">No notifications</div>
				{:else}
					<div class="space-y-2">
						{#each notifications as notification}
							<div class="flex items-start justify-between rounded bg-gray-700 p-3">
								<div class="flex-1">
									<div class="text-sm font-medium">{notification.title}</div>
									<div class="text-xs text-gray-300">{notification.message}</div>
									<div class="mt-1 text-xs text-gray-400">{notification.time}</div>
								</div>
								<button
									class="text-gray-400 hover:text-white"
									onclick={() => dismissNotification(notification.id)}
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
										/>
									</svg>
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- System Menu -->
		{#if showSystemMenu}
			<div
				class="absolute top-8 right-0 z-50 w-64 rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-xl"
			>
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm">WiFi</span>
						<div class="flex items-center text-green-400">
							<div class="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
							<span class="text-xs">Connected</span>
						</div>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm">Bluetooth</span>
						<div class="flex items-center text-gray-400">
							<div class="mr-2 h-2 w-2 rounded-full bg-gray-400"></div>
							<span class="text-xs">Off</span>
						</div>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm">Do Not Disturb</span>
						<button class="relative h-4 w-8 rounded-full bg-gray-600">
							<div class="absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white"></div>
						</button>
					</div>
					<hr class="border-gray-600" />
					<div class="space-y-2">
						<div class="flex items-center justify-between text-sm">
							<span>Brightness</span>
							<span class="text-xs text-gray-400">75%</span>
						</div>
						<input
							type="range"
							class="h-1 w-full appearance-none rounded-lg bg-gray-600"
							value="75"
						/>
						<div class="flex items-center justify-between text-sm">
							<span>Volume</span>
							<span class="text-xs text-gray-400">80%</span>
						</div>
						<input
							type="range"
							class="h-1 w-full appearance-none rounded-lg bg-gray-600"
							value="80"
						/>
					</div>
				</div>
			</div>
		{/if}

		<!-- User Menu -->
		{#if showUserMenu}
			<div
				class="absolute top-8 right-0 z-50 w-48 rounded-lg border border-gray-600 bg-gray-800 p-2 shadow-xl"
			>
				<div class="mb-2 border-b border-gray-600 px-3 py-2">
					<div class="text-sm font-semibold">archuser</div>
					<div class="text-xs text-gray-400">Arch Linux</div>
				</div>
				<div class="space-y-1">
					<button class="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-700"
						>Settings</button
					>
					<button class="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-700"
						>Lock Screen</button
					>
					<button class="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-700"
						>Switch User</button
					>
					<hr class="my-2 border-gray-600" />
					<button class="w-full rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
						>Log Out</button
					>
					<button class="w-full rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
						>Shutdown</button
					>
				</div>
			</div>
		{/if}
	</div>
</div>
