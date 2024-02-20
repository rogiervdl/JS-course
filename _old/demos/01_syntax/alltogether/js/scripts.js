const video = document.getElementById('video');
document.getElementById('lnkPlay').addEventListener('click', function () {
	if (video.paused) {
		video.play();
		this.innerHTML = 'stop';
	}
	else {
		video.pause();
		this.innerHTML = 'play';
	}
	return false;
});
document.getElementById('lnkMute').addEventListener('click', function () {
	if (video.volume > 0) {
		video.volume = 0;
		this.innerHTML = 'unmute';
	} else {
		video.volume = 1;
		this.innerHTML = 'mute';
	}
	return false;
});
document.getElementById('inpSeek').addEventListener('change', function () {
	video.currentTime = this.value;
});
document.getElementById('chbFunky').addEventListener('change', function () {
	if (this.checked) video.classList.add('funky');
	else video.classList.remove('funky');
});
