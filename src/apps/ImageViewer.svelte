<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let currentImageIndex = $state(0);
	let zoom = $state(100);
	let rotation = $state(0);
	let isFullscreen = $state(false);
	let showThumbnails = $state(false);
	let slideshowActive = $state(false);
	let slideshowInterval = $state(null);
	let imageSettings = $state({
		brightness: 100,
		contrast: 100,
		saturation: 100,
		blur: 0,
		sepia: 0,
		neutralscale: 0
	});
	let showImageInfo = $state(false);
	let showTools = $state(false);

	// Sample images
	let images = $state([
		{
			id: 1,
			name: 'mountain-landscape.jpg',
			url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
			size: '2.4 MB',
			dimensions: '1920x1080',
			date: '2024-01-15',
			type: 'JPEG'
		},
		{
			id: 2,
			name: 'city-night.jpg',
			url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
			size: '3.1 MB',
			dimensions: '2048x1536',
			date: '2024-01-10',
			type: 'JPEG'
		},
		{
			id: 3,
			name: 'forest-path.jpg',
			url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
			size: '1.8 MB',
			dimensions: '1600x1200',
			date: '2024-01-08',
			type: 'JPEG'
		},
		{
			id: 4,
			name: 'ocean-sunset.jpg',
			url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
			size: '2.7 MB',
			dimensions: '1920x1280',
			date: '2024-01-05',
			type: 'JPEG'
		},
		{
			id: 5,
			name: 'abstract-art.jpg',
			url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
			size: '1.9 MB',
			dimensions: '1800x1200',
			date: '2024-01-03',
			type: 'JPEG'
		}
	]);

	const isDarkTheme = $derived(
		desktopState.currentTheme === 'dark' ||
		(desktopState.currentTheme === 'auto' &&
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	const currentImage = $derived(images[currentImageIndex]);

	const imageTransform = $derived(() => {
		return `scale(${zoom / 100}) rotate(${rotation}deg)`;
	});

	const imageFilter = $derived(() => {
		return `brightness(${imageSettings.brightness}%) contrast(${imageSettings.contrast}%) saturate(${imageSettings.saturation}%) blur(${imageSettings.blur}px) sepia(${imageSettings.sepia}%) neutralscale(${imageSettings.neutralscale}%)`;
	});

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % images.length;
		resetImageSettings();
	}

	function previousImage() {
		currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
		resetImageSettings();
	}

	function zoomIn() {
		zoom = Math.min(zoom + 25, 500);
	}

	function zoomOut() {
		zoom = Math.max(zoom - 25, 25);
	}

	function resetZoom() {
		zoom = 100;
	}

	function rotateLeft() {
		rotation = (rotation - 90) % 360;
	}

	function rotateRight() {
		rotation = (rotation + 90) % 360;
	}

	function resetRotation() {
		rotation = 0;
	}

	function resetImageSettings() {
		zoom = 100;
		rotation = 0;
		imageSettings = {
			brightness: 100,
			contrast: 100,
			saturation: 100,
			blur: 0,
			sepia: 0,
			neutralscale: 0
		};
	}

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
	}

	function toggleThumbnails() {
		showThumbnails = !showThumbnails;
	}

	function selectImage(index) {
		currentImageIndex = index;
		resetImageSettings();
		showThumbnails = false;
	}

	function startSlideshow() {
		slideshowActive = true;
		slideshowInterval = setInterval(() => {
			nextImage();
		}, 3000);
	}

	function stopSlideshow() {
		slideshowActive = false;
		if (slideshowInterval) {
			clearInterval(slideshowInterval);
			slideshowInterval = null;
		}
	}

	function toggleSlideshow() {
		if (slideshowActive) {
			stopSlideshow();
		} else {
			startSlideshow();
		}
	}

	function downloadImage() {
		const link = document.createElement('a');
		link.href = currentImage.url;
		link.download = currentImage.name;
		link.click();
	}

	function shareImage() {
		if (navigator.share) {
			navigator.share({
				title: currentImage.name,
				url: currentImage.url
			});
		} else {
			// Fallback - copy to clipboard
			navigator.clipboard.writeText(currentImage.url);
		}
	}

	function deleteImage() {
		if (images.length > 1) {
			images = images.filter((_, index) => index !== currentImageIndex);
			if (currentImageIndex >= images.length) {
				currentImageIndex = images.length - 1;
			}
			resetImageSettings();
		}
	}

	// Keyboard navigation
	function handleKeydown(event) {
		switch (event.key) {
			case 'ArrowLeft':
				previousImage();
				break;
			case 'ArrowRight':
				nextImage();
				break;
			case '+':
			case '=':
				zoomIn();
				break;
			case '-':
				zoomOut();
				break;
			case '0':
				resetZoom();
				break;
			case 'r':
				rotateRight();
				break;
			case 'R':
				rotateLeft();
				break;
			case 'f':
				toggleFullscreen();
				break;
			case ' ':
				event.preventDefault();
				toggleSlideshow();
				break;
			case 'Escape':
				if (isFullscreen) toggleFullscreen();
				if (slideshowActive) stopSlideshow();
				break;
		}
	}

	$effect(() => {
		return () => {
			if (slideshowInterval) {
				clearInterval(slideshowInterval);
			}
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-full flex-col {isDarkTheme ? 'bg-neutral-900/80 text-white' : 'bg-white/80 text-neutral-900'} backdrop-blur-xl">
	<!-- Header -->
	<div class="flex items-center justify-between {isDarkTheme ? 'bg-neutral-800/90 border-neutral-700' : 'bg-neutral-100/90 border-neutral-300'} border-b px-6 py-4">
		<div class="flex items-center space-x-4">
			<div class="text-2xl">🖼️</div>
			<div>
				<h1 class="text-xl font-bold">Image Viewer</h1>
				<p class="text-sm opacity-70">{currentImage.name} ({currentImageIndex + 1} of {images.length})</p>
			</div>
		</div>
		
		<!-- Header Controls -->
		<div class="flex items-center space-x-2">
			<button
				onclick={() => showImageInfo = !showImageInfo}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				title="Image Info"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
				</svg>
			</button>
			
			<button
				onclick={() => showTools = !showTools}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				title="Tools"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
				</svg>
			</button>
			
			<button
				onclick={toggleThumbnails}
				class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
				title="Thumbnails"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V7h10v4zm-4 4H9v-2h6v2zm4-2h-2v-2h2v2z"/>
				</svg>
			</button>
			
			<button
				onclick={toggleSlideshow}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105
				{slideshowActive 
					? 'bg-red-500 text-white hover:bg-red-600' 
					: (isDarkTheme ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white')}"
			>
				{slideshowActive ? 'Stop' : 'Slideshow'}
			</button>
		</div>
	</div>

	<div class="flex flex-1 overflow-hidden">
		<!-- Tools Sidebar -->
		{#if showTools}
			<div class="w-80 {isDarkTheme ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50/60 border-neutral-200'} border-r overflow-y-auto">
				<div class="p-6 space-y-6">
					<!-- Zoom Controls -->
					<div>
						<h3 class="font-semibold mb-3">Zoom</h3>
						<div class="flex items-center space-x-3 mb-3">
							<button
								onclick={zoomOut}
								class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
							>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 13H5v-2h14v2z"/>
								</svg>
							</button>
							
							<div class="flex-1 text-center">
								<span class="font-mono text-lg">{zoom}%</span>
							</div>
							
							<button
								onclick={zoomIn}
								class="rounded-lg p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
							>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
								</svg>
							</button>
						</div>
						
						<input
							type="range"
							min="25"
							max="500"
							step="25"
							bind:value={zoom}
							class="w-full h-2 rounded-full appearance-none cursor-pointer transition-all duration-200
							{isDarkTheme ? 'bg-neutral-600 accent-blue-500' : 'bg-neutral-300 accent-blue-600'}"
						/>
						
						<button
							onclick={resetZoom}
							class="w-full mt-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105
							{isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
						>
							Reset Zoom
						</button>
					</div>

					<!-- Rotation Controls -->
					<div>
						<h3 class="font-semibold mb-3">Rotation</h3>
						<div class="flex items-center justify-between space-x-3 mb-3">
							<button
								onclick={rotateLeft}
								class="flex-1 rounded-lg p-2 transition-all duration-200 hover:scale-105 {isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
								title="Rotate Left"
							>
								<svg class="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
									<path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13h2.02c.17 1.39.72 2.73 1.62 3.89l-1.41 1.42C7.17 17.14 6.26 15.14 6.09 13zm1.41 1.42C8.66 15.58 10.26 16 12 16s3.34-.42 4.5-1.58L17.91 13h2.02c-.17 2.14-1.08 4.14-2.23 5.31l-1.41-1.42C17.28 15.73 17.83 14.39 18 13H6.09z"/>
								</svg>
							</button>
							
							<div class="text-center">
								<span class="font-mono text-lg">{rotation}°</span>
							</div>
							
							<button
								onclick={rotateRight}
								class="flex-1 rounded-lg p-2 transition-all duration-200 hover:scale-105 {isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
								title="Rotate Right"
							>
								<svg class="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
									<path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm5 8.5c-.56 0-1.08.22-1.42.59L16.5 12l-1.05 1.42c-.31.33-.47.75-.47 1.19C15 16.1 16.9 18 19.5 18s4.5-1.9 4.5-4.39c0-.44-.16-.86-.47-1.19L21.92 14.59c-.34-.37-.86-.59-1.42-.59z"/>
								</svg>
							</button>
						</div>
						
						<button
							onclick={resetRotation}
							class="w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105
							{isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
						>
							Reset Rotation
						</button>
					</div>

					<!-- Image Filters -->
					<div>
						<h3 class="font-semibold mb-3">Filters</h3>
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium mb-2">Brightness ({imageSettings.brightness}%)</label>
								<input
									type="range"
									min="0"
									max="200"
									bind:value={imageSettings.brightness}
									class="w-full h-2 rounded-full appearance-none cursor-pointer
									{isDarkTheme ? 'bg-neutral-600 accent-yellow-500' : 'bg-neutral-300 accent-yellow-600'}"
								/>
							</div>
							
							<div>
								<label class="block text-sm font-medium mb-2">Contrast ({imageSettings.contrast}%)</label>
								<input
									type="range"
									min="0"
									max="200"
									bind:value={imageSettings.contrast}
									class="w-full h-2 rounded-full appearance-none cursor-pointer
									{isDarkTheme ? 'bg-neutral-600 accent-orange-500' : 'bg-neutral-300 accent-orange-600'}"
								/>
							</div>
							
							<div>
								<label class="block text-sm font-medium mb-2">Saturation ({imageSettings.saturation}%)</label>
								<input
									type="range"
									min="0"
									max="200"
									bind:value={imageSettings.saturation}
									class="w-full h-2 rounded-full appearance-none cursor-pointer
									{isDarkTheme ? 'bg-neutral-600 accent-pink-500' : 'bg-neutral-300 accent-pink-600'}"
								/>
							</div>
							
							<div>
								<label class="block text-sm font-medium mb-2">Blur ({imageSettings.blur}px)</label>
								<input
									type="range"
									min="0"
									max="10"
									bind:value={imageSettings.blur}
									class="w-full h-2 rounded-full appearance-none cursor-pointer
									{isDarkTheme ? 'bg-neutral-600 accent-blue-500' : 'bg-neutral-300 accent-blue-600'}"
								/>
							</div>
							
							<div>
								<label class="block text-sm font-medium mb-2">Sepia ({imageSettings.sepia}%)</label>
								<input
									type="range"
									min="0"
									max="100"
									bind:value={imageSettings.sepia}
									class="w-full h-2 rounded-full appearance-none cursor-pointer
									{isDarkTheme ? 'bg-neutral-600 accent-amber-500' : 'bg-neutral-300 accent-amber-600'}"
								/>
							</div>
							
							<div>
								<label class="block text-sm font-medium mb-2">neutralscale ({imageSettings.neutralscale}%)</label>
								<input
									type="range"
									min="0"
									max="100"
									bind:value={imageSettings.neutralscale}
									class="w-full h-2 rounded-full appearance-none cursor-pointer
									{isDarkTheme ? 'bg-neutral-600 accent-neutral-500' : 'bg-neutral-300 accent-neutral-600'}"
								/>
							</div>
						</div>
						
						<button
							onclick={resetImageSettings}
							class="w-full mt-4 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105
							{isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
						>
							Reset Filters
						</button>
					</div>

					<!-- Actions -->
					<div>
						<h3 class="font-semibold mb-3">Actions</h3>
						<div class="space-y-2">
							<button
								onclick={downloadImage}
								class="w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105
								bg-blue-500 text-white hover:bg-blue-600"
							>
								Download
							</button>
							
							<button
								onclick={shareImage}
								class="w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105
								bg-green-500 text-white hover:bg-green-600"
							>
								Share
							</button>
							
							<button
								onclick={deleteImage}
								class="w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105
								bg-red-500 text-white hover:bg-red-600"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Main Content -->
		<div class="flex-1 flex flex-col">
			<!-- Image Display Area -->
			<div class="flex-1 relative overflow-hidden flex items-center justify-center p-4 {isDarkTheme ? 'bg-neutral-900/40' : 'bg-neutral-100/40'}">
				<!-- Navigation Buttons -->
				<button
					onclick={previousImage}
					class="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-200 hover:scale-110
					{isDarkTheme ? 'bg-neutral-800/80 text-white hover:bg-neutral-700/80' : 'bg-white/80 text-neutral-900 hover:bg-neutral-100/80'} backdrop-blur-xl shadow-lg"
					title="Previous Image (←)"
				>
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
						<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
					</svg>
				</button>

				<button
					onclick={nextImage}
					class="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-200 hover:scale-110
					{isDarkTheme ? 'bg-neutral-800/80 text-white hover:bg-neutral-700/80' : 'bg-white/80 text-neutral-900 hover:bg-neutral-100/80'} backdrop-blur-xl shadow-lg"
					title="Next Image (→)"
				>
					<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
						<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
					</svg>
				</button>

				<!-- Image -->
				<div class="max-w-full max-h-full overflow-hidden">
					<img
						src={currentImage.url}
						alt={currentImage.name}
						class="max-w-full max-h-full object-contain transition-all duration-300 ease-in-out"
						style="transform: {imageTransform}; filter: {imageFilter};"
						loading="lazy"
					/>
				</div>

				<!-- Image Info Overlay -->
				{#if showImageInfo}
					<div class="absolute top-4 left-4 rounded-xl border p-4 backdrop-blur-xl
					{isDarkTheme ? 'bg-neutral-800/80 border-neutral-600 text-white' : 'bg-white/80 border-neutral-200 text-neutral-900'}">
						<h3 class="font-semibold mb-2">{currentImage.name}</h3>
						<div class="space-y-1 text-sm">
							<div>Size: {currentImage.size}</div>
							<div>Dimensions: {currentImage.dimensions}</div>
							<div>Type: {currentImage.type}</div>
							<div>Date: {currentImage.date}</div>
						</div>
					</div>
				{/if}

				<!-- Zoom Controls -->
				<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 rounded-full p-2 backdrop-blur-xl
				{isDarkTheme ? 'bg-neutral-800/80 text-white' : 'bg-white/80 text-neutral-900'}">
					<button
						onclick={zoomOut}
						class="rounded-full p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
						title="Zoom Out (-)"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 13H5v-2h14v2z"/>
						</svg>
					</button>
					
					<span class="font-mono text-sm px-2">{zoom}%</span>
					
					<button
						onclick={zoomIn}
						class="rounded-full p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
						title="Zoom In (+)"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
						</svg>
					</button>
					
					<button
						onclick={resetZoom}
						class="rounded-full p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
						title="Reset Zoom (0)"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Thumbnails -->
			{#if showThumbnails}
				<div class="h-32 {isDarkTheme ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-100/80 border-neutral-300'} border-t p-4 overflow-x-auto">
					<div class="flex space-x-3 h-full">
						{#each images as image, index}
							<button
								onclick={() => selectImage(index)}
								class="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105
								{index === currentImageIndex 
									? 'ring-2 ring-blue-500 shadow-lg' 
									: 'hover:ring-2 hover:ring-neutral-400'}"
							>
								<img
									src={image.url}
									alt={image.name}
									class="h-20 w-20 object-cover"
									loading="lazy"
								/>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Slideshow Indicator -->
	{#if slideshowActive}
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
			<div class="rounded-full p-4 backdrop-blur-xl {isDarkTheme ? 'bg-neutral-800/80 text-white' : 'bg-white/80 text-neutral-900'}">
				<svg class="h-8 w-8 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
					<path d="M8 5v14l11-7z"/>
				</svg>
			</div>
		</div>
	{/if}
</div>