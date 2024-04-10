import IMAGES from "./assets/images.json";
import { extractSearchParam } from "./functions/paramURL";
import { getPosition, setPosition } from "./functions/positionScroll";

const bodyElement = document.querySelector("body");
const param = extractSearchParam(window.location.href);
let selectedImage = undefined;
let position = 0;

const changeImage = () => {
	window.parent.postMessage({ type: "deleteParam" }, "*");
	window.parent.postMessage({ type: "addParam", param: selectedImage }, "*");
	document.startViewTransition(() => updateDOMWithSelectedImage());
};

const updateDOMWithSelectedImage = () => {
	bodyElement.innerHTML = /*html*/ `
    <figure class="flex size-full items-center justify-center overflow-hidden px-16 text-white pt-2 select-none"><img src="${IMAGES[selectedImage]}" alt="" style="view-transition-name:  image_${selectedImage}" class="aspect-video object-contain" draggable="false" /><button type="button" data-button="left" class="absolute size-10 p-1 bg-blue-500 hover:bg-blue-400 left-4 rounded-full shadow-lg"><svg class="size-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/></svg></button><button type="button" data-button="right" class="absolute size-10 p-1 bg-blue-500 hover:bg-blue-400 right-4 rounded-full shadow-lg"><svg class="size-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg></button><button type="button" data-button="close" class="absolute size-10 p-1 bg-red-500 hover:bg-red-400 top-4 right-4 rounded-full shadow-lg"><svg class="size-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg></button></figure>`;
};

const handleImageClick = (e) => {
	const targetFigure = e.target.closest("figure");
	const targetButton = e.target.closest("figure > button[data-button]");

	if (!targetButton && !targetFigure) return;

	if (targetButton) {
		const type = targetButton.getAttribute("data-button");
		switch (type) {
			case "left":
				console.log("left");
				selectedImage -= 1;
				selectedImage =
					selectedImage === -1 ? IMAGES.length - 1 : selectedImage;
				changeImage();
				break;
			case "right":
				console.log("right");
				selectedImage += 1;
				selectedImage =
					selectedImage === IMAGES.length ? 0 : selectedImage;
				changeImage();
				break;
			case "close":
				console.log("close");
				selectedImage = undefined;
				window.parent.postMessage({ type: "deleteParam" }, "*");
				document.startViewTransition(() => loadGallery());
				break;
			default:
				break;
		}
		return;
	}

	if (selectedImage !== undefined) {
		return;
	}

	selectedImage = Number(targetFigure.childNodes[0].getAttribute("data-id"));

	if (selectedImage !== undefined) {
		position = getPosition();
		changeImage();
	}
};

const createImageCard = (src, id) =>
	/*html*/ `<figure class="max-sm:p-2 overflow-hidden shadow-md shadow-[rgba(0,0,0,0.5)] min-h-[370px]"><img data-src="${src}" draggable="false" alt="" class="aspect-video min-h-[370px] object-cover" style="view-transition-name: image_${id}" data-id="${id}"/></figure>`;

const loadGallery = () => {
	let galleryHTML =
		localStorage.render ??
		/*html*/ `<section class="container mx-auto grid gap-2.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${IMAGES.map(createImageCard).join("")}</section>`;

	bodyElement.innerHTML = galleryHTML;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target.childNodes[0];
				const url = img.getAttribute("data-src");
				if (url) {
					img.style.display = "inline-block";
					img.setAttribute("src", url);
				}
			}
		});
	});

	bodyElement.lastElementChild.childNodes.forEach((figure) => {
		observer.observe(figure);
	});

	setPosition(position);
	localStorage.render = galleryHTML;
};

bodyElement.addEventListener("click", handleImageClick);

localStorage.clear();

if (typeof param === "string") {
	selectedImage = Number(param);
	updateDOMWithSelectedImage();
} else {
	loadGallery();
}
