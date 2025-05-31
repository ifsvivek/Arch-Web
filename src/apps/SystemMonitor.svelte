<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let activeTab = $state('overview');
	let refreshInterval = $state(2000);
	let autoRefresh = $state(true);
	let refreshTimer = $state(null);

	// System metrics (simulated)
	let systemMetrics = $state({
		cpu: {
			usage: 45,
			cores: 8,
			temperature: 65,
			processes: []
		},
		memory: {
			total: 16384,
			used: 8192,
			free: 8192,
			cached: 2048,
			buffers: 512
		},
		disk: {
			total: 512000,
			used: 256000,
			free: 256000,
			readSpeed: 125,
			writeSpeed: 98
		},
		network: {
			downloadSpeed: 1250,
			uploadSpeed: 850,
			totalDownload: 15.6,
			totalUpload: 8.3
		},
		gpu: {
			usage: 23,
			memory: 8192,
			memoryUsed: 1896,
			temperature: 58
		}
	});

	let processes = $state([
		{ pid: 1234, name: 'chrome', cpu: 15.4, memory: 1024, user: 'vivek', status: 'running' },
		{ pid: 5678, name: 'firefox', cpu: 8.7, memory: 768, user: 'vivek', status: 'running' },
		{ pid: 9012, name: 'code', cpu: 6.2, memory: 512, user: 'vivek', status: 'running' },
		{ pid: 3456, name: 'systemd', cpu: 3.1, memory: 256, user: 'root', status: 'running' },
		{ pid: 7890, name: 'gnome-shell', cpu: 2.8, memory: 384, user: 'vivek', status: 'running' },
		{ pid: 2345, name: 'nodejs', cpu: 2.3, memory: 298, user: 'vivek', status: 'running' },
		{ pid: 6789, name: 'docker', cpu: 1.9, memory: 445, user: 'root', status: 'running' },
		{ pid: 1357, name: 'ssh', cpu: 0.8, memory: 128, user: 'vivek', status: 'sleeping' }
	]);

	let cpuHistory = $state(Array(50).fill(0).map(() => Math.random() * 100));
	let memoryHistory = $state(Array(50).fill(0).map(() => Math.random() * 100));
	let networkHistory = $state(Array(50).fill(0).map(() => ({
		download: Math.random() * 2000,
		upload: Math.random() * 1000
	})));

	const isDarkTheme = $derived(
		desktopState.currentTheme === 'dark' ||
		(desktopState.currentTheme === 'auto' &&
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	function updateMetrics() {
		// Simulate real-time data updates
		systemMetrics.cpu.usage = Math.max(0, Math.min(100, systemMetrics.cpu.usage + (Math.random() - 0.5) * 10));
		systemMetrics.memory.used = Math.max(0, Math.min(systemMetrics.memory.total, systemMetrics.memory.used + (Math.random() - 0.5) * 1000));
		systemMetrics.network.downloadSpeed = Math.max(0, systemMetrics.network.downloadSpeed + (Math.random() - 0.5) * 200);
		systemMetrics.network.uploadSpeed = Math.max(0, systemMetrics.network.uploadSpeed + (Math.random() - 0.5) * 100);
		systemMetrics.gpu.usage = Math.max(0, Math.min(100, systemMetrics.gpu.usage + (Math.random() - 0.5) * 5));
		
		// Update histories
		cpuHistory = [...cpuHistory.slice(1), systemMetrics.cpu.usage];
		memoryHistory = [...memoryHistory.slice(1), (systemMetrics.memory.used / systemMetrics.memory.total) * 100];
		networkHistory = [...networkHistory.slice(1), {
			download: systemMetrics.network.downloadSpeed,
			upload: systemMetrics.network.uploadSpeed
		}];

		// Update processes
		processes = processes.map(proc => ({
			...proc,
			cpu: Math.max(0, proc.cpu + (Math.random() - 0.5) * 2),
			memory: Math.max(0, proc.memory + (Math.random() - 0.5) * 50)
		}));
		
		systemMetrics = { ...systemMetrics };
	}

	function startAutoRefresh() {
		if (refreshTimer) clearInterval(refreshTimer);
		if (autoRefresh) {
			refreshTimer = setInterval(updateMetrics, refreshInterval);
		}
	}

	function toggleAutoRefresh() {
		autoRefresh = !autoRefresh;
		startAutoRefresh();
	}

	function handleRefreshIntervalChange() {
		startAutoRefresh();
	}

	function killProcess(pid) {
		processes = processes.filter(p => p.pid !== pid);
	}

	function formatBytes(bytes) {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	function getUsageColor(percentage) {
		if (percentage < 50) return isDarkTheme ? 'text-green-400' : 'text-green-600';
		if (percentage < 80) return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
		return isDarkTheme ? 'text-red-400' : 'text-red-600';
	}

	function getUsageBarColor(percentage) {
		if (percentage < 50) return 'from-green-500 to-green-600';
		if (percentage < 80) return 'from-yellow-500 to-yellow-600';
		return 'from-red-500 to-red-600';
	}

	// Chart component for history visualization
	function renderChart(data, color = 'blue', height = 60) {
		const max = Math.max(...(Array.isArray(data[0]) ? data.map(d => Math.max(d.download || 0, d.upload || 0)) : data));
		const points = data.map((value, index) => {
			const x = (index / (data.length - 1)) * 100;
			const y = height - ((Array.isArray(value) ? Math.max(value.download || 0, value.upload || 0) : value) / max) * height;
			return `${x},${y}`;
		}).join(' ');
		
		return `<svg class="w-full h-16" viewBox="0 0 100 ${height}">
			<polyline fill="none" stroke="currentColor" stroke-width="2" points="${points}" class="text-${color}-500"/>
		</svg>`;
	}

	$effect(() => {
		startAutoRefresh();
		
		return () => {
			if (refreshTimer) clearInterval(refreshTimer);
		};
	});
</script>

<div class="flex h-full flex-col {isDarkTheme ? 'bg-neutral-900/70 text-white' : 'bg-white/70 text-neutral-900'} backdrop-blur-xl">
	<!-- Header -->
	<div class="flex items-center justify-between {isDarkTheme ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-100/80 border-neutral-300'} border-b px-4 py-3">
		<div class="flex items-center space-x-3">
			<div class="text-xl">📊</div>
			<div>
				<h1 class="text-lg font-bold">System Monitor</h1>
				<p class="text-xs opacity-70">Real-time system performance</p>
			</div>
		</div>
		
		<!-- Controls -->
		<div class="flex items-center space-x-3">
			<div class="flex items-center space-x-2">
				<span class="text-xs font-medium">Refresh:</span>
				<select
					bind:value={refreshInterval}
					oninput={handleRefreshIntervalChange}
					class="rounded-lg border px-2 py-1 text-xs transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 focus:outline-none
					{isDarkTheme 
						? 'bg-neutral-700/70 border-neutral-600 text-white' 
						: 'bg-white/70 border-neutral-300 text-neutral-900'}"
				>
					<option value={1000}>1s</option>
					<option value={2000}>2s</option>
					<option value={5000}>5s</option>
					<option value={10000}>10s</option>
				</select>
			</div>
			
			<button
				onclick={toggleAutoRefresh}
				class="rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105
				{autoRefresh 
					? 'bg-green-500 text-white hover:bg-green-600' 
					: (isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300')}"
			>
				{autoRefresh ? 'Auto' : 'Manual'}
			</button>
			
			<button
				onclick={updateMetrics}
				class="rounded-lg p-1.5 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				title="Refresh Now"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Tab Navigation -->
	<div class="flex {isDarkTheme ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50/60 border-neutral-200'} border-b">
		{#each ['overview', 'processes', 'performance', 'network'] as tab}
			<button
				onclick={() => activeTab = tab}
				class="px-4 py-2 text-xs font-medium transition-all duration-200 capitalize border-b-2
				{activeTab === tab 
					? 'border-blue-500 text-blue-500' 
					: (isDarkTheme ? 'border-transparent text-neutral-400 hover:text-white' : 'border-transparent text-neutral-600 hover:text-neutral-900')}"
			>
				{tab}
			</button>
		{/each}
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-auto p-4">
		{#if activeTab === 'overview'}
			<!-- Overview Tab -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<!-- CPU Card -->
				<div class="rounded-xl border p-4 transition-all duration-200 hover:scale-105
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold text-sm">CPU Usage</h3>
						<div class="text-lg">🖥️</div>
					</div>
					<div class="mb-2">
						<div class="text-xl font-bold {getUsageColor(systemMetrics.cpu.usage)}">{systemMetrics.cpu.usage.toFixed(1)}%</div>
						<div class="text-xs opacity-70">{systemMetrics.cpu.cores} cores • {systemMetrics.cpu.temperature}°C</div>
					</div>
					<div class="w-full bg-neutral-300 dark:bg-neutral-600 rounded-full h-1.5">
						<div 
							class="bg-gradient-to-r {getUsageBarColor(systemMetrics.cpu.usage)} h-1.5 rounded-full transition-all duration-300" 
							style="width: {systemMetrics.cpu.usage}%"
						></div>
					</div>
				</div>

				<!-- Memory Card -->
				<div class="rounded-xl border p-4 transition-all duration-200 hover:scale-105
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold text-sm">Memory</h3>
						<div class="text-lg">🧠</div>
					</div>
					<div class="mb-2">
						<div class="text-xl font-bold {getUsageColor((systemMetrics.memory.used / systemMetrics.memory.total) * 100)}">
							{((systemMetrics.memory.used / systemMetrics.memory.total) * 100).toFixed(1)}%
						</div>
						<div class="text-xs opacity-70">{formatBytes(systemMetrics.memory.used * 1024 * 1024)} / {formatBytes(systemMetrics.memory.total * 1024 * 1024)}</div>
					</div>
					<div class="w-full bg-neutral-300 dark:bg-neutral-600 rounded-full h-1.5">
						<div 
							class="bg-gradient-to-r {getUsageBarColor((systemMetrics.memory.used / systemMetrics.memory.total) * 100)} h-1.5 rounded-full transition-all duration-300" 
							style="width: {(systemMetrics.memory.used / systemMetrics.memory.total) * 100}%"
						></div>
					</div>
				</div>

				<!-- Disk Card -->
				<div class="rounded-xl border p-4 transition-all duration-200 hover:scale-105
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold text-sm">Storage</h3>
						<div class="text-lg">💾</div>
					</div>
					<div class="mb-2">
						<div class="text-xl font-bold {getUsageColor((systemMetrics.disk.used / systemMetrics.disk.total) * 100)}">
							{((systemMetrics.disk.used / systemMetrics.disk.total) * 100).toFixed(1)}%
						</div>
						<div class="text-xs opacity-70">{formatBytes(systemMetrics.disk.used * 1024 * 1024)} / {formatBytes(systemMetrics.disk.total * 1024 * 1024)}</div>
					</div>
					<div class="w-full bg-neutral-300 dark:bg-neutral-600 rounded-full h-1.5">
						<div 
							class="bg-gradient-to-r {getUsageBarColor((systemMetrics.disk.used / systemMetrics.disk.total) * 100)} h-1.5 rounded-full transition-all duration-300" 
							style="width: {(systemMetrics.disk.used / systemMetrics.disk.total) * 100}%"
						></div>
					</div>
				</div>

				<!-- Network Card -->
				<div class="rounded-xl border p-4 transition-all duration-200 hover:scale-105
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold text-sm">Network</h3>
						<div class="text-lg">🌐</div>
					</div>
					<div class="mb-2">
						<div class="text-sm font-bold text-green-500">↓ {formatBytes(systemMetrics.network.downloadSpeed)}/s</div>
						<div class="text-sm font-bold text-blue-500">↑ {formatBytes(systemMetrics.network.uploadSpeed)}/s</div>
					</div>
					<div class="text-xs opacity-70">
						Total: {systemMetrics.network.totalDownload} GB ↓ / {systemMetrics.network.totalUpload} GB ↑
					</div>
				</div>
			</div>

			<!-- System Information -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div class="rounded-xl border p-4
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<h3 class="font-semibold mb-3 text-sm">System Information</h3>
					<div class="space-y-2">
						<div class="flex justify-between">
							<span class="opacity-70 text-xs">OS:</span>
							<span class="font-medium text-xs">Arch Linux</span>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70 text-xs">Kernel:</span>
							<span class="font-medium text-xs">6.1.0-arch1-1</span>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70 text-xs">Uptime:</span>
							<span class="font-medium text-xs">2d 14h 32m</span>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70 text-xs">CPU:</span>
							<span class="font-medium text-xs">AMD Ryzen 7 5800X</span>
						</div>
						<div class="flex justify-between">
							<span class="opacity-70 text-xs">GPU:</span>
							<span class="font-medium text-xs">NVIDIA RTX 3070</span>
						</div>
					</div>
				</div>

				<div class="rounded-xl border p-4
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<h3 class="font-semibold mb-3 text-sm">Top Processes</h3>
					<div class="space-y-2">
						{#each processes.slice(0, 5) as process}
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<div class="font-medium text-xs">{process.name}</div>
									<div class="text-xs opacity-70">PID: {process.pid}</div>
								</div>
								<div class="text-right">
									<div class="font-medium {getUsageColor(process.cpu)} text-xs">{process.cpu.toFixed(1)}%</div>
									<div class="text-xs opacity-70">{formatBytes(process.memory * 1024 * 1024)}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

		{:else if activeTab === 'processes'}
			<!-- Processes Tab -->
			<div class="rounded-xl border overflow-hidden
			{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
				<div class="p-4 border-b {isDarkTheme ? 'border-neutral-600' : 'border-neutral-200'}">
					<h3 class="font-semibold text-sm">Running Processes</h3>
					<p class="text-xs opacity-70">{processes.length} processes running</p>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="{isDarkTheme ? 'bg-neutral-700/50' : 'bg-neutral-100/50'}">
							<tr>
								<th class="px-4 py-2 text-left text-xs font-medium">PID</th>
								<th class="px-4 py-2 text-left text-xs font-medium">Name</th>
								<th class="px-4 py-2 text-left text-xs font-medium">CPU %</th>
								<th class="px-4 py-2 text-left text-xs font-medium">Memory</th>
								<th class="px-4 py-2 text-left text-xs font-medium">User</th>
								<th class="px-4 py-2 text-left text-xs font-medium">Status</th>
								<th class="px-4 py-2 text-left text-xs font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each processes as process}
								<tr class="border-t transition-colors hover:bg-opacity-50 {isDarkTheme ? 'border-neutral-600 hover:bg-neutral-700' : 'border-neutral-200 hover:bg-neutral-100'}">
									<td class="px-4 py-2 text-xs font-mono">{process.pid}</td>
									<td class="px-4 py-2 text-xs font-medium">{process.name}</td>
									<td class="px-4 py-2 text-xs {getUsageColor(process.cpu)}">{process.cpu.toFixed(1)}%</td>
									<td class="px-4 py-2 text-xs">{formatBytes(process.memory * 1024 * 1024)}</td>
									<td class="px-4 py-2 text-xs">{process.user}</td>
									<td class="px-4 py-2 text-xs">
										<span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium
										{process.status === 'running' 
											? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
											: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}">
											{process.status}
										</span>
									</td>
									<td class="px-4 py-2 text-xs">
										<button
											onclick={() => killProcess(process.pid)}
											class="rounded-lg px-2 py-1 text-xs font-medium transition-all duration-200 hover:scale-105
											bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
										>
											Kill
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

		{:else if activeTab === 'performance'}
			<!-- Performance Tab -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<!-- CPU History -->
				<div class="rounded-xl border p-4
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<h3 class="font-semibold mb-3 text-sm">CPU Usage History</h3>
					<div class="h-24 mb-3 {isDarkTheme ? 'text-blue-400' : 'text-blue-600'}">
						{@html renderChart(cpuHistory, 'blue')}
					</div>
					<div class="flex justify-between text-xs opacity-70">
						<span>0%</span>
						<span>Current: {systemMetrics.cpu.usage.toFixed(1)}%</span>
						<span>100%</span>
					</div>
				</div>

				<!-- Memory History -->
				<div class="rounded-xl border p-4
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<h3 class="font-semibold mb-3 text-sm">Memory Usage History</h3>
					<div class="h-24 mb-3 {isDarkTheme ? 'text-green-400' : 'text-green-600'}">
						{@html renderChart(memoryHistory, 'green')}
					</div>
					<div class="flex justify-between text-xs opacity-70">
						<span>0%</span>
						<span>Current: {((systemMetrics.memory.used / systemMetrics.memory.total) * 100).toFixed(1)}%</span>
						<span>100%</span>
					</div>
				</div>

				<!-- GPU Usage -->
				<div class="rounded-xl border p-4
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<h3 class="font-semibold mb-3 text-sm">GPU Usage</h3>
					<div class="space-y-3">
						<div>
							<div class="flex justify-between mb-2">
								<span class="text-xs">GPU Usage</span>
								<span class="font-bold {getUsageColor(systemMetrics.gpu.usage)} text-xs">{systemMetrics.gpu.usage}%</span>
							</div>
							<div class="w-full bg-neutral-300 dark:bg-neutral-600 rounded-full h-1.5">
								<div 
									class="bg-gradient-to-r {getUsageBarColor(systemMetrics.gpu.usage)} h-1.5 rounded-full transition-all duration-300" 
									style="width: {systemMetrics.gpu.usage}%"
								></div>
							</div>
						</div>
						<div>
							<div class="flex justify-between mb-2">
								<span class="text-xs">VRAM Usage</span>
								<span class="font-bold text-xs">{formatBytes(systemMetrics.gpu.memoryUsed * 1024 * 1024)} / {formatBytes(systemMetrics.gpu.memory * 1024 * 1024)}</span>
							</div>
							<div class="w-full bg-neutral-300 dark:bg-neutral-600 rounded-full h-1.5">
								<div 
									class="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-300" 
									style="width: {(systemMetrics.gpu.memoryUsed / systemMetrics.gpu.memory) * 100}%"
								></div>
							</div>
						</div>
						<div class="text-xs opacity-70">
							Temperature: {systemMetrics.gpu.temperature}°C
						</div>
					</div>
				</div>

				<!-- Disk I/O -->
				<div class="rounded-xl border p-4
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<h3 class="font-semibold mb-3 text-sm">Disk I/O</h3>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-xs">Read Speed</span>
							<span class="font-bold text-green-500 text-xs">{formatBytes(systemMetrics.disk.readSpeed * 1024 * 1024)}/s</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-xs">Write Speed</span>
							<span class="font-bold text-blue-500 text-xs">{formatBytes(systemMetrics.disk.writeSpeed * 1024 * 1024)}/s</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-xs">Free Space</span>
							<span class="font-bold text-xs">{formatBytes(systemMetrics.disk.free * 1024 * 1024)}</span>
						</div>
					</div>
				</div>
			</div>

		{:else if activeTab === 'network'}
			<!-- Network Tab -->
			<div class="space-y-4">
				<!-- Network Speed Chart -->
				<div class="rounded-xl border p-4
				{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
					<h3 class="font-semibold mb-3 text-sm">Network Activity</h3>
					<div class="h-32 mb-3">
						<!-- Network chart would go here -->
						<div class="flex items-end justify-between h-full space-x-1">
							{#each networkHistory.slice(-20) as point, i}
								<div class="flex flex-col justify-end space-y-1 flex-1">
									<div 
										class="bg-green-500 rounded-t"
										style="height: {(point.download / 2000) * 60}px; min-height: 2px;"
										title="Download: {formatBytes(point.download)}/s"
									></div>
									<div 
										class="bg-blue-500 rounded-t"
										style="height: {(point.upload / 1000) * 40}px; min-height: 2px;"
										title="Upload: {formatBytes(point.upload)}/s"
									></div>
								</div>
							{/each}
						</div>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="flex items-center space-x-1">
								<div class="w-2 h-2 bg-green-500 rounded"></div>
								<span class="text-xs">Download</span>
							</div>
							<div class="flex items-center space-x-1">
								<div class="w-2 h-2 bg-blue-500 rounded"></div>
								<span class="text-xs">Upload</span>
							</div>
						</div>
						<div class="text-xs opacity-70">Last 20 data points</div>
					</div>
				</div>

				<!-- Network Statistics -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="rounded-xl border p-4
					{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
						<h3 class="font-semibold mb-3 text-sm">Current Speed</h3>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">Download:</span>
								<span class="font-bold text-green-500 text-xs">{formatBytes(systemMetrics.network.downloadSpeed)}/s</span>
							</div>
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">Upload:</span>
								<span class="font-bold text-blue-500 text-xs">{formatBytes(systemMetrics.network.uploadSpeed)}/s</span>
							</div>
							<hr class="border-neutral-300 dark:border-neutral-600" />
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">Total Downloaded:</span>
								<span class="font-medium text-xs">{systemMetrics.network.totalDownload} GB</span>
							</div>
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">Total Uploaded:</span>
								<span class="font-medium text-xs">{systemMetrics.network.totalUpload} GB</span>
							</div>
						</div>
					</div>

					<div class="rounded-xl border p-4
					{isDarkTheme ? 'bg-neutral-800/60 border-neutral-600' : 'bg-white/60 border-neutral-200'}">
						<h3 class="font-semibold mb-3 text-sm">Connection Info</h3>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">Interface:</span>
								<span class="font-medium text-xs">wlan0</span>
							</div>
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">IP Address:</span>
								<span class="font-medium text-xs">192.168.1.100</span>
							</div>
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">Gateway:</span>
								<span class="font-medium text-xs">192.168.1.1</span>
							</div>
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">DNS:</span>
								<span class="font-medium text-xs">8.8.8.8</span>
							</div>
							<div class="flex justify-between">
								<span class="opacity-70 text-xs">Status:</span>
								<span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
									Connected
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>