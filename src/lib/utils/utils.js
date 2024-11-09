export const toggleFullscreen = async () => {
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
