import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.to(".p6", {
	scrollTrigger: {
		trigger: 'html',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	y: "30vw",
	ease: "none"
});

gsap.to(".p5", {
	scrollTrigger: {
		trigger: 'html',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	y: "25vw",
	ease: "none"
});

gsap.to(".p4", {
	scrollTrigger: {
		trigger: 'html',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	y: "20vw",
	ease: "none"
});

gsap.to(".p3", {
	scrollTrigger: {
		trigger: 'html',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	y: "15vw",
	ease: "none"
});

gsap.to(".p2", {
	scrollTrigger: {
		trigger: 'html',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	y: "10vw",
	ease: "none"
});

gsap.to(".p1", {
	scrollTrigger: {
		trigger: 'html',
		endTrigger: '.parallax-content',
		start: "0px 0px",
		end: "bottom top",
		scrub: true
	},
	y: "10vw",
	ease: "none"
});

gsap.to(".parallax-content", {
	scrollTrigger: {
		startTrigger: ".title",
		start: "100px 0px",
		endTrigger: ".title",
		end: "80% top",
		scrub: true
	},
	backgroundColor: "black"
});