<script>
	import { TopBar, Dock, Window } from '$components';
	import { desktopState } from '$lib/stores/desktop.svelte.js';
</script>

<!-- Desktop Background -->
<div class="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
	<!-- Arch Linux wallpaper pattern -->
	<div class="absolute inset-0 opacity-10">
		<svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
			<defs>
				<pattern id="arch-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
					<circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3" />
				</pattern>
			</defs>
			<rect width="100" height="100" fill="url(#arch-pattern)" />
		</svg>
	</div>

	<!-- Arch Linux logo in center -->
	<div class="absolute inset-0 flex items-center justify-center opacity-5">
		<svg class="h-64 w-64" viewBox="0 0 100 100" fill="currentColor">
			<path d="M50 5 L90 85 L10 85 Z" stroke="currentColor" stroke-width="2" fill="none" />
			<path d="M50 25 L75 70 L25 70 Z" stroke="currentColor" stroke-width="1" fill="none" />
		</svg>
	</div>
</div>

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
