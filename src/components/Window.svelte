<script>
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
	class="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden select-none"
	style="left: {windowState.x}px; top: {windowState.y}px; width: {windowState.width}px; height: {windowState.height}px; z-index: {windowState.zIndex};"
>
	<!-- Window Title Bar -->
	<div 
		class="bg-gray-700 px-4 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-gray-600"
		onmousedown={handleMouseDown}
	>
		<h3 class="text-white font-medium text-sm truncate">{title}</h3>
		<div class="window-controls flex items-center space-x-2">
			<button 
				class="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
				onclick={onClose}
				aria-label="Close window"
				title="Close"
			></button>
		</div>
	</div>

	<!-- Window Content -->
	<div class="flex-1 overflow-auto" style="height: {windowState.height - 40}px;">
		{@render children()}
	</div>

	<!-- Resize Handles -->
	<div class="resize-handle absolute top-0 left-0 w-2 h-2 cursor-nw-resize" 
		onmousedown={(e) => handleResizeStart(e, 'nw')}></div>
	<div class="resize-handle absolute top-0 right-0 w-2 h-2 cursor-ne-resize" 
		onmousedown={(e) => handleResizeStart(e, 'ne')}></div>
	<div class="resize-handle absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" 
		onmousedown={(e) => handleResizeStart(e, 'sw')}></div>
	<div class="resize-handle absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" 
		onmousedown={(e) => handleResizeStart(e, 'se')}></div>
	<div class="resize-handle absolute top-0 left-2 right-2 h-1 cursor-n-resize" 
		onmousedown={(e) => handleResizeStart(e, 'n')}></div>
	<div class="resize-handle absolute bottom-0 left-2 right-2 h-1 cursor-s-resize" 
		onmousedown={(e) => handleResizeStart(e, 's')}></div>
	<div class="resize-handle absolute left-0 top-2 bottom-2 w-1 cursor-w-resize" 
		onmousedown={(e) => handleResizeStart(e, 'w')}></div>
	<div class="resize-handle absolute right-0 top-2 bottom-2 w-1 cursor-e-resize" 
		onmousedown={(e) => handleResizeStart(e, 'e')}></div>
</div>
