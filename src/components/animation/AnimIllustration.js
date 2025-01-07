import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.to(".parallax-content", {
	scrollTrigger: {
		trigger: '.header',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	opacity: 0,
	y: "15vw",
	ease: "none"
});

gsap.to(".parallax-viewport", {
	scrollTrigger: {
		trigger: '.header',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	backgroundPosition: "50% 0%",
	ease: "none"
});

gsap.from(".foot-image", {
	scrollTrigger: {
		trigger: '.foot-image',
		// markers: true,
		start: "top 50%",
		end: "bottom 50%",
		scrub: true
	},
	opacity: 0,
	y: -90
});

gsap.from(".foot-text", {
	scrollTrigger: {
		trigger: '.foot-image',
		// markers: true,
		start: "top 50%",
		end: "bottom 50%",
		scrub: true
	},
	opacity: 0,
	y: -90
});