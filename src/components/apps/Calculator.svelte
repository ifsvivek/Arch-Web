<script>
	let display = $state('0');
	let previousValue = $state(null);
	let operation = $state(null);
	let waitingForNewValue = $state(false);

	function inputNumber(num) {
		if (waitingForNewValue) {
			display = String(num);
			waitingForNewValue = false;
		} else {
			display = display === '0' ? String(num) : display + num;
		}
	}

	function inputOperation(nextOperation) {
		const inputValue = parseFloat(display);

		if (previousValue === null) {
			previousValue = inputValue;
		} else if (operation) {
			const currentValue = previousValue || 0;
			const newValue = calculate(currentValue, inputValue, operation);

			display = String(newValue);
			previousValue = newValue;
		}

		waitingForNewValue = true;
		operation = nextOperation;
	}

	function calculate(firstValue, secondValue, operation) {
		switch (operation) {
			case '+':
				return firstValue + secondValue;
			case '-':
				return firstValue - secondValue;
			case '*':
				return firstValue * secondValue;
			case '/':
				return firstValue / secondValue;
			case '=':
				return secondValue;
			default:
				return secondValue;
		}
	}

	function performCalculation() {
		if (operation && previousValue !== null) {
			const inputValue = parseFloat(display);
			const newValue = calculate(previousValue, inputValue, operation);

			display = String(newValue);
			previousValue = null;
			operation = null;
			waitingForNewValue = true;
		}
	}

	function clearDisplay() {
		display = '0';
		previousValue = null;
		operation = null;
		waitingForNewValue = false;
	}

	function inputDecimal() {
		if (waitingForNewValue) {
			display = '0.';
			waitingForNewValue = false;
		} else if (display.indexOf('.') === -1) {
			display = display + '.';
		}
	}

	const buttons = [
		{
			text: 'C',
			action: clearDisplay,
			className: 'bg-red-500 hover:bg-red-600 text-white col-span-2'
		},
		{
			text: '/',
			action: () => inputOperation('/'),
			className: 'bg-gray-500 hover:bg-gray-600 text-white'
		},
		{
			text: '*',
			action: () => inputOperation('*'),
			className: 'bg-gray-500 hover:bg-gray-600 text-white'
		},

		{ text: '7', action: () => inputNumber(7), className: 'bg-gray-200 hover:bg-gray-300' },
		{ text: '8', action: () => inputNumber(8), className: 'bg-gray-200 hover:bg-gray-300' },
		{ text: '9', action: () => inputNumber(9), className: 'bg-gray-200 hover:bg-gray-300' },
		{
			text: '-',
			action: () => inputOperation('-'),
			className: 'bg-gray-500 hover:bg-gray-600 text-white'
		},

		{ text: '4', action: () => inputNumber(4), className: 'bg-gray-200 hover:bg-gray-300' },
		{ text: '5', action: () => inputNumber(5), className: 'bg-gray-200 hover:bg-gray-300' },
		{ text: '6', action: () => inputNumber(6), className: 'bg-gray-200 hover:bg-gray-300' },
		{
			text: '+',
			action: () => inputOperation('+'),
			className: 'bg-gray-500 hover:bg-gray-600 text-white'
		},

		{ text: '1', action: () => inputNumber(1), className: 'bg-gray-200 hover:bg-gray-300' },
		{ text: '2', action: () => inputNumber(2), className: 'bg-gray-200 hover:bg-gray-300' },
		{ text: '3', action: () => inputNumber(3), className: 'bg-gray-200 hover:bg-gray-300' },
		{
			text: '=',
			action: performCalculation,
			className: 'bg-blue-500 hover:bg-blue-600 text-white row-span-2'
		},

		{
			text: '0',
			action: () => inputNumber(0),
			className: 'bg-gray-200 hover:bg-gray-300 col-span-2'
		},
		{ text: '.', action: inputDecimal, className: 'bg-gray-200 hover:bg-gray-300' }
	];
</script>

<div class="flex h-full flex-col p-4">
	<!-- Display -->
	<div
		class="mb-4 overflow-hidden rounded bg-gray-900 p-4 text-right font-mono text-2xl text-white"
	>
		{display}
	</div>

	<!-- Button Grid -->
	<div class="grid flex-1 grid-cols-4 gap-2">
		{#each buttons as button}
			<button
				class="rounded font-semibold transition-colors {button.className}"
				onclick={button.action}
			>
				{button.text}
			</button>
		{/each}
	</div>
</div>
