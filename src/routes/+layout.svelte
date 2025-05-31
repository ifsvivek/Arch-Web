<script>
	import '../app.css';

	let { children } = $props();
</script>

<div class="h-screen w-screen overflow-hidden bg-neutral-900 font-sans">
	{@render children()}
</div>
