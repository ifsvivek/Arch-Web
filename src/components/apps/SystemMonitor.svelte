<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	// Theme-based styling
	const isDarkTheme = $derived(
		desktopState.currentTheme === 'dark' ||
			(desktopState.currentTheme === 'auto' &&
				typeof window !== 'undefined' &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	const containerClasses = $derived(
		`h-full flex flex-col p-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`
	);

	const cardClasses = $derived(
		`rounded-lg border p-4 ${
			isDarkTheme ? 'border-gray-600/30 bg-gray-800/10' : 'border-gray-200/30 bg-white/20'
		}`
	);

	const chartClasses = $derived(
		`h-32 rounded border flex items-center justify-center ${
			isDarkTheme
				? 'border-gray-600/30 bg-gray-900/20 text-gray-400'
				: 'border-gray-200/30 bg-gray-100/30 text-gray-600'
		}`
	);

	let cpuUsage = $state(45);
	let memoryUsage = $state(39);

	const processes = [
		{ name: 'firefox', cpu: 12.0 },
		{ name: 'gnome-shell', cpu: 3.2 },
		{ name: 'hyprland', cpu: 1.8 },
		{ name: 'foot', cpu: 0.5 },
		{ name: 'waybar', cpu: 0.3 }
	];
</script>

<div class={containerClasses}>
	<h1 class="mb-6 text-2xl font-bold">System Monitor</h1>

	<div class="mb-6 grid grid-cols-2 gap-4">
		<div class={cardClasses}>
			<h2 class="mb-2 text-lg font-semibold">CPU Usage</h2>
			<div class={chartClasses}>
				<span>CPU: {cpuUsage}%</span>
			</div>
			<p class={`mt-2 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
				Current: {cpuUsage}%
			</p>
		</div>

		<div class={cardClasses}>
			<h2 class="mb-2 text-lg font-semibold">Memory Usage</h2>
			<div class={chartClasses}>
				<span>RAM: {memoryUsage}%</span>
			</div>
			<p class={`mt-2 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
				8.8GB / 22.8GB ({memoryUsage}%)
			</p>
		</div>
	</div>

	<div class={cardClasses}>
		<h2 class="mb-4 text-lg font-semibold">Process List</h2>
		<div class="space-y-2">
			{#each processes as process}
				<div
					class={`flex items-center justify-between rounded p-2 ${isDarkTheme ? 'hover:bg-gray-700/20' : 'hover:bg-gray-200/30'}`}
				>
					<span>{process.name}</span>
					<span class={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}
						>{process.cpu}%</span
					>
				</div>
			{/each}
		</div>
	</div>
</div>
