<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

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
			'  whoami   - Show current user',
			'  neofetch - Display system information',
			'  cal      - Display calendar',
			'  ps       - Report process status',
			'  df       - Report file system disk space usage',
			'  free     - Display amount of free and used memory',
			'  ip       - Show network information',
			'  uptime   - Tell how long the system has been running',
			'  pacman   - Package manager utility',
			'  history  - Show command history',
			'  htop     - Interactive process viewer',
			'  top      - Display system tasks and resource usage',
			'  grep     - Search for patterns in text',
			'  find     - Search for files in a directory hierarchy',
			'  nano     - Open a text editor',
			'  cat      - Display file contents',
			'  vim      - Open Vim text editor',
			'  git      - Git version control commands'
		],
		clear: () => {
			history = [];
			return [];
		},
		date: () => [new Date().toString()],
		uname: () => ['Linux archsim 6.14.7-arch2-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'],
		ls: () => ['Documents  Downloads  Music  Pictures  Videos', 'Desktop    Public     Templates'],
		pwd: () => ['/home/user'],
		whoami: () => ['user'],
		echo: (args) => [args.join(' ')],
		neofetch: () => [
			'                  -`                     ifsvivek@omen15',
			'                 .o+`                    ---------------',
			'                `ooo/                    OS: Arch Linux x86_64',
			'               `+oooo:                   Host: OMEN Laptop 15-en1xxx',
			'              `+oooooo:                  Kernel: Linux 6.14.7-arch2-1',
			'              -+oooooo+:                 Uptime: 3 hours, 10 mins',
			'            `/:-:++oooo+:                Packages: 1224 (pacman), 8 (flatpak)',
			'           `/++++/+++++++:               Shell: fish 4.0.2',
			'          `/++++++++++++++:              Display (AUO82ED): 1920x1080 @ 144 Hz in 15" [Built-in]',
			'         `/+++ooooooooooooo/`            WM: Hyprland 0.49.0 (Wayland)',
			'        ./ooosssso++osssssso+`           Cursor: Adwaita',
			'       .oossssso-````/ossssss+`          Terminal: foot 1.22.3',
			'      -osssssso.      :ssssssso.         Terminal Font: SpaceMono Nerd Font (11pt)',
			'     :osssssss/        osssso+++.        CPU: AMD Ryzen 7 5800H (16) @ 4.46 GHz',
			'    /ossssssss/        +ssssooo/-        GPU 1: NVIDIA GeForce RTX 3060 Mobile / Max-Q [Discrete]',
			'  `/ossssso+/:-        -:/+osssso+-      GPU 2: AMD Radeon Vega Series / Radeon Vega Mobile Series',
			' `+sso+:-`                 `.-/+oso:     Memory: 8.83 GiB / 22.82 GiB (39%)',
			'`++:.                           `-/+/    Swap: 0 B / 20.00 GiB (0%)',
			'.`                                 `/    Disk (/): 85.06 GiB / 250.92 GiB (34%) - ext4'
		],

		cal: () => {
			const now = new Date();
			const month = now.toLocaleString('default', { month: 'long' });
			const year = now.getFullYear();
			return [
				`      ${month} ${year}`,
				'Mo Tu We Th Fr Sa Su',
				' 1  2  3  4  5  6  7',
				' 8  9 10 11 12 13 14',
				'15 16 17 18 19 20 21',
				'22 23 24 25 26 27 28',
				'29 30 31'
			];
		},
		ps: () => [
			'  PID TTY          TIME CMD',
			'  123 pts/0    00:00:01 bash',
			'  456 pts/0    00:00:00 firefox',
			' 1024 pts/0    00:02:13 hyprland',
			' 2048 pts/1    00:00:05 fish'
		],
		df: () => [
			'Filesystem     Size    Used   Avail  Use%   Mounted on',
			'/dev/nvme0n1p2 250G    85G    153G   34%    /',
			'/dev/nvme0n1p1 512M    135M   377M   26%    /boot'
		],
		free: () => [
			'               total        used        free      shared   buff/cache   available',
			'Mem:           22.8G        8.8G        5.3G        1.2G        8.7G       12.1G',
			'Swap:          20.0G        0.0G       20.0G'
		],
		ip: () => [
			'1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN',
			'    inet 127.0.0.1/8 scope host lo',
			'2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP',
			'    inet 192.168.1.37/24 brd 192.168.1.255 scope global dynamic noprefixroute wlan0'
		],
		uptime: () => {
			const now = new Date();
			const hours = now.getHours();
			const minutes = now.getMinutes();
			return [
				`${hours}:${minutes.toString().padStart(2, '0')} up 3:10, 1 user, load average: 0.52, 0.58, 0.59`
			];
		},
		pacman: (args) => {
			if (args.length === 0) {
				return ['pacman: no operation specified (use -h for help)'];
			}
			if (args[0] === '-Syu') {
				return [
					':: Synchronizing package databases...',
					'core is up to date',
					'extra is up to date',
					'community is up to date',
					'multilib is up to date',
					':: Starting full system upgrade...',
					'there is nothing to do'
				];
			}
			if (args[0] === '-S' && args[1]) {
				return [`installing ${args[1]}...`, 'done!'];
			}
			return ['Use -h for help'];
		},
		history: () => {
			const commands = history
				.filter((line) => line.includes('user@archsim:~$'))
				.map((line) => line.split('$ ')[1]);
			return commands.filter((cmd) => cmd && cmd.trim() !== '');
		},
		htop: () => [
			'╔════════════════════════════════════════════════════════════════════════════════════════════════╗',
			'║ CPU[||||||||||||||||||||||||                            12.0%]  Tasks: 64, 1 running           ║',
			'║ Mem[|||||||||||||||||||||||||||||||||||               3.1G/22.8G]  Load average: 0.52 0.58 0.59║',
			'║ Swp[                                                   0K/20.0G]  Uptime: 3:10                 ║',
			'╚════════════════════════════════════════════════════════════════════════════════════════════════╝',
			'   PID USER     PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command                           ',
			' 1087 user       20   0  5.9G  315M  166M S 12.0  1.4  0:23.01 /usr/lib/firefox/firefox         ',
			' 1204 user       20   0  4.5G  234M  102M S  0.0  1.0  0:10.25 /usr/bin/gnome-shell             ',
			' 2345 user       20   0  682M   67M   42M S  0.0  0.3  0:05.12 /usr/bin/Hyprland                ',
			' 3456 user       20   0  234M   45M   23M S  0.0  0.2  0:03.45 /usr/bin/foot                    ',
			' 5678 user       20   0  187M   24M   15M S  0.0  0.1  0:01.22 /usr/bin/waybar                  ',
			' Press q to quit'
		],
		top: () => [
			'top - ' +
				new Date().toTimeString().slice(0, 8) +
				' up  3:10,  1 user,  load average: 0.52, 0.58, 0.59',
			'Tasks:  64 total,   1 running,  63 sleeping,   0 stopped,   0 zombie',
			'%Cpu(s): 12.0 us,  3.5 sy,  0.0 ni, 84.0 id,  0.5 wa,  0.0 hi,  0.0 si,  0.0 st',
			'MiB Mem :  22820.8 total,  13412.5 free,   3180.6 used,   6227.7 buff/cache',
			'MiB Swap:  20480.0 total,  20480.0 free,      0.0 used.  19140.2 avail Mem',
			'',
			'  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
			' 1087 user      20   0 5862740 322448 170644 S  12.0   1.4   0:23.01 firefox',
			' 1204 user      20   0 4612548 239616 104828 S   0.0   1.0   0:10.25 gnome-shell',
			' 2345 user      20   0  698284  68836  43516 S   0.0   0.3   0:05.12 Hyprland',
			' 3456 user      20   0  240246  46080  23592 S   0.0   0.2   0:03.45 foot',
			' 5678 user      20   0  191692  24576  15360 S   0.0   0.1   0:01.22 waybar',
			'Press q to quit'
		],
		grep: (args) => {
			if (args.length < 2) return ['grep: missing pattern and input file'];
			const pattern = args[0];
			const text = args.slice(1).join(' ');
			const lines = text.split('\n');
			const matches = lines.filter((line) => line.includes(pattern));
			return matches.length > 0 ? matches : ['No matches found'];
		},
		find: (args) => {
			if (args.length === 0) return ['find: missing path argument'];
			const path = args[0];
			return [
				`${path}/Documents`,
				`${path}/Documents/notes.txt`,
				`${path}/Documents/work`,
				`${path}/Documents/work/project.js`,
				`${path}/Pictures`,
				`${path}/Pictures/screenshot.png`,
				`${path}/Videos/tutorial.mp4`
			];
		},
		nano: (args) => {
			const filename = args.length > 0 ? args[0] : 'untitled.txt';
			return [
				`  GNU nano 7.2                     ${filename}                                `,
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'[ New File ]',
				'^G Help    ^O Write Out ^W Where Is  ^K Cut      ^T Execute   ^C Location',
				'^X Exit    ^R Read File ^\ Replace   ^U Paste    ^J Justify   ^/ Go To Line'
			];
		},
		cat: (args) => {
			if (args.length === 0) return ['cat: missing file operand'];

			const fileContents = {
				'readme.txt': [
					'# Arch Linux',
					'Welcome to Arch Linux!',
					'',
					'Arch Linux is an independently developed, x86_64-optimized Linux distribution',
					'targeted at competent Linux users. It uses pacman, its home-grown package',
					'manager, to provide updates to the latest software applications with full',
					'dependency tracking.',
					'',
					'Visit https://archlinux.org for more information.'
				],
				'notes.txt': [
					'TODO:',
					'- Update system packages',
					'- Configure neovim',
					'- Set up git credentials',
					'- Finish project documentation'
				]
			};

			return fileContents[args[0]] || [`cat: ${args[0]}: No such file or directory`];
		},
		vim: () => [
			'~',
			'~                               VIM - Vi IMproved                              ',
			'~',
			'~                                 version 9.0                                  ',
			'~                           by Bram Moolenaar et al.                           ',
			'~',
			'~                     Vim is open source and freely distributable              ',
			'~',
			'~                            Type :q<Enter> to exit                            ',
			'~                      Type :help<Enter> for online help                       ',
			'                                                                           '
		],
		git: (args) => {
			if (args.length === 0)
				return [
					'usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]',
					'[--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]',
					'[-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]',
					'[--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]',
					'<command> [<args>]'
				];

			switch (args[0]) {
				case 'status':
					return [
						'On branch main',
						"Your branch is up to date with 'origin/main'.",
						'',
						'Changes not staged for commit:',
						'  (use "git add <file>..." to update what will be committed)',
						'  (use "git restore <file>..." to discard changes in working directory)',
						'        modified:   src/main.js',
						'',
						'Untracked files:',
						'  (use "git add <file>..." to include in what will be committed)',
						'        src/new-feature.js',
						'',
						'no changes added to commit (use "git add" and/or "git commit -a")'
					];
				case 'log':
					return [
						'commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
						'Author: User <user@example.com>',
						'Date:   ' + new Date().toUTCString(),
						'',
						'    Add new feature implementation',
						'',
						'commit b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
						'Author: User <user@example.com>',
						'Date:   ' + new Date(Date.now() - 86400000).toUTCString(),
						'',
						'    Fix bug in authentication module',
						'',
						'commit c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
						'Author: User <user@example.com>',
						'Date:   ' + new Date(Date.now() - 172800000).toUTCString(),
						'',
						'    Initial commit'
					];
				default:
					return [`git: '${args[0]}' is not a git command. See 'git --help'.`];
			}
		}
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

	// Reactive theme-based classes
	const headerClasses = $derived(() => {
		const baseClasses = 'p-4 text-white border-b';
		const themeClasses =
			desktopState.currentTheme === 'light'
				? 'bg-gray-800/90 border-gray-700/50'
				: 'bg-gray-900/90 border-gray-700/50';
		return `${baseClasses} ${themeClasses}`;
	});
</script>

<div class="flex h-full flex-col overflow-hidden">
	<!-- Header -->
	<div class={headerClasses()}>
		<h1 class="text-lg font-semibold">Terminal</h1>
		<div class="mt-1 text-sm text-gray-300">Arch Linux Terminal Simulator</div>
	</div>

	<!-- Terminal Window -->
	<div
		class="flex-1 overflow-hidden font-mono text-sm"
		class:bg-black={desktopState.currentTheme === 'dark'}
		class:bg-gray-900={desktopState.currentTheme === 'light'}
	>
		<div
			class="h-full space-y-1 overflow-auto p-4"
			class:text-green-400={desktopState.currentTheme === 'dark'}
			class:text-green-500={desktopState.currentTheme === 'light'}
		>
			{#each history as line}
				<div class="whitespace-pre-wrap backdrop-blur-sm">{line}</div>
			{/each}

			<!-- Input Line -->
			<div class="flex items-center">
				<span
					class:text-blue-400={desktopState.currentTheme === 'dark'}
					class:text-blue-500={desktopState.currentTheme === 'light'}>user@archsim:~$</span
				>
				<input
					bind:this={inputElement}
					bind:value={currentInput}
					onkeydown={handleKeydown}
					class="ml-1 flex-1 bg-transparent outline-none"
					class:text-green-400={desktopState.currentTheme === 'dark'}
					class:text-green-500={desktopState.currentTheme === 'light'}
					class:caret-green-400={desktopState.currentTheme === 'dark'}
					class:caret-green-500={desktopState.currentTheme === 'light'}
					autofocus
				/>
			</div>
		</div>
	</div>
</div>
