/* global YT */

const youtubecontainers = [...document.querySelectorAll('.youtubecontainer')];
const playerIds = []
const players = {};
for (let i = 0; i < youtubecontainers.length; i++) {
  const ytc = youtubecontainers[i];
  const iframe = ytc.querySelector('iframe[src*=youtube]');
  if (!iframe) continue;
  if (!iframe.id) iframe.id = `player${(i + 1)}`;
  playerIds.push(iframe.id);
}

window.onYouTubeIframeAPIReady = function() {
  for (const id of playerIds) {
	 players[id] = new YT.Player(id);
	 const youtubeToc = document.querySelector(`#${id}`)?.closest('.youtubecontainer')?.querySelector('.youtube_toc');
	 if (!youtubeToc) continue;
	 const youtubeLinks = [...youtubeToc.querySelectorAll('a[href*=https]')];
	 for (const lnk of youtubeLinks) {
		lnk.addEventListener('click', (e) => {
		  e.preventDefault();
		  const start = lnk.href.includes('&t=') ? parseInt(lnk.href.split('&t=')[1]) : 0;
		  players[id].seekTo(start, true);
		  players[id].playVideo();
		});
	 }
  }
};
