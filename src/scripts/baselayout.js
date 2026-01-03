let isOpen = false;
let isMobile = false;
const hamburgerMenu = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar');

document.addEventListener('DOMContentLoaded', () => {
	if (window.innerWidth < 850) {
		isMobile = true;
	}
});


if (hamburgerMenu) {
	hamburgerMenu.addEventListener('click', () => {
		if (sidebar) {
		if (isOpen) {
			(sidebar).style.transform = 'translateX(-100%)';
			isOpen = false;
		} else {
			(sidebar).style.transform = 'translateX(0px)';
			isOpen = true;
		}
		}
	});
}

const content = document.querySelector('.content');
if (content && isMobile) {
	content.addEventListener('click', () => {
		if (sidebar) {
		(sidebar).style.transform = 'translateX(-100%)';
		isOpen = false;
		}
	});
}

document.addEventListener('click', (event) => {
const hamburgers = document.querySelectorAll('.hamburger-menu-icon-line');
	if (isOpen) {
		hamburgers.forEach(hamburger => (hamburger).classList.add('open'));
	} else {
		hamburgers.forEach(hamburger => (hamburger).classList.remove('open'));
	}
});

export function openSidebar() {
	if (sidebar) {
		isOpen = true;
		sidebar.style.transform = 'translateX(0px)';
	}
}