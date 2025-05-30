<script>
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(180);
	let volume = $state(0.7);
	let currentSong = $state({
		title: 'Arch Linux Boot Sound',
		artist: 'System Audio',
		album: 'System Sounds',
		cover: '/arch_wallpaper.png'
	});

	let playlist = $state([
		{
			title: 'Arch Linux Boot Sound',
			artist: 'System Audio',
			album: 'System Sounds',
			duration: 180,
			cover: '/arch_wallpaper.png'
		},
		{
			title: 'Terminal Ambience',
			artist: 'Dev Sounds',
			album: 'Coding Vibes',
			duration: 240,
			cover: '/arch_wallpaper.png'
		},
		{
			title: 'Package Update Melody',
			artist: 'Pacman Audio',
			album: 'System Maintenance',
			duration: 160,
			cover: '/arch_wallpaper.png'
		}
	]);

	function togglePlay() {
		isPlaying = !isPlaying;
	}

	function previousTrack() {
		const currentIndex = playlist.findIndex(song => song.title === currentSong.title);
		if (currentIndex > 0) {
			currentSong = playlist[currentIndex - 1];
			currentTime = 0;
		}
	}

	function nextTrack() {
		const currentIndex = playlist.findIndex(song => song.title === currentSong.title);
		if (currentIndex < playlist.length - 1) {
			currentSong = playlist[currentIndex + 1];
			currentTime = 0;
		}
	}

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function selectSong(song) {
		currentSong = song;
		currentTime = 0;
		duration = song.duration;
	}

	// Simulate time progression when playing
	$effect(() => {
		if (isPlaying) {
			const interval = setInterval(() => {
				if (currentTime < duration) {
					currentTime += 1;
				} else {
					nextTrack();
				}
			}, 1000);
			return () => clearInterval(interval);
		}
	});
</script>

<div class="flex h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
	<!-- Sidebar -->
	<div class="w-64 bg-black bg-opacity-30 p-4">
		<h2 class="text-lg font-bold mb-4">Library</h2>
		<nav class="space-y-2">
			<button class="w-full text-left px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors">
				Recent
			</button>
			<button class="w-full text-left px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors">
				Favorites
			</button>
			<button class="w-full text-left px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors">
				Playlists
			</button>
		</nav>

		<!-- Playlist -->
		<div class="mt-6">
			<h3 class="text-sm font-semibold mb-3 text-gray-300">Now Playing</h3>
			<div class="space-y-1">
				{#each playlist as song, index}
					<button
						class="w-full text-left p-2 rounded text-sm hover:bg-white hover:bg-opacity-10 transition-colors {song.title === currentSong.title ? 'bg-white bg-opacity-20' : ''}"
						onclick={() => selectSong(song)}
					>
						<div class="font-medium truncate">{song.title}</div>
						<div class="text-xs text-gray-400 truncate">{song.artist}</div>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col">
		<!-- Now Playing -->
		<div class="flex-1 flex items-center justify-center p-8">
			<div class="text-center max-w-md">
				<!-- Album Cover -->
				<div class="w-64 h-64 mx-auto mb-6 rounded-lg overflow-hidden shadow-2xl">
					<img 
						src={currentSong.cover} 
						alt={currentSong.album}
						class="w-full h-full object-cover"
					/>
				</div>

				<!-- Song Info -->
				<h1 class="text-2xl font-bold mb-2">{currentSong.title}</h1>
				<p class="text-lg text-gray-300 mb-1">{currentSong.artist}</p>
				<p class="text-sm text-gray-400 mb-6">{currentSong.album}</p>

				<!-- Progress Bar -->
				<div class="mb-6">
					<div class="flex justify-between text-xs text-gray-400 mb-1">
						<span>{formatTime(currentTime)}</span>
						<span>{formatTime(duration)}</span>
					</div>
					<div class="w-full bg-gray-600 rounded-full h-1">
						<div 
							class="bg-white h-1 rounded-full transition-all duration-1000"
							style="width: {(currentTime / duration) * 100}%"
						></div>
					</div>
				</div>

				<!-- Controls -->
				<div class="flex items-center justify-center space-x-4">
					<button 
						class="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
						onclick={previousTrack}
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
						</svg>
					</button>
					
					<button 
						class="p-4 bg-white text-black rounded-full hover:scale-105 transition-transform"
						onclick={togglePlay}
					>
						{#if isPlaying}
							<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
							</svg>
						{:else}
							<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z"/>
							</svg>
						{/if}
					</button>
					
					<button 
						class="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
						onclick={nextTrack}
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Bottom Controls -->
		<div class="bg-black bg-opacity-40 p-4 border-t border-gray-600">
			<div class="flex items-center justify-between">
				<!-- Volume -->
				<div class="flex items-center space-x-2">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
					</svg>
					<input 
						type="range" 
						min="0" 
						max="1" 
						step="0.1" 
						bind:value={volume}
						class="w-20 accent-white"
					>
				</div>

				<!-- Additional Controls -->
				<div class="flex items-center space-x-2">
					<button class="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
						</svg>
					</button>
					<button class="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
