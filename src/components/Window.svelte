<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let { window } = $props();

	let isDragging = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let windowElement = $state();

	function handleMouseDown(event) {
		if (event.target.closest('.window-controls')) return;

		event.preventDefault();
		isDragging = true;
		dragOffset = {
			x: event.clientX - window.position.x,
			y: event.clientY - window.position.y
		};

		desktopState.setActiveWindow(window.id);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		
		// Prevent text selection while dragging
		document.body.style.userSelect = 'none';
	}

	function handleMouseMove(event) {
		if (!isDragging) return;

		event.preventDefault();
		
		// Get viewport dimensions
		const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		
		// Calculate new position with proper bounds
		const newPosition = {
			x: Math.max(0, Math.min(event.clientX - dragOffset.x, viewportWidth - window.size.width)),
			y: Math.max(
				32, // Account for top bar
				Math.min(event.clientY - dragOffset.y, viewportHeight - window.size.height - 32)
			)
		};

		desktopState.updateWindowPosition(window.id, newPosition);
	}

	function handleMouseUp() {
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		
		// Re-enable text selection
		document.body.style.userSelect = '';
	}

	function closeWindow() {
		desktopState.closeWindow(window.id);
	}

	function minimizeWindow() {
		desktopState.minimizeWindow(window.id);
	}

	$effect(() => {
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});

	let isActive = $derived(desktopState.activeWindowId === window.id);
	let zIndex = $derived(isActive ? 30 : 20);
</script>

{#if window.isOpen && !window.isMinimized}
	<div
		bind:this={windowElement}
		class="absolute overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-200 {isActive
			? 'ring-2 ring-blue-500'
			: ''}"
		style="left: {window.position.x}px; top: {window.position.y}px; width: {window.size
			.width}px; height: {window.size.height}px; z-index: {zIndex};"
		onclick={() => desktopState.setActiveWindow(window.id)}
	>
		<!-- Window Header -->
		<div
			class="flex h-8 cursor-move items-center justify-between border-b border-gray-200 bg-gray-100 px-3 select-none"
			onmousedown={handleMouseDown}
		>
			<span class="truncate text-sm font-medium text-gray-700">
				{window.title}
			</span>

			<!-- Window Controls -->
			<div class="window-controls flex items-center space-x-1">
				<button
					class="h-3 w-3 rounded-full bg-yellow-400 transition-colors hover:bg-yellow-500"
					onclick={minimizeWindow}
					title="Minimize"
				></button>
				<button
					class="h-3 w-3 rounded-full bg-red-400 transition-colors hover:bg-red-500"
					onclick={closeWindow}
					title="Close"
				></button>
			</div>
		</div>

		<!-- Window Content -->
		<div class="h-full overflow-auto pb-8 bg-white">
			{#if window.component}
				<svelte:component this={window.component} />
			{:else}
				<div class="flex items-center justify-center h-full text-gray-500">
					<div class="text-center">
						<p class="text-lg font-medium mb-2">Application Not Available</p>
						<p class="text-sm">This application is under development.</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	:global(.window-content) {
		height: calc(100% - 32px);
	}
</style>
