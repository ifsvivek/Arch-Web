<script>
	let history = $state([
		'Welcome to Arch Linux Terminal Simulator',
		'Type "help" for available commands',
		''
	]);
	let currentInput = $state('');
	let inputElement;

	const commands = {
		help: () => [
			'Available commands:',
			'  help     - Show this help message',
			'  clear    - Clear the terminal',
			'  date     - Show current date and time',
			'  uname    - Show system information',
			'  echo     - Echo text back',
			'  ls       - List directory contents',
			'  pwd      - Show current directory',
			'  whoami   - Show current user'
		],
		clear: () => {
			history = [];
			return [];
		},
		date: () => [new Date().toString()],
		uname: () => ['Linux archsim 6.6.8-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'],
		ls: () => [
			'Documents  Downloads  Music  Pictures  Videos',
			'Desktop    Public     Templates'
		],
		pwd: () => ['/home/user'],
		whoami: () => ['user'],
		echo: (args) => [args.join(' ')]
	};

	function executeCommand() {
		if (!currentInput.trim()) return;
		
		const fullCommand = `user@archsim:~$ ${currentInput}`;
		const parts = currentInput.trim().split(' ');
		const command = parts[0].toLowerCase();
		const args = parts.slice(1);
		
		history = [...history, fullCommand];
		
		if (commands[command]) {
			const output = commands[command](args);
			if (output && output.length > 0) {
				history = [...history, ...output];
			}
		} else {
			history = [...history, `bash: ${command}: command not found`];
		}
		
		history = [...history, ''];
		currentInput = '';
		
		// Scroll to bottom after command execution
		setTimeout(() => {
			if (inputElement) {
				inputElement.scrollIntoView({ behavior: 'smooth' });
			}
		}, 10);
	}

	function handleKeydown(e) {
		if (e.key === 'Enter') {
			executeCommand();
		}
	}
</script>

<div class="bg-black text-green-400 h-full flex flex-col font-mono text-sm">
	<!-- Terminal Output -->
	<div class="flex-1 overflow-auto p-4 space-y-1">
		{#each history as line}
			<div class="whitespace-pre-wrap">{line}</div>
		{/each}
		
		<!-- Input Line -->
		<div class="flex items-center">
			<span class="text-blue-400">user@archsim:~$</span>
			<input
				bind:this={inputElement}
				bind:value={currentInput}
				onkeydown={handleKeydown}
				class="bg-transparent text-green-400 outline-none flex-1 ml-1 caret-green-400"
				autofocus
			/>
		</div>
	</div>
</div>
