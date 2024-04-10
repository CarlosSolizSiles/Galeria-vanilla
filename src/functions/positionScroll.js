const getPosition = () =>  window.scrollY;


const setPosition = (num) => {
	window.scrollTo(0, num);
}

export { getPosition, setPosition };
