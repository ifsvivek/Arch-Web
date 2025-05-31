<script>
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let currentSong = $state(null);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(75);
	let isMuted = $state(false);
	let shuffle = $state(false);
	let repeat = $state('none'); // 'none', 'one', 'all'
	let searchQuery = $state('');
	let activeView = $state('library'); // 'library', 'playlists', 'queue'
	let selectedPlaylist = $state(null);

	let playlist = $state([
		{
			id: 1,
			title: 'Bohemian Rhapsody',
			artist: 'Queen',
			album: 'A Night at the Opera',
			duration: 354,
			genre: 'Rock',
			year: 1975,
			cover: '🎵'
		},
		{
			id: 2,
			title: 'Hotel California',
			artist: 'Eagles',
			album: 'Hotel California',
			duration: 391,
			genre: 'Rock',
			year: 1976,
			cover: '🎸'
		},
		{
			id: 3,
			title: 'Imagine',
			artist: 'John Lennon',
			album: 'Imagine',
			duration: 183,
			genre: 'Pop',
			year: 1971,
			cover: '🎹'
		},
		{
			id: 4,
			title: 'Billie Jean',
			artist: 'Michael Jackson',
			album: 'Thriller',
			duration: 294,
			genre: 'Pop',
			year: 1982,
			cover: '🕺'
		},
		{
			id: 5,
			title: 'Stairway to Heaven',
			artist: 'Led Zeppelin',
			album: 'Led Zeppelin IV',
			duration: 482,
			genre: 'Rock',
			year: 1971,
			cover: '🪜'
		},
		{
			id: 6,
			title: 'Sweet Child O\' Mine',
			artist: 'Guns N\' Roses',
			album: 'Appetite for Destruction',
			duration: 356,
			genre: 'Rock',
			year: 1987,
			cover: '🌹'
		}
	]);

	let userPlaylists = $state([
		{ id: 1, name: 'Favorites', songs: [1, 3, 5], icon: '❤️' },
		{ id: 2, name: 'Rock Classics', songs: [1, 2, 5, 6], icon: '🎸' },
		{ id: 3, name: 'Chill', songs: [3], icon: '😌' }
	]);

	let queue = $state([]);

	const isDarkTheme = $derived(
		desktopState.currentTheme === 'dark' ||
		(desktopState.currentTheme === 'auto' &&
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	// Computed properties
	const filteredPlaylist = $derived(() => {
		if (!searchQuery) return playlist;
		return playlist.filter(
			song =>
				song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
				song.album.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	const currentPlaylistSongs = $derived(() => {
		if (selectedPlaylist) {
			return playlist.filter(song => selectedPlaylist.songs.includes(song.id));
		}
		return filteredPlaylist();
	});

	// Player functions
	function playSong(song) {
		if (currentSong?.id === song.id && isPlaying) {
			pauseMusic();
		} else {
			currentSong = song;
			isPlaying = true;
			currentTime = 0;
			duration = song.duration;
			
			// Add to queue if not already there
			if (!queue.find(q => q.id === song.id)) {
				queue = [song, ...queue.slice(0, 19)]; // Keep last 20 songs
			}
			
			// Simulate playback
			simulatePlayback();
		}
	}

	function playMusic() {
		isPlaying = true;
		simulatePlayback();
	}

	function pauseMusic() {
		isPlaying = false;
	}

	function stopMusic() {
		isPlaying = false;
		currentTime = 0;
	}

	function nextSong() {
		if (!currentSong) return;
		
		let nextIndex;
		if (shuffle) {
			nextIndex = Math.floor(Math.random() * currentPlaylistSongs().length);
		} else {
			const currentIndex = currentPlaylistSongs().findIndex(s => s.id === currentSong.id);
			nextIndex = (currentIndex + 1) % currentPlaylistSongs().length;
		}
		
		const nextSong = currentPlaylistSongs()[nextIndex];
		if (nextSong) playSong(nextSong);
	}

	function previousSong() {
		if (!currentSong) return;
		
		if (currentTime > 3) {
			currentTime = 0;
			return;
		}
		
		const currentIndex = currentPlaylistSongs().findIndex(s => s.id === currentSong.id);
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentPlaylistSongs().length - 1;
		const prevSong = currentPlaylistSongs()[prevIndex];
		if (prevSong) playSong(prevSong);
	}

	function seekTo(time) {
		currentTime = time;
	}

	function setVolume(newVolume) {
		volume = newVolume;
		isMuted = newVolume === 0;
	}

	function toggleMute() {
		isMuted = !isMuted;
	}

	function toggleShuffle() {
		shuffle = !shuffle;
	}

	function toggleRepeat() {
		const modes = ['none', 'one', 'all'];
		const currentIndex = modes.indexOf(repeat);
		repeat = modes[(currentIndex + 1) % modes.length];
	}

	function simulatePlayback() {
		if (!isPlaying || !currentSong) return;
		
		const interval = setInterval(() => {
			if (!isPlaying) {
				clearInterval(interval);
				return;
			}
			
			currentTime += 1;
			
			if (currentTime >= duration) {
				clearInterval(interval);
				if (repeat === 'one') {
					currentTime = 0;
					simulatePlayback();
				} else if (repeat === 'all' || currentPlaylistSongs().findIndex(s => s.id === currentSong.id) < currentPlaylistSongs().length - 1) {
					nextSong();
				} else {
					stopMusic();
				}
			}
		}, 1000);
	}

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function addToPlaylist(song, playlistId) {
		const playlistIndex = userPlaylists.findIndex(p => p.id === playlistId);
		if (playlistIndex !== -1 && !userPlaylists[playlistIndex].songs.includes(song.id)) {
			userPlaylists[playlistIndex].songs.push(song.id);
			userPlaylists = [...userPlaylists];
		}
	}

	function createPlaylist(name) {
		const newPlaylist = {
			id: Date.now(),
			name,
			songs: [],
			icon: '🎵'
		};
		userPlaylists = [...userPlaylists, newPlaylist];
	}

	function selectPlaylist(playlist) {
		selectedPlaylist = playlist;
		activeView = 'library';
	}

	function clearSelection() {
		selectedPlaylist = null;
	}
</script>

<div class="flex h-full flex-col {isDarkTheme ? 'bg-neutral-900/80 text-white' : 'bg-white/80 text-neutral-900'} backdrop-blur-xl">
	<!-- Header -->
	<div class="flex items-center justify-between {isDarkTheme ? 'bg-neutral-800/90 border-neutral-700' : 'bg-neutral-100/90 border-neutral-300'} border-b px-6 py-4">
		<div class="flex items-center space-x-4">
			<div class="text-2xl">🎵</div>
			<div>
				<h1 class="text-xl font-bold">Music Player</h1>
				<p class="text-sm opacity-70">{playlist.length} songs in library</p>
			</div>
		</div>
		
		<!-- Search -->
		<div class="relative flex-1 max-w-md mx-8">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search songs, artists, albums..."
				class="w-full rounded-lg border px-4 py-2 pr-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500/30 focus:outline-none
				{isDarkTheme 
					? 'bg-neutral-700/80 border-neutral-600 text-white placeholder-neutral-400' 
					: 'bg-white/80 border-neutral-300 text-neutral-900 placeholder-neutral-500'}"
			/>
			<svg class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
				<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
			</svg>
		</div>

		<!-- View Toggle -->
		<div class="flex rounded-lg {isDarkTheme ? 'bg-neutral-700/80' : 'bg-neutral-200/80'} p-1">
			{#each ['library', 'playlists', 'queue'] as view}
				<button
					onclick={() => activeView = view}
					class="rounded-md px-3 py-1 text-sm font-medium transition-all duration-200 capitalize
					{activeView === view 
						? (isDarkTheme ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
						: (isDarkTheme ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900')}"
				>
					{view}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		{#if activeView === 'playlists'}
			<div class="w-64 {isDarkTheme ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50/60 border-neutral-200'} border-r">
				<div class="p-4">
					<h3 class="font-semibold mb-4">Your Playlists</h3>
					<div class="space-y-2">
						<button
							onclick={clearSelection}
							class="w-full text-left rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105
							{!selectedPlaylist 
								? (isDarkTheme ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600')
								: (isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200')}"
						>
							<div class="flex items-center space-x-3">
								<span class="text-lg">🎵</span>
								<span class="font-medium">All Songs</span>
							</div>
						</button>
						{#each userPlaylists as playlist}
							<button
								onclick={() => selectPlaylist(playlist)}
								class="w-full text-left rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105
								{selectedPlaylist?.id === playlist.id 
									? (isDarkTheme ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600')
									: (isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200')}"
							>
								<div class="flex items-center space-x-3">
									<span class="text-lg">{playlist.icon}</span>
									<div class="flex-1">
										<div class="font-medium">{playlist.name}</div>
										<div class="text-xs opacity-70">{playlist.songs.length} songs</div>
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Main Content -->
		<div class="flex-1 overflow-auto">
			{#if activeView === 'library' || activeView === 'playlists'}
				<!-- Song List -->
				<div class="p-6">
					{#if selectedPlaylist}
						<div class="mb-6 flex items-center space-x-4">
							<div class="text-4xl">{selectedPlaylist.icon}</div>
							<div>
								<h2 class="text-2xl font-bold">{selectedPlaylist.name}</h2>
								<p class="opacity-70">{selectedPlaylist.songs.length} songs</p>
							</div>
							<button
								onclick={clearSelection}
								class="ml-auto rounded-lg px-3 py-1 text-sm transition-all duration-200 hover:scale-105
								{isDarkTheme ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}"
							>
								Back to Library
							</button>
						</div>
					{/if}

					<div class="space-y-2">
						{#each currentPlaylistSongs() as song, index}
							<div
								class="group flex items-center space-x-4 rounded-lg p-3 transition-all duration-200 hover:scale-[1.02]
								{currentSong?.id === song.id 
									? (isDarkTheme ? 'bg-purple-600/20' : 'bg-purple-100')
									: (isDarkTheme ? 'hover:bg-neutral-800/60' : 'hover:bg-neutral-100/60')}"
							>
								<!-- Play Button -->
								<button
									onclick={() => playSong(song)}
									class="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110
									{currentSong?.id === song.id && isPlaying 
										? 'bg-purple-500 text-white' 
										: (isDarkTheme ? 'bg-neutral-700 hover:bg-purple-600' : 'bg-neutral-200 hover:bg-purple-500 hover:text-white')}"
								>
									{#if currentSong?.id === song.id && isPlaying}
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
											<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
										</svg>
									{:else}
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
											<path d="M8 5v14l11-7z"/>
										</svg>
									{/if}
								</button>

								<!-- Song Cover -->
								<div class="text-2xl">{song.cover}</div>

								<!-- Song Info -->
								<div class="flex-1 min-w-0">
									<div class="font-semibold truncate">{song.title}</div>
									<div class="text-sm opacity-70 truncate">{song.artist} • {song.album}</div>
								</div>

								<!-- Song Details -->
								<div class="hidden sm:block text-right">
									<div class="text-sm opacity-70">{song.genre}</div>
									<div class="text-sm opacity-70">{song.year}</div>
								</div>

								<!-- Duration -->
								<div class="text-sm opacity-70 font-mono">
									{formatTime(song.duration)}
								</div>

								<!-- Actions Menu -->
								<div class="opacity-0 group-hover:opacity-100 transition-opacity">
									<button class="rounded-full p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}">
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else if activeView === 'queue'}
				<!-- Queue View -->
				<div class="p-6">
					<h2 class="text-2xl font-bold mb-6">Play Queue</h2>
					{#if queue.length === 0}
						<div class="text-center py-12">
							<div class="text-6xl mb-4">🎵</div>
							<h3 class="text-xl font-semibold mb-2">Queue is empty</h3>
							<p class="opacity-70">Songs you play will appear here</p>
						</div>
					{:else}
						<div class="space-y-2">
							{#each queue as song, index}
								<div class="flex items-center space-x-4 rounded-lg p-3 transition-all duration-200 hover:scale-[1.02] {isDarkTheme ? 'hover:bg-neutral-800/60' : 'hover:bg-neutral-100/60'}">
									<div class="text-sm opacity-70 w-6 text-center">{index + 1}</div>
									<div class="text-2xl">{song.cover}</div>
									<div class="flex-1">
										<div class="font-semibold">{song.title}</div>
										<div class="text-sm opacity-70">{song.artist}</div>
									</div>
									<button
										onclick={() => playSong(song)}
										class="rounded-full p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
									>
										<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
											<path d="M8 5v14l11-7z"/>
										</svg>
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Player Controls -->
	{#if currentSong}
		<div class="border-t {isDarkTheme ? 'bg-neutral-800/95 border-neutral-700' : 'bg-white/95 border-neutral-300'} backdrop-blur-xl">
			<!-- Progress Bar -->
			<div class="px-6 pt-4">
				<div class="flex items-center space-x-4">
					<span class="text-sm font-mono opacity-70">{formatTime(currentTime)}</span>
					<div class="flex-1 relative">
						<input
							type="range"
							min="0"
							max={duration}
							value={currentTime}
							oninput={(e) => seekTo(parseInt(e.target.value))}
							class="w-full h-2 rounded-full appearance-none cursor-pointer transition-all duration-200
							{isDarkTheme ? 'bg-neutral-600 accent-purple-500' : 'bg-neutral-300 accent-purple-600'}"
						/>
					</div>
					<span class="text-sm font-mono opacity-70">{formatTime(duration)}</span>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center justify-between px-6 py-4">
				<!-- Current Song Info -->
				<div class="flex items-center space-x-4 flex-1">
					<div class="text-3xl">{currentSong.cover}</div>
					<div class="min-w-0">
						<div class="font-semibold truncate">{currentSong.title}</div>
						<div class="text-sm opacity-70 truncate">{currentSong.artist}</div>
					</div>
				</div>

				<!-- Main Controls -->
				<div class="flex items-center space-x-4">
					<button
						onclick={toggleShuffle}
						class="rounded-full p-2 transition-all duration-200 hover:scale-110
						{shuffle 
							? 'text-purple-500' 
							: (isDarkTheme ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900')}"
						title="Shuffle"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
						</svg>
					</button>

					<button
						onclick={previousSong}
						class="rounded-full p-3 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
					>
						<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
							<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
						</svg>
					</button>

					<button
						onclick={isPlaying ? pauseMusic : playMusic}
						class="rounded-full bg-purple-500 p-4 text-white transition-all duration-200 hover:scale-110 hover:bg-purple-600"
					>
						{#if isPlaying}
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
								<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
							</svg>
						{:else}
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
								<path d="M8 5v14l11-7z"/>
							</svg>
						{/if}
					</button>

					<button
						onclick={nextSong}
						class="rounded-full p-3 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
					>
						<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
							<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
						</svg>
					</button>

					<button
						onclick={toggleRepeat}
						class="rounded-full p-2 transition-all duration-200 hover:scale-110
						{repeat !== 'none' 
							? 'text-purple-500' 
							: (isDarkTheme ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900')}"
						title="Repeat: {repeat}"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
						</svg>
						{#if repeat === 'one'}
							<span class="absolute -top-1 -right-1 text-xs">1</span>
						{/if}
					</button>
				</div>

				<!-- Volume Control -->
				<div class="flex items-center space-x-3 flex-1 justify-end">
					<button
						onclick={toggleMute}
						class="rounded-full p-2 transition-all duration-200 hover:scale-110 {isDarkTheme ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200'}"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
							{#if isMuted || volume === 0}
								<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
							{:else if volume < 50}
								<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
							{:else}
								<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
							{/if}
						</svg>
					</button>
					<input
						type="range"
						min="0"
						max="100"
						value={isMuted ? 0 : volume}
						oninput={(e) => setVolume(parseInt(e.target.value))}
						class="w-24 h-2 rounded-full appearance-none cursor-pointer transition-all duration-200
						{isDarkTheme ? 'bg-neutral-600 accent-purple-500' : 'bg-neutral-300 accent-purple-600'}"
					/>
					<span class="text-sm font-mono opacity-70 w-8">{isMuted ? 0 : volume}%</span>
				</div>
			</div>
		</div>
	{/if}
</div>