<script>
	import { TopBar, Dock, Window } from '$components';
	import { desktopState } from '$lib/stores/desktop.svelte.js';
	
	// Debug the wallpaper style
	$effect(() => {
		console.log('Current wallpaper:', desktopState.currentWallpaper);
		console.log('Wallpaper style:', desktopState.wallpaperStyle());
	});
</script>

<!-- Desktop Background -->
<div
	class="fixed inset-0 z-0"
	style="{desktopState.wallpaperStyle()} background-color: #1e3a8a;"
></div>

<!-- Desktop Components -->
<TopBar />
<Dock />

<!-- Desktop Area -->
<div class="fixed top-8 right-0 bottom-0 left-16 overflow-hidden">
	<!-- Windows -->
	{#each desktopState.windows as window (window.id)}
		<Window {window} />
	{/each}
</div>

<svelte:head>
	<title>Arch Linux Desktop</title>
</svelte:head>
