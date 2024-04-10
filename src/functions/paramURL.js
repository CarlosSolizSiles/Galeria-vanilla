function removeSearchParamWithoutReloading(currentUrl) {
	// Create a URL object
	let urlObject = new URL(currentUrl);

	// Remove the search parameter
	urlObject.searchParams.delete("q");

	// Change the URL without reloading the page
	history.pushState({}, "", urlObject.toString());
}
function addSearchParamWithoutReloading(currentUrl, searchParam) {
	// Create a URL object
	let urlObject = new URL(currentUrl);

	// Add the search parameter
	urlObject.searchParams.append("q", searchParam);

	// Change the URL without reloading the page
	history.pushState({}, "", urlObject.toString());
}
function extractSearchParam(currentUrl) {
	// Create a URL object
	let urlObject = new URL(currentUrl);

	// Extract the search parameter
	let searchParam = urlObject.searchParams.get("q");

	// Return the search parameter
	return searchParam;
}

export {
	addSearchParamWithoutReloading,
	removeSearchParamWithoutReloading,
	extractSearchParam,
};
