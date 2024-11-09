<script>
	const toggleFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch (error) {
			console.error('Fullscreen failed', error);
		}
	};
</script>

<button class="fixed bottom-4 right-4 bg-black text-white" onclick={toggleFullscreen}
	>Fullscreen</button
>
