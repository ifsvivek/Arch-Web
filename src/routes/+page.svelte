<script>
	import { TopBar, Dock, Window } from '$components';
	import { desktopState } from '$lib/stores/desktop.svelte.js';
</script>

<!-- Desktop Background -->
<div
	class="fixed inset-0 bg-cover bg-center bg-no-repeat"
	style="background-image: url('/arch_wallpaper.png')"
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
