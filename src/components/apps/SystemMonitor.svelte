<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/components/apps/SystemMonitor.svelte -->
<script>
	let cpuUsage = $state(0);
	let memoryUsage = $state(0);
	let diskUsage = $state(0);
	let networkUp = $state(0);
	let networkDown = $state(0);
	let processes = $state([]);
	let uptime = $state(0);

	// Simulate system data
	function generateSystemData() {
		cpuUsage = Math.max(0, Math.min(100, cpuUsage + (Math.random() * 10 - 5)));
		memoryUsage = Math.max(40, Math.min(80, memoryUsage + (Math.random() * 6 - 3)));
		diskUsage = Math.max(60, Math.min(85, diskUsage + (Math.random() * 2 - 1)));
		networkUp = Math.max(0, networkUp + (Math.random() * 200 - 100));
		networkDown = Math.max(0, networkDown + (Math.random() * 400 - 200));
		uptime += 1;

		// Generate process list
		const processNames = [
			'firefox',
			'gnome-shell',
			'systemd',
			'kworker',
			'Xorg',
			'pulseaudio',
			'networkmanager',
			'dbus',
			'chrome',
			'code'
		];
		processes = processNames
			.map((name, i) => {
				const prevProcess = processes.find(p => p.name === name) || {};
				return {
					pid: 1000 + i,
					name,
					cpu: Math.max(0, Math.min(15, (prevProcess.cpu || Math.random() * 15) + (Math.random() * 4 - 2))),
					memory: Math.max(0, Math.min(512, (prevProcess.memory || Math.random() * 512) + (Math.random() * 50 - 25))),
					status: Math.random() > 0.05 ? (prevProcess.status || 'Running') : 'Sleeping'
				};
			})
			.sort((a, b) => b.cpu - a.cpu);
	}

	// Update every 2 seconds
	let interval = setInterval(generateSystemData, 2000);
	generateSystemData(); // Initial data

	// Cleanup
	function cleanup() {
		if (interval) clearInterval(interval);
	}

	function formatBytes(bytes) {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	function formatUptime(seconds) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	}

	function killProcess(pid) {
		processes = processes.filter((p) => p.pid !== pid);
	}

	// Cleanup on component destroy
	$effect(() => {
		return cleanup;
	});
</script>

<div class="h-full overflow-hidden bg-white">
	<!-- Header -->
	<div class="bg-gray-800 p-4 text-white">
		<h1 class="text-lg font-semibold">System Monitor</h1>
		<div class="mt-1 text-sm text-gray-300">
			Uptime: {formatUptime(uptime)} | Load: {((cpuUsage / 100) * 4).toFixed(2)}
		</div>
	</div>

	<div class="flex h-full">
		<!-- System Overview -->
		<div class="w-1/3 overflow-y-auto border-r border-gray-200 p-4">
			<h2 class="mb-4 text-lg font-semibold">System Resources</h2>

			<!-- CPU Usage -->
			<div class="mb-6">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-medium">CPU Usage</span>
					<span class="text-sm text-gray-600">{cpuUsage.toFixed(1)}%</span>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div
						class="h-2 rounded-full bg-blue-500 transition-all duration-500"
						style="width: {cpuUsage}%"
					></div>
				</div>
			</div>

			<!-- Memory Usage -->
			<div class="mb-6">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-medium">Memory</span>
					<span class="text-sm text-gray-600">{memoryUsage.toFixed(1)}%</span>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div
						class="h-2 rounded-full bg-green-500 transition-all duration-500"
						style="width: {memoryUsage}%"
					></div>
				</div>
				<div class="mt-1 text-xs text-gray-500">
					{formatBytes(memoryUsage * 32)} / {formatBytes(3200)} (32GB)
				</div>
			</div>

			<!-- Disk Usage -->
			<div class="mb-6">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm font-medium">Disk (/)</span>
					<span class="text-sm text-gray-600">{diskUsage.toFixed(1)}%</span>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div
						class="h-2 rounded-full bg-yellow-500 transition-all duration-500"
						style="width: {diskUsage}%"
					></div>
				</div>
				<div class="mt-1 text-xs text-gray-500">
					{formatBytes(diskUsage * 10)} / {formatBytes(1000)} (1TB)
				</div>
			</div>

			<!-- Network -->
			<div class="mb-6">
				<div class="mb-2 text-sm font-medium">Network</div>
				<div class="space-y-2">
					<div class="flex justify-between">
						<span class="text-xs text-gray-600">↑ Upload</span>
						<span class="text-xs">{formatBytes(networkUp)}/s</span>
					</div>
					<div class="flex justify-between">
						<span class="text-xs text-gray-600">↓ Download</span>
						<span class="text-xs">{formatBytes(networkDown)}/s</span>
					</div>
				</div>
			</div>

			<!-- System Info -->
			<div class="rounded bg-gray-50 p-3">
				<div class="mb-2 text-sm font-medium">System Info</div>
				<div class="space-y-1 text-xs text-gray-600">
					<div>OS: Arch Linux x86_64</div>
					<div>Host: OMEN Laptop 15-en1xxx</div>
					<div>Kernel: Linux 6.14.7-arch2-1</div>
					<div>Shell: fish 4.0.2</div>
					<div>WM: Hyprland 0.49.0</div>
					<div>CPU: AMD Ryzen 7 5800H (16) @ 4.46 GHz</div>
					<div>GPU: NVIDIA RTX 3060 Mobile</div>
					<div>Memory: 22.82 GiB</div>
				</div>
			</div>
		</div>

		<!-- Process List -->
		<div class="flex flex-1 flex-col">
			<div class="border-b border-gray-200 p-4">
				<h2 class="text-lg font-semibold">Processes</h2>
				<div class="text-sm text-gray-600">{processes.length} processes running</div>
			</div>

			<div class="flex-1 overflow-auto">
				<table class="w-full text-sm">
					<thead class="sticky top-0 bg-gray-50">
						<tr>
							<th class="p-2 text-left font-medium">PID</th>
							<th class="p-2 text-left font-medium">Name</th>
							<th class="p-2 text-left font-medium">CPU%</th>
							<th class="p-2 text-left font-medium">Memory</th>
							<th class="p-2 text-left font-medium">Status</th>
							<th class="p-2 text-left font-medium">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each processes as process}
							<tr class="border-b border-gray-100 hover:bg-gray-50">
								<td class="p-2 font-mono text-xs">{process.pid}</td>
								<td class="p-2">{process.name}</td>
								<td class="p-2">
									<div class="flex items-center">
										<span class="mr-2">{process.cpu.toFixed(1)}%</span>
										<div class="h-1 w-12 rounded-full bg-gray-200">
											<div
												class="h-1 rounded-full bg-blue-400"
												style="width: {Math.min(process.cpu * 2, 100)}%"
											></div>
										</div>
									</div>
								</td>
								<td class="p-2">{formatBytes(process.memory * 1024 * 1024)}</td>
								<td class="p-2">
									<span
										class="rounded px-2 py-1 text-xs {process.status === 'Running'
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'}"
									>
										{process.status}
									</span>
								</td>
								<td class="p-2">
									<button
										onclick={() => killProcess(process.pid)}
										class="rounded bg-red-100 px-2 py-1 text-xs text-red-800 transition-colors hover:bg-red-200"
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
	</div>
</div>
