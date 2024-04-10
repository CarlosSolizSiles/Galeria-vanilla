import {
	addSearchParamWithoutReloading,
	extractSearchParam,
	removeSearchParamWithoutReloading,
} from "./functions/paramURL";

const mainElement = document.querySelector("main");

const param = extractSearchParam(window.location.href);

mainElement.innerHTML = /*html*/ `<iframe title="Gallery" src="./gallery.html${typeof param === "string" ? "?q=" + param : ""}" class="h-full w-full"></iframe>`;

window.addEventListener(
	"message",
	function (event) {
		// Asegúrate de que el mensaje proviene de tu iframe
		if (event.source !== mainElement.childNodes[0].contentWindow) return;

		const { data } = event;

		switch (data.type) {
			case "addParam":
				addSearchParamWithoutReloading(window.location.href, data.param);
				break;

			case "deleteParam":
				removeSearchParamWithoutReloading(window.location.href);
				break;

			default:
				break;
		}
	},
	false,
);
