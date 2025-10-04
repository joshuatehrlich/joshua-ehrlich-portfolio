import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.to(".parallax-content", {
	scrollTrigger: {
		startTrigger: "html",
		start: "100px 0px",
		endTrigger: "html",
		end: "80% top",
		scrub: true
	},
	backgroundColor: "black"
});