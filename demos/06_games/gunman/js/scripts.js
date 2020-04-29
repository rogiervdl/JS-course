// sprites list
let sprites = [];

// sound fx
let sndSplash = new Audio('snd/splash.mp3');
let sndGun = new Audio('snd/gun.mp3');
sndGun.loop = true;

// DOM elements
const app = document.querySelector('#app');
const btnStop = document.querySelector('#btnStop');
const btnWalk = document.querySelector('#btnWalk');
const btnRun = document.querySelector('#btnRun');
const btnShoot = document.querySelector('#btnShoot');
const btnDie = document.querySelector('#btnDie');
const btnTurn = document.querySelector('#btnTurn');

// background offset
let bgOffsetX = -750;

// gunman
const gunman = {
	el: document.querySelector('#gunman'), // DOM element
	w: 150, // sprite width
	h: 150, // sprite height
	fps: 5, // frames per second
	isDead: false,
	startTime: new Date(), // in milliseconds
	direction: 1, // 1 = left, -1 = right
	state: 'walk', // stop, walk, die, shoot
	setState: function(state) { // sets sprite state
		sndGun.pause();
		this.startTime = new Date();
		this.state = state;
		this.fps = 15;
		if (state == 'run') this.fps = 15;
		if (state == 'walk') this.fps = 5;
		if (state == 'stop') this.fps = 3;
		if (state == 'die') sndSplash.play();
		if (state == 'shoot') sndGun.play();
	},
	frames: { // series of images from sprite sheet
		stop: [
			[0, 0]
		],
		walk: [
			[2, 0],
			[3, 0],
			[4, 0]
		],
		run: [
			[2, 0],
			[3, 0],
			[4, 0]
		],
		die: [
			[0, 1],
			[1, 1],
			[2, 1],
			[3, 1],
			[4, 1],
			[5, 1],
			[6, 1],
			[7, 1],
			[8, 1],
			[9, 1]
		],
		shoot: [
			[0, 0],
			[0, 0],
			[1, 0],
			[1, 0]
		]
	}
};

// add gunman to sprites list
sprites.push(gunman);

// render a sprite
const renderSprite = function (sprite) {
	// ignore dead sprites
	if (sprite.isDead) return;

	//
	const timePassed = new Date() - sprite.startTime;
	const currFrames = sprite.frames[sprite.state];
	let frameNr = parseInt(timePassed * sprite.fps / 1000);
	if (sprite.state == 'die' && frameNr >= currFrames.length) {
		sprite.isDead = true;
		return;
	}

	// adjust frame
	frameNr = frameNr % currFrames.length;
	sprite.el.style.backgroundPositionX = '-' + (sprite.w * currFrames[frameNr][0]) + 'px';
	sprite.el.style.backgroundPositionY = '-' + (sprite.h * currFrames[frameNr][1]) + 'px';
	sprite.el.style.transform = 'scaleX(' + sprite.direction + ')';

	// adjust background
	if (sprite.state == 'walk' || sprite.state == 'run') bgOffsetX += sprite.direction * sprite.fps / 5;
	app.style.backgroundPositionX = bgOffsetX + 'px';
}

const doLoop = function () {
	for (let sprite of sprites) renderSprite(sprite);
	requestAnimationFrame(doLoop);
}

window.addEventListener('load', function() {
	btnStop.addEventListener('click', function() {
		gunman.setState('stop');
	});
	btnWalk.addEventListener('click', function() {
		gunman.setState('walk');
	});
	btnRun.addEventListener('click', function() {
		gunman.setState('run');
	});
	btnShoot.addEventListener('click', function() {
		sndGun.play();
		gunman.setState('shoot');
	});
	btnDie.addEventListener('click', function() {
		gunman.setState('die');
	});
	btnTurn.addEventListener('click', function() {
		gunman.direction = gunman.direction * -1;
	});
	doLoop();

}); // end window.onload
