<!-- filepath: /home/ifsvivek/Documents/Arch Web/src/components/apps/ImageViewer.svelte -->
<script>
	let selectedImage = $state(null);
	let zoom = $state(100);
	let isDragging = $state(false);
	let imagePosition = $state({ x: 0, y: 0 });
	let dragOffset = $state({ x: 0, y: 0 });

	// Sample images
	const sampleImages = [
		{
			name: 'arch-nz-wallpaper.png',
			url: 'https://roboticoverlords.org/wallpapers/arch_nz.png',
			size: '1920x1080'
		},
		{
			name: 'arch-wallpaper.jpg',
			url:
				'data:image/svg+xml;base64,' +
				btoa(`
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
					<defs>
						<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
							<stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
							<stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
						</linearGradient>
					</defs>
					<rect width="800" height="600" fill="url(#grad1)"/>
					<g transform="translate(400,300)" fill="rgba(255,255,255,0.1)">
						<path d="M0,-200 L173.2,-100 L173.2,100 L0,200 L-173.2,100 L-173.2,-100 Z" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
						<path d="M0,-120 L103.9,-60 L103.9,60 L0,120 L-103.9,60 L-103.9,-60 Z" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
					</g>
					<text x="400" y="500" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="monospace" font-size="24">Arch Linux</text>
				</svg>
			`),
			size: '1920x1080'
		},
		{
			name: 'desktop-screenshot.png',
			url:
				'data:image/svg+xml;base64,' +
				btoa(`
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
					<rect width="600" height="400" fill="#f3f4f6"/>
					<rect x="0" y="0" width="600" height="32" fill="#111827"/>
					<rect x="0" y="32" width="48" height="368" fill="#374151"/>
					<g fill="#6b7280">
						<rect x="12" y="44" width="24" height="24" rx="4"/>
						<rect x="12" y="76" width="24" height="24" rx="4"/>
						<rect x="12" y="108" width="24" height="24" rx="4"/>
					</g>
					<rect x="100" y="80" width="400" height="250" fill="white" stroke="#d1d5db" rx="8"/>
					<rect x="100" y="80" width="400" height="32" fill="#f9fafb" stroke="#d1d5db"/>
					<text x="120" y="100" fill="#374151" font-family="sans-serif" font-size="12">Sample Window</text>
				</svg>
			`),
			size: '1366x768'
		}
	];

	function loadImage(image) {
		selectedImage = image;
		zoom = 100;
		imagePosition = { x: 0, y: 0 };
	}

	function loadFromFile() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) => {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					selectedImage = {
						name: file.name,
						url: e.target.result,
						size: 'Unknown'
					};
					zoom = 100;
					imagePosition = { x: 0, y: 0 };
				};
				reader.readAsDataURL(file);
			}
		};
		input.click();
	}

	function zoomIn() {
		zoom = Math.min(zoom + 25, 500);
	}

	function zoomOut() {
		zoom = Math.max(zoom - 25, 25);
	}

	function resetZoom() {
		zoom = 100;
		imagePosition = { x: 0, y: 0 };
	}

	function handleMouseDown(event) {
		isDragging = true;
		dragOffset = {
			x: event.clientX - imagePosition.x,
			y: event.clientY - imagePosition.y
		};
	}

	function handleMouseMove(event) {
		if (isDragging) {
			imagePosition = {
				x: event.clientX - dragOffset.x,
				y: event.clientY - dragOffset.y
			};
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<div class="flex h-full">
	<!-- Sidebar -->
	<div class="w-64 overflow-y-auto border-r border-gray-200 bg-gray-100 p-4">
		<div class="mb-4">
			<button
				onclick={loadFromFile}
				class="w-full rounded bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600"
			>
				Open Image
			</button>
		</div>

		<h3 class="mb-2 text-sm font-semibold text-gray-700">Sample Images</h3>
		<div class="space-y-2">
			{#each sampleImages as image}
				<button
					class="w-full rounded p-2 text-left transition-colors hover:bg-gray-200"
					onclick={() => loadImage(image)}
				>
					<div class="text-sm font-medium text-gray-800">{image.name}</div>
					<div class="text-xs text-gray-500">{image.size}</div>
				</button>
			{/each}
		</div>

		{#if selectedImage}
			<div class="mt-6 border-t border-gray-300 pt-4">
				<h3 class="mb-2 text-sm font-semibold text-gray-700">Image Info</h3>
				<div class="space-y-1 text-xs text-gray-600">
					<div><strong>Name:</strong> {selectedImage.name}</div>
					<div><strong>Size:</strong> {selectedImage.size}</div>
					<div><strong>Zoom:</strong> {zoom}%</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Main View -->
	<div class="flex flex-1 flex-col">
		<!-- Toolbar -->
		{#if selectedImage}
			<div class="flex items-center space-x-2 border-b border-gray-200 bg-white p-2">
				<button
					onclick={zoomOut}
					class="rounded bg-gray-100 px-2 py-1 text-sm transition-colors hover:bg-gray-200"
					disabled={zoom <= 25}
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 13H5v-2h14v2z" />
					</svg>
				</button>
				<span class="min-w-16 text-center text-sm text-gray-600">{zoom}%</span>
				<button
					onclick={zoomIn}
					class="rounded bg-gray-100 px-2 py-1 text-sm transition-colors hover:bg-gray-200"
					disabled={zoom >= 500}
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
					</svg>
				</button>
				<button
					onclick={resetZoom}
					class="rounded bg-gray-100 px-2 py-1 text-sm transition-colors hover:bg-gray-200"
				>
					Reset
				</button>
			</div>
		{/if}

		<!-- Image Display -->
		<div class="relative flex-1 overflow-hidden bg-gray-50">
			{#if selectedImage}
				<div
					class="absolute inset-0 flex cursor-grab items-center justify-center {isDragging
						? 'cursor-grabbing'
						: ''}"
					style="transform: translate({imagePosition.x}px, {imagePosition.y}px)"
				>
					<img
						src={selectedImage.url}
						alt={selectedImage.name}
						class="max-w-none transition-transform"
						style="width: {zoom}%; height: auto;"
						onmousedown={handleMouseDown}
						draggable="false"
					/>
				</div>
			{:else}
				<div class="absolute inset-0 flex items-center justify-center text-gray-500">
					<div class="text-center">
						<svg
							class="mx-auto mb-4 h-16 w-16 text-gray-300"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
							/>
						</svg>
						<p class="text-lg">No image selected</p>
						<p class="text-sm text-gray-400">Open an image to view it here</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
