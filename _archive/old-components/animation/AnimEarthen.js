import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


const playerCanvas = document.getElementById("player");
const context = playerCanvas.getContext("2d");

playerCanvas.width = 3840;
playerCanvas.height = 2160;

const playerFrameCount = 12;
const currentFrame = index => (
  `/earthen/player-frames/Player_Run-${(index + 1).toString().padStart(4, '0')}.png`
);

const images = []
const playerSprite = {
  frame: 0
};

for (let i = 0; i < playerFrameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

gsap.to(playerSprite, {
  frame: playerFrameCount - 1,
  snap: "frame",
  ease: "none",
	repeat: -1,
	duration: 0.9,
  // scrollTrigger: {
	// 	trigger: ".player-holder",
  //   scrub: 2,
	// 	markers: true,
	// 	start: "bottom bottom",
	// 	end: "bottom top",
  // },
  onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
});

images[0].onload = render;

function render() {
  context.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
  context.drawImage(images[playerSprite.frame], 0, 0); 
}
