<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let display = $state('0');
	let previousValue = $state(null);
	let operation = $state(null);
	let waitingForOperand = $state(false);
	let history = $state([]);
	let showHistory = $state(false);
	let memory = $state(0);

	const isDarkTheme = $derived(desktopState.currentTheme === 'dark');

	function inputNumber(num) {
		if (waitingForOperand) {
			display = String(num);
			waitingForOperand = false;
		} else {
			display = display === '0' ? String(num) : display + num;
		}
	}

	function inputDot() {
		if (waitingForOperand) {
			display = '0.';
			waitingForOperand = false;
		} else if (display.indexOf('.') === -1) {
			display += '.';
		}
	}

	function clear() {
		display = '0';
		previousValue = null;
		operation = null;
		waitingForOperand = false;
	}

	function performOperation(nextOperation) {
		const inputValue = parseFloat(display);

		if (previousValue === null) {
			previousValue = inputValue;
		} else if (operation) {
			const currentValue = previousValue || 0;
			const newValue = calculate(currentValue, inputValue, operation);

			display = String(newValue);
			previousValue = newValue;
			
			// Add to history
			history = [...history, `${currentValue} ${operation} ${inputValue} = ${newValue}`].slice(-10);
		}

		waitingForOperand = true;
		operation = nextOperation;
	}

	function calculate(firstValue, secondValue, operation) {
		switch (operation) {
			case '+':
				return firstValue + secondValue;
			case '-':
				return firstValue - secondValue;
			case '×':
				return firstValue * secondValue;
			case '÷':
				return secondValue !== 0 ? firstValue / secondValue : 0;
			case '%':
				return firstValue % secondValue;
			default:
				return secondValue;
		}
	}

	function equals() {
		performOperation(null);
		operation = null;
		previousValue = null;
		waitingForOperand = true;
	}

	function percentage() {
		const value = parseFloat(display);
		display = String(value / 100);
	}

	function toggleSign() {
		if (display !== '0') {
			display = display.charAt(0) === '-' ? display.slice(1) : '-' + display;
		}
	}

	function sqrt() {
		const value = parseFloat(display);
		display = String(Math.sqrt(value));
		history = [...history, `√${value} = ${display}`].slice(-10);
	}

	function square() {
		const value = parseFloat(display);
		const result = value * value;
		display = String(result);
		history = [...history, `${value}² = ${result}`].slice(-10);
	}

	function memoryAdd() {
		memory += parseFloat(display);
	}

	function memoryClear() {
		memory = 0;
	}

	function memoryRecall() {
		display = String(memory);
	}

	const buttonClasses = $derived(
		`h-12 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm border ${
			isDarkTheme
				? 'bg-neutral-700/70 hover:bg-neutral-600/80 border-neutral-600/50 text-white'
				: 'bg-white/70 hover:bg-neutral-100/80 border-neutral-200/50 text-neutral-900'
		}`
	);

	const operatorButtonClasses = $derived(
		`h-12 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm border ${
			isDarkTheme
				? 'bg-blue-600/80 hover:bg-blue-500/90 border-blue-500/50 text-white'
				: 'bg-blue-500/80 hover:bg-blue-600/90 border-blue-400/50 text-white'
		}`
	);

	const clearButtonClasses = $derived(
		`h-12 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm border ${
			isDarkTheme
				? 'bg-red-600/80 hover:bg-red-500/90 border-red-500/50 text-white'
				: 'bg-red-500/80 hover:bg-red-600/90 border-red-400/50 text-white'
		}`
	);

	const displayClasses = $derived(
		`rounded-xl p-4 text-right text-3xl font-bold backdrop-blur-md border shadow-inner ${
			isDarkTheme
				? 'bg-neutral-800/60 border-neutral-600/50 text-white'
				: 'bg-white/60 border-neutral-200/50 text-neutral-900'
		}`
	);

	const historyClasses = $derived(
		`rounded-xl p-3 backdrop-blur-md border shadow-lg max-h-48 overflow-y-auto ${
			isDarkTheme
				? 'bg-neutral-800/60 border-neutral-600/50 text-white'
				: 'bg-white/60 border-neutral-200/50 text-neutral-900'
		}`
	);

	const memoryDisplayClasses = $derived(
		`text-xs font-medium px-2 py-1 rounded-md ${
			memory !== 0
				? isDarkTheme
					? 'bg-blue-600/80 text-white'
					: 'bg-blue-500/80 text-white'
				: isDarkTheme
				? 'bg-neutral-700/60 text-neutral-400'
				: 'bg-neutral-200/60 text-neutral-500'
		}`
	);
</script>

<div class="h-full p-4 space-y-4">
	<!-- Memory Indicator -->
	<div class="flex justify-between items-center">
		<div class={memoryDisplayClasses}>
			M: {memory}
		</div>
		<button
			class="text-sm px-3 py-1 rounded-lg transition-colors hover:bg-neutral-200/50"
			onclick={() => showHistory = !showHistory}
		>
			{showHistory ? 'Hide' : 'Show'} History
		</button>
	</div>

	<!-- History Panel -->
	{#if showHistory && history.length > 0}
		<div class={historyClasses}>
			<h3 class="text-sm font-semibold mb-2">History</h3>
			{#each history as entry}
				<div class="text-xs py-1 opacity-80">{entry}</div>
			{/each}
		</div>
	{/if}

	<!-- Display -->
	<div class={displayClasses}>
		{display}
	</div>

	<!-- Button Grid -->
	<div class="grid grid-cols-4 gap-3">
		<!-- Row 1 -->
		<button class={clearButtonClasses} onclick={clear}>AC</button>
		<button class={buttonClasses} onclick={toggleSign}>±</button>
		<button class={buttonClasses} onclick={percentage}>%</button>
		<button class={operatorButtonClasses} onclick={() => performOperation('÷')}>÷</button>

		<!-- Row 2 -->
		<button class={buttonClasses} onclick={() => inputNumber(7)}>7</button>
		<button class={buttonClasses} onclick={() => inputNumber(8)}>8</button>
		<button class={buttonClasses} onclick={() => inputNumber(9)}>9</button>
		<button class={operatorButtonClasses} onclick={() => performOperation('×')}>×</button>

		<!-- Row 3 -->
		<button class={buttonClasses} onclick={() => inputNumber(4)}>4</button>
		<button class={buttonClasses} onclick={() => inputNumber(5)}>5</button>
		<button class={buttonClasses} onclick={() => inputNumber(6)}>6</button>
		<button class={operatorButtonClasses} onclick={() => performOperation('-')}>−</button>

		<!-- Row 4 -->
		<button class={buttonClasses} onclick={() => inputNumber(1)}>1</button>
		<button class={buttonClasses} onclick={() => inputNumber(2)}>2</button>
		<button class={buttonClasses} onclick={() => inputNumber(3)}>3</button>
		<button class={operatorButtonClasses} onclick={() => performOperation('+')}>+</button>

		<!-- Row 5 -->
		<button class={buttonClasses + ' col-span-2'} onclick={() => inputNumber(0)}>0</button>
		<button class={buttonClasses} onclick={inputDot}>.</button>
		<button class={operatorButtonClasses} onclick={equals}>=</button>
	</div>

	<!-- Scientific Functions -->
	<div class="grid grid-cols-3 gap-2 mt-4">
		<button class={buttonClasses + ' text-sm'} onclick={sqrt}>√</button>
		<button class={buttonClasses + ' text-sm'} onclick={square}>x²</button>
		<button class={buttonClasses + ' text-sm'} onclick={memoryClear}>MC</button>
		<button class={buttonClasses + ' text-sm'} onclick={memoryRecall}>MR</button>
		<button class={buttonClasses + ' text-sm'} onclick={memoryAdd}>M+</button>
		<button class={buttonClasses + ' text-sm'} onclick={() => performOperation('%')}>mod</button>
	</div>
</div>