<script>
	let display = $state('0');
	let previousValue = $state(null);
	let operation = $state(null);
	let waitingForOperand = $state(false);

	function inputNumber(num) {
		if (waitingForOperand) {
			display = num;
			waitingForOperand = false;
		} else {
			display = display === '0' ? num : display + num;
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

		waitingForOperand = true;
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
			default:
				return secondValue;
		}
	}

	function performCalculation() {
		const inputValue = parseFloat(display);

		if (previousValue !== null && operation) {
			const newValue = calculate(previousValue, inputValue, operation);
			display = String(newValue);
			previousValue = null;
			operation = null;
			waitingForOperand = true;
		}
	}

	function clearAll() {
		display = '0';
		previousValue = null;
		operation = null;
		waitingForOperand = false;
	}

	function clearEntry() {
		display = '0';
	}

	function inputDecimal() {
		if (waitingForOperand) {
			display = '0.';
			waitingForOperand = false;
		} else if (display.indexOf('.') === -1) {
			display += '.';
		}
	}
</script>

<div class="bg-gray-800 text-white p-4 h-full flex flex-col">
	<!-- Display -->
	<div class="bg-gray-900 border border-gray-600 rounded p-3 mb-4 text-right">
		<div class="text-2xl font-mono overflow-hidden">{display}</div>
	</div>

	<!-- Button Grid -->
	<div class="grid grid-cols-4 gap-2 flex-1">
		<!-- Row 1 -->
		<button class="bg-gray-600 hover:bg-gray-500 rounded p-3 transition-colors" onclick={clearAll}>
			AC
		</button>
		<button class="bg-gray-600 hover:bg-gray-500 rounded p-3 transition-colors" onclick={clearEntry}>
			CE
		</button>
		<button class="bg-gray-600 hover:bg-gray-500 rounded p-3 transition-colors" onclick={() => inputOperation('/')}>
			÷
		</button>
		<button class="bg-orange-600 hover:bg-orange-500 rounded p-3 transition-colors" onclick={() => inputOperation('*')}>
			×
		</button>

		<!-- Row 2 -->
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('7')}>
			7
		</button>
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('8')}>
			8
		</button>
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('9')}>
			9
		</button>
		<button class="bg-orange-600 hover:bg-orange-500 rounded p-3 transition-colors" onclick={() => inputOperation('-')}>
			−
		</button>

		<!-- Row 3 -->
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('4')}>
			4
		</button>
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('5')}>
			5
		</button>
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('6')}>
			6
		</button>
		<button class="bg-orange-600 hover:bg-orange-500 rounded p-3 transition-colors" onclick={() => inputOperation('+')}>
			+
		</button>

		<!-- Row 4 -->
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors col-span-2" onclick={() => inputNumber('0')}>
			0
		</button>
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={inputDecimal}>
			.
		</button>
		<button class="bg-orange-600 hover:bg-orange-500 rounded p-3 transition-colors" onclick={performCalculation}>
			=
		</button>

		<!-- Row 5 -->
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('1')}>
			1
		</button>
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('2')}>
			2
		</button>
		<button class="bg-gray-700 hover:bg-gray-600 rounded p-3 transition-colors" onclick={() => inputNumber('3')}>
			3
		</button>
		<div></div> <!-- Empty space -->
	</div>
</div>
