<script>
	import { Dock, TopBar, Window } from '$components';
	import { desktopState } from '$lib/stores/desktop.svelte.js';

	let showAppMenu = $state(false);

	function toggleAppMenu() {
		showAppMenu = !showAppMenu;
	}
</script>

<svelte:head>
	<title>Arch Linux Desktop</title>
</svelte:head>

<div
	class="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat"
	style="background-image: url('/arch_wallpaper.png'); background-color: #1a1b26;"
>
	<!-- Overlay for better contrast -->
	<div class="absolute inset-0 bg-black/20"></div>
	<!-- Top Bar -->
	<TopBar onActivitiesClick={toggleAppMenu} />

	<!-- App Menu Drawer is now handled by the Dock component -->
	{#if showAppMenu}
		<div class="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm" onclick={toggleAppMenu}></div>
	{/if}

	<!-- Desktop Area -->
	<div class="relative h-full pt-8 pl-20">
		<!-- App Windows -->
		{#each desktopState.windows as window (window.id)}
			<Window
				title={window.title}
				x={window.position.x}
				y={window.position.y}
				zIndex={window.id === desktopState.activeWindowId ? 1000 : 1}
				initialWidth={window.size.width}
				initialHeight={window.size.height}
				onClose={() => desktopState.closeWindow(window.id)}
			>
				{#snippet children()}
					{@render window.component()}
				{/snippet}
			</Window>
		{/each}
	</div>

	<!-- Dock -->
	<Dock onShowAllApps={toggleAppMenu} {showAppMenu} />
</div>
