<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/apps/Terminal.svelte -->
<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let commandHistory = $state([]);
	let historyIndex = $state(-1);
	let currentCommand = $state('');
	let currentDirectory = $state('/home/user');
	let isRunning = $state(false);
	let terminalRef = $state();
	let inputRef = $state();

	// Terminal session state
	let sessionLog = $state([
		{ type: 'system', content: 'Welcome to Arch Linux Terminal', timestamp: new Date() },
		{ type: 'prompt', content: `user@archlinux:${currentDirectory}$ `, timestamp: new Date() }
	]);

	// Built-in commands
	const builtinCommands = {
		help: () => [
			'Available commands:',
			'  help          - Show this help message',
			'  clear         - Clear the terminal',
			'  ls            - List directory contents',
			'  pwd           - Print working directory',
			'  cd [dir]      - Change directory',
			'  mkdir [dir]   - Create directory',
			'  echo [text]   - Display text',
			'  date          - Show current date and time',
			'  whoami        - Show current user',
			'  uname         - Show system information',
			'  ps            - Show running processes',
			'  top           - Show system stats',
			'  history       - Show command history',
			'  neofetch      - Show system info with ASCII art'
		],
		clear: () => {
			sessionLog = [
				{ type: 'prompt', content: `user@archlinux:${currentDirectory}$ `, timestamp: new Date() }
			];
			return [];
		},
		ls: () => [
			'total 24',
			'drwxr-xr-x  2 user user 4096 Jan 15 10:30 Desktop',
			'drwxr-xr-x  2 user user 4096 Jan 15 10:30 Documents',
			'drwxr-xr-x  2 user user 4096 Jan 15 10:30 Downloads',
			'drwxr-xr-x  2 user user 4096 Jan 15 10:30 Music',
			'drwxr-xr-x  2 user user 4096 Jan 15 10:30 Pictures',
			'drwxr-xr-x  2 user user 4096 Jan 15 10:30 Videos',
			'-rw-r--r--  1 user user  220 Jan 15 10:30 .bashrc',
			'-rw-r--r--  1 user user  807 Jan 15 10:30 .profile'
		],
		pwd: () => [currentDirectory],
		cd: (args) => {
			const target = args[0] || '/home/user';
			if (target === '..') {
				const parts = currentDirectory.split('/').filter((p) => p);
				if (parts.length > 2) {
					currentDirectory = '/' + parts.slice(0, -1).join('/');
				}
			} else if (target.startsWith('/')) {
				currentDirectory = target;
			} else {
				currentDirectory = currentDirectory.endsWith('/')
					? currentDirectory + target
					: currentDirectory + '/' + target;
			}
			return [`Changed directory to ${currentDirectory}`];
		},
		mkdir: (args) =>
			args.length > 0 ? [`Created directory: ${args.join(' ')}`] : ['mkdir: missing operand'],
		echo: (args) => [args.join(' ')],
		date: () => [new Date().toString()],
		whoami: () => ['user'],
		uname: () => [
			'Linux archlinux 6.6.8-arch1-1 #1 SMP PREEMPT_DYNAMIC Mon, 18 Dec 2023 22:58:56 +0000 x86_64 GNU/Linux'
		],
		ps: () => [
			'  PID TTY          TIME CMD',
			' 1234 pts/0    00:00:01 bash',
			' 5678 pts/0    00:00:00 terminal',
			' 9012 pts/0    00:00:00 ps'
		],
		top: () => [
			'Tasks: 156 total,   1 running, 155 sleeping',
			'%Cpu(s):  2.1 us,  0.8 sy,  0.0 ni, 97.0 id,  0.1 wa',
			'MiB Mem :   8192.0 total,   6234.2 free,   1234.5 used,    723.3 buff/cache',
			'MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   6512.3 avail Mem',
			'',
			'  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
			' 1234 user      20   0  123456   1234    567 S   1.2   0.1   0:01.23 bash'
		],
		history: () => commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`),
		neofetch: () => [
			'                   -`                    user@archlinux',
			'                  .o+`                   ---------------',
			'                 `ooo/                   OS: Arch Linux x86_64',
			'                `+oooo:                  Host: Virtual Machine',
			'               `+oooooo:                 Kernel: 6.6.8-arch1-1',
			'               -+oooooo+:                Uptime: 2 hours, 34 mins',
			'             `/:-:++oooo+:               Packages: 1247 (pacman)',
			'            `/++++/+++++++:              Shell: bash 5.2.15',
			'           `/++++++++++++++:             Resolution: 1920x1080',
			'          `/+++ooooooooo+++/`            WM: Web Desktop',
			'         ./ooosssso++osssssso+`          Theme: Arch Modern',
			'        .oossssso-````/ossssss+`         Icons: Arch Icons',
			'       -osssssso.      :ssssssso.        Terminal: Web Terminal',
			'      :osssssss/        osssso+++.       CPU: Virtual CPU (4) @ 2.4GHz',
			'     /ossssssss/        +ssssooo/-       Memory: 1234MiB / 8192MiB',
			'   `/ossssso+/:-        -:/+osssso+-     ',
			'  `+sso+:-`                 `.-/+oso:    ',
			' `++:.                           `-/+/   ',
			' .`                                 `/   '
		]
	};

	function executeCommand(command) {
		if (!command.trim()) return;

		isRunning = true;

		// Add command to history
		commandHistory = [...commandHistory, command];
		historyIndex = -1;

		// Add command to session log
		sessionLog = [...sessionLog, { type: 'command', content: command, timestamp: new Date() }];

		// Parse command
		const parts = command.trim().split(' ');
		const cmd = parts[0];
		const args = parts.slice(1);

		setTimeout(
			() => {
				let output = [];

				if (cmd in builtinCommands) {
					output = builtinCommands[cmd](args);
				} else {
					output = [`bash: ${cmd}: command not found`];
				}

				// Add output to session log
				if (output.length > 0) {
					sessionLog = [
						...sessionLog,
						...output.map((line) => ({ type: 'output', content: line, timestamp: new Date() }))
					];
				}

				// Add new prompt
				sessionLog = [
					...sessionLog,
					{ type: 'prompt', content: `user@archlinux:${currentDirectory}$ `, timestamp: new Date() }
				];

				isRunning = false;
				currentCommand = '';

				// Scroll to bottom
				setTimeout(() => {
					if (terminalRef) {
						terminalRef.scrollTop = terminalRef.scrollHeight;
					}
				}, 0);
			},
			Math.random() * 200 + 100
		); // Simulate command execution time
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			executeCommand(currentCommand);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				currentCommand = commandHistory[commandHistory.length - 1 - historyIndex];
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				currentCommand = commandHistory[commandHistory.length - 1 - historyIndex];
			} else if (historyIndex === 0) {
				historyIndex = -1;
				currentCommand = '';
			}
		} else if (event.key === 'Tab') {
			event.preventDefault();
			// Simple tab completion for commands
			const commands = Object.keys(builtinCommands);
			const matches = commands.filter((cmd) => cmd.startsWith(currentCommand));
			if (matches.length === 1) {
				currentCommand = matches[0];
			}
		}
	}

	function focusInput() {
		if (inputRef && !isRunning) {
			inputRef.focus();
		}
	}

	// Auto-focus input on mount
	$effect(() => {
		focusInput();
	});

	const isDark = $derived(desktopState.currentTheme === 'dark');

	const containerClasses = $derived(
		`h-full flex flex-col font-mono text-sm backdrop-blur-xl border ${
			isDark
				? 'bg-neutral-900/30 border-white/10 text-green-400'
				: 'bg-neutral-900/80 border-neutral-700/30 text-green-300'
		}`
	);

	const headerClasses = $derived(
		`px-4 py-2 border-b flex items-center justify-between ${
			isDark ? 'bg-neutral-800/50 border-white/10' : 'bg-neutral-800/70 border-neutral-700/50'
		}`
	);

	const terminalClasses = $derived(
		`flex-1 overflow-y-auto p-4 leading-relaxed ${
			isDark ? 'bg-neutral-900/20' : 'bg-neutral-900/60'
		}`
	);
</script>

<div class={containerClasses}>
	<!-- Terminal Content -->
	<div class={terminalClasses} bind:this={terminalRef} onclick={focusInput} tabindex="-1">
		{#each sessionLog as entry}
			<div class="flex items-start">
				{#if entry.type === 'system'}
					<div class="font-semibold text-blue-400">{entry.content}</div>
				{:else if entry.type === 'prompt'}
					<div class="font-semibold whitespace-pre text-cyan-400">{entry.content}</div>
					{#if entry === sessionLog[sessionLog.length - 1] && !isRunning}
						<div class="flex flex-1 items-center">
							<input
								bind:this={inputRef}
								bind:value={currentCommand}
								onkeydown={handleKeyDown}
								class="flex-1 bg-transparent text-green-400 caret-green-400 outline-none"
								autocomplete="off"
								spellcheck="false"
								disabled={isRunning}
							/>
							<span class="animate-pulse text-green-400">█</span>
						</div>
					{/if}
				{:else if entry.type === 'command'}
					<div class="text-green-400">{entry.content}</div>
				{:else if entry.type === 'output'}
					<div class="whitespace-pre text-neutral-300">{entry.content}</div>
				{/if}
			</div>
		{/each}

		{#if isRunning}
			<div class="flex items-center space-x-2 text-yellow-400">
				<div class="animate-spin">⟳</div>
				<span>Executing command...</span>
			</div>
		{/if}
	</div>

	<!-- Terminal Footer -->
	<div
		class="flex items-center justify-between border-t px-4 py-2 text-xs {isDark
			? 'border-white/10 bg-neutral-800/30'
			: 'border-neutral-700/50 bg-neutral-800/50'}"
	>
		<div class="flex items-center space-x-4">
			<span class="opacity-60">PWD: {currentDirectory}</span>
			<span class="opacity-60">History: {commandHistory.length}</span>
		</div>
		<div class="flex items-center space-x-2 text-xs opacity-60">
			<span>↑↓ History</span>
			<span>Tab Complete</span>
			<span>Ctrl+C Cancel</span>
		</div>
	</div>
</div>
