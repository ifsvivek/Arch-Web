<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';
	
	let {
		title = 'Window',
		onClose = () => {},
		children,
		initialWidth = 400,
		initialHeight = 300,
		minWidth = 200,
		minHeight = 150,
		x = 50,
		y = 50,
		zIndex = 1
	} = $props();

	let windowRef = $state();
	let isDragging = $state(false);
	let isResizing = $state(false);
	let resizeType = $state('');
	let dragStart = $state({ x: 0, y: 0, windowX: 0, windowY: 0 });
	let resizeStart = $state({ x: 0, y: 0, width: 0, height: 0, windowX: 0, windowY: 0 });

	let windowState = $state({
		x,
		y,
		width: initialWidth,
		height: initialHeight,
		zIndex
	});

	// Theme-based styling
	const isDarkTheme = $derived(desktopState.currentTheme === 'dark' || 
		(desktopState.currentTheme === 'auto' && 
		typeof window !== 'undefined' && 
		window.matchMedia('(prefers-color-scheme: dark)').matches));

	const windowClasses = $derived(
		`absolute overflow-hidden rounded-lg border shadow-2xl select-none backdrop-blur-xl ${
			isDarkTheme 
				? 'border-neutral-600 bg-neutral-900/30' 
				: 'border-neutral-300 bg-white/30'
		}`
	);

	const titleBarClasses = $derived(
		`flex cursor-grab items-center justify-between border-b px-4 py-2 active:cursor-grabbing ${
			isDarkTheme 
				? 'border-neutral-600 bg-neutral-700' 
				: 'border-neutral-200 bg-neutral-100'
		}`
	);

	const titleClasses = $derived(
		`truncate text-sm font-medium ${
			isDarkTheme ? 'text-white' : 'text-neutral-900'
		}`
	);

	const contentClasses = $derived(
		`flex-1 overflow-auto ${
			isDarkTheme 
				? 'bg-neutral-900/50 text-white' 
				: 'bg-white/50 text-neutral-900'
		}`
	);

	function handleMouseDown(e) {
		if (e.target.closest('.resize-handle') || e.target.closest('.window-controls')) return;

		isDragging = true;
		dragStart = {
			x: e.clientX,
			y: e.clientY,
			windowX: windowState.x,
			windowY: windowState.y
		};
		e.preventDefault();
	}

	function handleResizeStart(e, type) {
		isResizing = true;
		resizeType = type;
		resizeStart = {
			x: e.clientX,
			y: e.clientY,
			width: windowState.width,
			height: windowState.height,
			windowX: windowState.x,
			windowY: windowState.y
		};
		e.preventDefault();
		e.stopPropagation();
	}

	function handleMouseMove(e) {
		if (isDragging) {
			windowState.x = dragStart.windowX + (e.clientX - dragStart.x);
			windowState.y = dragStart.windowY + (e.clientY - dragStart.y);
		} else if (isResizing) {
			const deltaX = e.clientX - resizeStart.x;
			const deltaY = e.clientY - resizeStart.y;

			switch (resizeType) {
				case 'se':
					windowState.width = Math.max(minWidth, resizeStart.width + deltaX);
					windowState.height = Math.max(minHeight, resizeStart.height + deltaY);
					break;
				case 'sw':
					const newWidth = Math.max(minWidth, resizeStart.width - deltaX);
					const widthDiff = newWidth - windowState.width;
					windowState.width = newWidth;
					windowState.x = resizeStart.windowX + (resizeStart.width - newWidth);
					windowState.height = Math.max(minHeight, resizeStart.height + deltaY);
					break;
				case 'ne':
					windowState.width = Math.max(minWidth, resizeStart.width + deltaX);
					const newHeight = Math.max(minHeight, resizeStart.height - deltaY);
					windowState.height = newHeight;
					windowState.y = resizeStart.windowY + (resizeStart.height - newHeight);
					break;
				case 'nw':
					const newWidthNW = Math.max(minWidth, resizeStart.width - deltaX);
					const newHeightNW = Math.max(minHeight, resizeStart.height - deltaY);
					windowState.width = newWidthNW;
					windowState.height = newHeightNW;
					windowState.x = resizeStart.windowX + (resizeStart.width - newWidthNW);
					windowState.y = resizeStart.windowY + (resizeStart.height - newHeightNW);
					break;
				case 'n':
					const newHeightN = Math.max(minHeight, resizeStart.height - deltaY);
					windowState.height = newHeightN;
					windowState.y = resizeStart.windowY + (resizeStart.height - newHeightN);
					break;
				case 's':
					windowState.height = Math.max(minHeight, resizeStart.height + deltaY);
					break;
				case 'e':
					windowState.width = Math.max(minWidth, resizeStart.width + deltaX);
					break;
				case 'w':
					const newWidthW = Math.max(minWidth, resizeStart.width - deltaX);
					windowState.width = newWidthW;
					windowState.x = resizeStart.windowX + (resizeStart.width - newWidthW);
					break;
			}
		}
	}

	function handleMouseUp() {
		isDragging = false;
		isResizing = false;
		resizeType = '';
	}

	$effect(() => {
		if (isDragging || isResizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			document.body.style.cursor = isResizing ? `${resizeType}-resize` : 'grabbing';
			document.body.style.userSelect = 'none';

			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
				document.body.style.cursor = '';
				document.body.style.userSelect = '';
			};
		}
	});
</script>

<div
	bind:this={windowRef}
	onmousedown={() => {
		const elements = document.querySelectorAll('.absolute');
		const zIndexes = Array.from(elements).map((el) => parseInt(el.style.zIndex || 0));
		windowState.zIndex = Math.min(Math.max(...zIndexes) + 1, 9998);
	}}
	class={windowClasses}
	style="left: {windowState.x}px; top: {windowState.y}px; width: {windowState.width}px; height: {windowState.height}px; z-index: {windowState.zIndex};"
>
	<!-- Window Title Bar -->
	<div
		class={titleBarClasses}
		onmousedown={handleMouseDown}
	>
		<h3 class={titleClasses}>{title}</h3>
		<div class="window-controls flex items-center space-x-2">
			<button
				class="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-400"
				onclick={onClose}
				aria-label="Close window"
				title="Close"
			></button>
		</div>
	</div>

	<!-- Window Content -->
	<div class={contentClasses} style="height: {windowState.height - 40}px;">
		{@render children()}
	</div>

	<!-- Resize Handles -->
	<div
		class="resize-handle absolute top-0 left-0 h-2 w-2 cursor-nw-resize"
		onmousedown={(e) => handleResizeStart(e, 'nw')}
	></div>
	<div
		class="resize-handle absolute top-0 right-0 h-2 w-2 cursor-ne-resize"
		onmousedown={(e) => handleResizeStart(e, 'ne')}
	></div>
	<div
		class="resize-handle absolute bottom-0 left-0 h-2 w-2 cursor-sw-resize"
		onmousedown={(e) => handleResizeStart(e, 'sw')}
	></div>
	<div
		class="resize-handle absolute right-0 bottom-0 h-2 w-2 cursor-se-resize"
		onmousedown={(e) => handleResizeStart(e, 'se')}
	></div>
	<div
		class="resize-handle absolute top-0 right-2 left-2 h-1 cursor-n-resize"
		onmousedown={(e) => handleResizeStart(e, 'n')}
	></div>
	<div
		class="resize-handle absolute right-2 bottom-0 left-2 h-1 cursor-s-resize"
		onmousedown={(e) => handleResizeStart(e, 's')}
	></div>
	<div
		class="resize-handle absolute top-2 bottom-2 left-0 w-1 cursor-w-resize"
		onmousedown={(e) => handleResizeStart(e, 'w')}
	></div>
	<div
		class="resize-handle absolute top-2 right-0 bottom-2 w-1 cursor-e-resize"
		onmousedown={(e) => handleResizeStart(e, 'e')}
	></div>
</div>
