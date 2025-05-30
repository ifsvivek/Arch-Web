<script>
	let history = $state([
		{ type: 'output', content: 'Arch Linux Terminal Simulator' },
		{ type: 'output', content: 'Type "help" for available commands' },
		{ type: 'output', content: '' }
	]);
	let currentInput = $state('');
	let commandHistory = $state([]);
	let historyIndex = $state(-1);
	let terminalElement;

	const commands = {
		help: () => [
			'Available commands:',
			'  help          - Show this help message',
			'  clear         - Clear the terminal',
			'  ls            - List directory contents',
			'  pwd           - Show current directory',
			'  whoami        - Show current user',
			'  date          - Show current date and time',
			'  neofetch      - Show system information',
			'  echo [text]   - Echo text back',
			'  cat [file]    - Display file contents',
			'  uname         - Show system information',
			'  uptime        - Show system uptime'
		],
		clear: () => {
			history = [];
			return [];
		},
		ls: () => [
			'Documents  Downloads  Pictures  Music  Videos',
			'Desktop    Projects   .bashrc   .config'
		],
		pwd: () => ['/home/archuser'],
		whoami: () => ['archuser'],
		date: () => [new Date().toString()],
		neofetch: () => [
			'                   -`                    archuser@archlinux',
			'                  .o+`                   ------------------',
			'                 `ooo/                   OS: Arch Linux x86_64',
			'                `+oooo:                  Host: Desktop Simulator',
			'               `+oooooo:                 Kernel: 6.1.0-arch1-1',
			'               -+oooooo+:                Uptime: 2 hours, 43 mins',
			'             `/:-:++oooo+:               Packages: 1337 (pacman)',
			'            `/++++/+++++++:              Shell: bash 5.1.16',
			'           `/++++++++++++++:             Resolution: 1920x1080',
			'          `/+++ooooooooo+++/             DE: GNOME 43.0',
			'         ./ooosssso++osssssso+`          WM: Mutter',
			'        .oossssso-````/ossssss+`         Terminal: gnome-terminal',
			'       -osssssso.      :ssssssso.        CPU: Intel i7-12700K',
			'      :osssssss/        osssso+++.       GPU: NVIDIA RTX 3080',
			'     /ossssssss/        +ssssooo/-       Memory: 32GB'
		],
		echo: (args) => [args.join(' ')],
		cat: (args) => {
			const filename = args[0];
			if (!filename) return ['cat: missing operand'];

			const files = {
				'.bashrc': [
					'# ~/.bashrc',
					'',
					"# If not running interactively, don't do anything",
					'[[ $- != *i* ]] && return',
					'',
					"alias ls='ls --color=auto'",
					"PS1='[\\u@\\h \\W]\\$ '"
				],
				'README.md': [
					'# Arch Linux Desktop Simulator',
					'',
					'A Gnome-like desktop environment simulator built with Svelte 5.',
					'',
					'## Features',
					'- Window management',
					'- Built-in applications',
					'- Terminal emulator',
					'- File explorer'
				]
			};

			return files[filename] || [`cat: ${filename}: No such file or directory`];
		},
		uname: () => ['Linux archlinux 6.1.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'],
		uptime: () => [' 14:32:15 up  2:43,  1 user,  load average: 0.15, 0.25, 0.20']
	};

	function executeCommand(input) {
		const trimmed = input.trim();
		if (!trimmed) return;

		// Add to command history
		commandHistory.push(trimmed);
		if (commandHistory.length > 100) commandHistory.shift();
		historyIndex = -1;

		// Add command to history display
		history.push({ type: 'command', content: `[archuser@archlinux ~]$ ${trimmed}` });

		// Parse command and arguments
		const parts = trimmed.split(' ');
		const command = parts[0];
		const args = parts.slice(1);

		// Execute command
		if (commands[command]) {
			const output = commands[command](args);
			output.forEach((line) => {
				history.push({ type: 'output', content: line });
			});
		} else {
			history.push({ type: 'error', content: `bash: ${command}: command not found` });
		}

		// Scroll to bottom
		setTimeout(() => {
			if (terminalElement) {
				terminalElement.scrollTop = terminalElement.scrollHeight;
			}
		}, 0);
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			executeCommand(currentInput);
			currentInput = '';
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				currentInput = commandHistory[commandHistory.length - 1 - historyIndex];
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				currentInput = commandHistory[commandHistory.length - 1 - historyIndex];
			} else {
				historyIndex = -1;
				currentInput = '';
			}
		}
	}
</script>

<div class="flex h-full flex-col overflow-hidden bg-gray-900 font-mono text-sm text-green-400">
	<div bind:this={terminalElement} class="flex-1 overflow-y-auto scroll-smooth p-4">
		{#each history as entry}
			<div
				class="mb-1 {entry.type === 'command'
					? 'text-cyan-400'
					: entry.type === 'error'
						? 'text-red-400'
						: 'text-green-400'} whitespace-pre-line"
			>
				{entry.content}
			</div>
		{/each}

		<!-- Current input line -->
		<div class="flex">
			<span class="text-cyan-400">[archuser@archlinux ~]$ </span>
			<input
				bind:value={currentInput}
				onkeydown={handleKeydown}
				class="ml-1 flex-1 bg-transparent text-green-400 caret-green-400 outline-none"
				autofocus
			/>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for terminal */
	div::-webkit-scrollbar {
		width: 8px;
	}

	div::-webkit-scrollbar-track {
		background: #1f2937;
	}

	div::-webkit-scrollbar-thumb {
		background: #4b5563;
		border-radius: 4px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background: #6b7280;
	}
</style>
