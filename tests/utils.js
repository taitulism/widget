export const TITLE = 'My Widget';

const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

export function simulateMouseEnter (elm, x, y) {
	const event = createEvent('mouseenter', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

export function simulateMouseLeave (elm, x, y) {
	const event = createEvent('mouseleave', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

export function $byClassname (cls) {
	return document.getElementsByClassName(cls);
}

export function createTarget () {
	const target = document.createElement('div');
	target.id = 'target';
	target.innerHTML = `
		<ul>
			<li>AAA</li>
			<li>BBB</li>
			<li>CCC</li>
		</ul>
	`;

	return target;
}

export function createHeader () {
	const header = document.createElement('div');
	const headerSpan = document.createElement('span');
	header.id = 'custom-header';
	headerSpan.id = 'header-span';
	headerSpan.innerHTML = 'Custom Header';
	header.appendChild(headerSpan);

	return header;
}
