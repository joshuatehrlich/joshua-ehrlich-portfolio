const imageSets = {
	screenshot: [
			'/earthen/screenshots/house.jpg',
			'/earthen/screenshots/bball.jpg',
			'/earthen/screenshots/puzz2.jpg',
			'/earthen/screenshots/pod-broken.jpg',
			'/earthen/screenshots/danger.jpg',
			'/earthen/screenshots/robot.jpg',
			'/earthen/screenshots/glade.jpg',
			'/earthen/screenshots/ladder.jpg'
	],
	conceptart: [
			'/earthen/concept-art/house.jpg',
			'/earthen/concept-art/bnw-puzzle.jpg',
			'/earthen/concept-art/rusty-new.jpg',
			'/earthen/concept-art/glades.jpg',
			'/earthen/concept-art/character.jpg',
			'/earthen/concept-art/sky.jpg',
			'/earthen/concept-art/balloon.jpg',
			'/earthen/concept-art/snake.jpg'
	],
};

document.querySelectorAll('.carousel').forEach(carousel => {
	
	const classNames = Array.from(carousel.classList);
	const className = classNames.find(name => imageSets[name]);
	if (!className) return; // Skip if no matching class name 
	const images = imageSets[className];

	const track = carousel.querySelector('.carousel__track');
	const dotsNav = carousel.querySelector('.carousel__nav');

	// Generate slide items
	images.forEach((src, index) => {
		const slide = document.createElement('li');
		slide.classList.add('carousel__slide');
		if (index === 0) slide.classList.add('current-slide');

		const img = document.createElement('img');
		img.src = src;
		img.classList.add('carousel__image');
		img.alt = `Slide ${index + 1}`;

		slide.appendChild(img);
		track.appendChild(slide);

		// Generate dot indicators
		const dot = document.createElement('button');
		dot.classList.add('carousel__indicator');
		if (index === 0) dot.classList.add('current-slide');
		dotsNav.appendChild(dot);
	});

	const slides = Array.from(track.children);
	const nextButton = carousel.querySelector('.carousel__button.right');
	const prevButton = carousel.querySelector('.carousel__button.left');
	const dots = Array.from(dotsNav.children);

	console.log(slides);

	const slideWidth = slides[0].getBoundingClientRect().width;

	const setSlidePosition = (slide, index) => {
			slide.style.left = slideWidth * index + 'px';
	};

	slides.forEach(setSlidePosition);

	const moveToSlide = (track, currentSlide, targetSlide) => {
			track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
			currentSlide.classList.remove('current-slide');
			targetSlide.classList.add('current-slide');
	};

	const updateDots = (currentDot, targetDot) => {
			currentDot.classList.remove('current-slide');
			targetDot.classList.add('current-slide');
	};

	const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
			if (targetIndex === 0) {
					prevButton.classList.add('is-hidden');
					nextButton.classList.remove('is-hidden');
			} else if (targetIndex === slides.length - 1) {
					prevButton.classList.remove('is-hidden');
					nextButton.classList.add('is-hidden');
			} else {
					prevButton.classList.remove('is-hidden');
					nextButton.classList.remove('is-hidden');
			}
	};

	prevButton.addEventListener('click', e => {
			const currentSlide = track.querySelector('.current-slide');
			const prevSlide = currentSlide.previousElementSibling;

			const currentDot = dotsNav.querySelector('.current-slide');
			const prevDot = currentDot.previousElementSibling;

			const prevIndex = slides.findIndex(slide => slide === prevSlide);

			moveToSlide(track, currentSlide, prevSlide);
			updateDots(currentDot, prevDot);
			hideShowArrows(slides, prevButton, nextButton, prevIndex);
	});

	nextButton.addEventListener('click', e => {
			const currentSlide = track.querySelector('.current-slide');
			const nextSlide = currentSlide.nextElementSibling;

			const currentDot = dotsNav.querySelector('.current-slide');
			const nextDot = currentDot.nextElementSibling;

			const nextIndex = slides.findIndex(slide => slide === nextSlide);

			moveToSlide(track, currentSlide, nextSlide);
			updateDots(currentDot, nextDot);
			hideShowArrows(slides, prevButton, nextButton, nextIndex);
	});

	dotsNav.addEventListener('click', e => {
			const targetDot = e.target.closest('button');
			if (!targetDot) return;

			const currentSlide = track.querySelector('.current-slide');
			const currentDot = dotsNav.querySelector('.current-slide');
			const targetIndex = dots.findIndex(dot => dot === targetDot);
			const targetSlide = slides[targetIndex];

			moveToSlide(track, currentSlide, targetSlide);
			updateDots(currentDot, targetDot);
			hideShowArrows(slides, prevButton, nextButton, targetIndex);
	});
});
