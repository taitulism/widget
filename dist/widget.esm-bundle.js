function draggable (elm, opts) {
	return new Draggable(elm, opts);
}
// module.exports = draggable;
// export draggable = draggable;

function Draggable (elm, opts = {}) {
	this.onDragStart = this.onDragStart.bind(this);
	this.onDragging = this.onDragging.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.elm = elm;
	this.useGrip = false;
	this.gripHandle = null;
	this.isDraggable = true;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.events = {grab: [], drop: [], dragging: []};

	this.originalJsPosition = elm.style.position || null;
	const position = elm.style.position || window.getComputedStyle(elm).position;

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
	}

	const box = elm.getBoundingClientRect();

	elm.style.top = box.top + 'px';
	elm.style.left = box.left + 'px';

	document.body.appendChild(this.elm);

	elm.classList.add('draggable');

	if (opts.axis) {
		this.mouseUpContextElm = document;

		const axis = opts.axis.toLowerCase();

		if (axis === 'x')
			this.xAxis = true;
		else if (axis === 'y')
			this.yAxis = true;
	}
	else {
		this.mouseUpContextElm = elm;
		this.xAxis = true;
		this.yAxis = true;
	}

	this.setGrip(opts.grip);

	elm.addEventListener('mousedown', this.onDragStart);
}

Draggable.prototype.setGrip = function (grip) {
	if (!grip) {
		this.gripHandle = null;
		return;
	}

	this.useGrip = true;
	this.gripHandle = grip;

	if (typeof grip == 'string') {
		this.matchesGrip = createGripMatcher(grip, true);
	}
	else if (grip instanceof HTMLElement) {
		this.matchesGrip = createGripMatcher(grip, false);
	}
};

Draggable.prototype.on = function (eventName, callback) {
	this.events[eventName].push(callback);
	return this;
};

Draggable.prototype.onDragStart = function (ev) {
	if (!this.isDraggable) return;
	if (this.useGrip && !this.matchesGrip(ev.target)) return;

	this.box = this.elm.getBoundingClientRect();

	if (this.xAxis) {
		this.startMouseX = ev.clientX;
	}

	if (this.yAxis) {
		this.startMouseY = ev.clientY;
	}

	this.elm.classList.add('grabbed');

	document.addEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.addEventListener('mouseup', this.onDrop);

	this.events.grab.forEach(cb => cb(ev));
};

Draggable.prototype.onDragging = function (ev) {
	if (!this.isDraggable) return;

	if (this.xAxis) {
		const mouseMovedX = ev.clientX - this.startMouseX;
		this.elm.style.left = this.box.x + mouseMovedX  + 'px';
	}

	if (this.yAxis) {
		const mouseMovedY = ev.clientY - this.startMouseY;
		this.elm.style.top = this.box.y + mouseMovedY  + 'px';
	}

	this.elm.classList.replace('grabbed', 'dragging');
	this.events.dragging.forEach(cb => cb(ev));

	// prevent text selection while draging
	ev.preventDefault();
};

Draggable.prototype.onDrop = function (ev) {
	document.removeEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.removeEventListener('mouseup', this.onDrop);

	this.box = null;
	this.elm.classList.remove('grabbed', 'dragging');
	this.events.drop.forEach(cb => cb(ev));
};

Draggable.prototype.disable = function () {
	this.isDraggable = false;
	this.elm.classList.add('drag-disabled');
};

Draggable.prototype.enable = function () {
	this.isDraggable = true;
	this.elm.classList.remove('drag-disabled');
};

Draggable.prototype.destroy = function () {
	this.elm.removeEventListener('mousedown', this.onDragStart);
	document.removeEventListener('mousemove', this.onDragging);
	this.mouseUpContextElm.removeEventListener('mouseup', this.onDrop);

	if (this.originalJsPosition) {
		this.elm.style.position = this.originalJsPosition;
	}

	this.elm.classList.remove('draggable', 'grabbed', 'dragging');

	this.events = null;
	this.elm = null;
};

function isInside (child, parent) {
	const actualParentNode = child.parentNode;
	if (actualParentNode === parent) return true;
	if (actualParentNode === document.body || actualParentNode == null) return false;
	return isInside(actualParentNode, parent);
}

function createGripMatcher (grip, isSelector) {
	if (isSelector) { // grip is string
		return function (eventTarget) {
			return eventTarget.matches(grip) || eventTarget.closest(grip) != null;
		};
	}
	else { // grip is HTMLElement
		return function (eventTarget) {
			return grip == eventTarget || isInside(eventTarget, grip);
		};
	}
}

/* eslint-disable indent, no-magic-numbers */

function resizable (elm, opts) {
	return new Resizable(elm, opts);
}

const direction = {
	topLeft: 0,
	topRight: 1,
	btmRight: 2,
	btmLeft: 3,
};

function Resizable (elm, opts = {}) {
	this.showGrips = this.showGrips.bind(this);
	this.hideGrips = this.hideGrips.bind(this);
	this.onDragStart = this.onDragStart.bind(this);
	this.onDraggingTopLeft = this.onDraggingTopLeft.bind(this);
	this.onDraggingTopRight = this.onDraggingTopRight.bind(this);
	this.onDraggingBottomRight = this.onDraggingBottomRight.bind(this);
	this.onDraggingBottomLeft = this.onDraggingBottomLeft.bind(this);
	this.onDrop = this.onDrop.bind(this);

	this.minWidth = opts.minWidth || 0;
	this.minHeight = opts.minHeight || 0;
	this.startMouseX = 0;
	this.startMouseY = 0;
	this.boundDirection = null;
	this.gripMoveHandler = null;
	this.elm = elm;
	this.isResizable = true;
	this.gripSize = opts.gripSize || 10;
	this.gripOffset = this.gripSize / 2 * -1;
	this.originalPosition = elm.style.position || null;

	this.events = {
		startResize: [],
		resizing: [],
		stopResize: []
	};

	const position = elm.style.position || window.getComputedStyle(elm).position;

	const box = elm.getBoundingClientRect();

	if (position !== 'absolute') {
		elm.style.position = 'absolute';
		elm.style.top = box.top + 'px';
		elm.style.left = box.left + 'px';
	}

	if (box.width < this.minWidth) {
		elm.style.width = this.minWidth + 'px';
	}

	if (box.height < this.minHeight) {
		elm.style.height = this.minHeight + 'px';
	}

	this.topLeftGrip = this.createGrip('top-left-grip');
	this.topRightGrip = this.createGrip('top-right-grip');
	this.bottomRightGrip = this.createGrip('bottom-right-grip');
	this.bottomLeftGrip = this.createGrip('bottom-left-grip');

	elm.classList.add('resizable');

	// this.bindToggleGrips();
}

// Resizable.prototype.bindToggleGrips = function () {
// 	this.elm.addEventListener('mouseenter', this.showGrips);
// 	this.elm.addEventListener('mouseleave', this.hideGrips);

// 	this.forEachGrip((grip) => {
// 		grip.addEventListener('mouseenter', this.showGrips);
// 		grip.addEventListener('mouseleave', this.hideGrips);
// 	});
// };

// Resizable.prototype.unbindToggleGrips = function () {
// 	this.elm.removeEventListener('mouseenter', this.showGrips);
// 	this.elm.removeEventListener('mouseleave', this.hideGrips);
// };

Resizable.prototype.showGrips = function showGrips () {
	this.forEachGrip((grip) => {
		grip.style.opacity = '1';
	});
};

Resizable.prototype.hideGrips = function hideGrips () {
	this.forEachGrip((grip) => {
		grip.style.opacity = '0';
	});
};

Resizable.prototype.createGrip = function createGrip (className) {
	const grip = document.createElement('div');
	grip.classList.add('resize-grip', className);
	grip.style.position = 'absolute';
	grip.style.width = this.gripSize + 'px';
	grip.style.height = this.gripSize + 'px';
	grip.style.borderRadius = this.gripSize + 'px';
	grip.style.opacity = '0';
	grip.addEventListener('mousedown', this.onDragStart);

	switch (className) {
		case 'top-left-grip':
			grip.style.top = this.gripOffset + 'px';
			grip.style.left = this.gripOffset + 'px';
			grip.style.cursor = 'nw-resize';
			break;
		case 'top-right-grip':
			grip.style.top = this.gripOffset + 'px';
			grip.style.right = this.gripOffset + 'px';
			grip.style.cursor = 'ne-resize';
			break;
		case 'bottom-right-grip':
			grip.style.bottom = this.gripOffset + 'px';
			grip.style.right = this.gripOffset + 'px';
			grip.style.cursor = 'se-resize';
			break;
		case 'bottom-left-grip':
			grip.style.bottom = this.gripOffset + 'px';
			grip.style.left = this.gripOffset + 'px';
			grip.style.cursor = 'sw-resize';
			break;
	}

	this.elm.appendChild(grip);

	return grip;
};

Resizable.prototype.forEachGrip = function forEachGrip (callback) {
	callback(this.topLeftGrip);
	callback(this.topRightGrip);
	callback(this.bottomRightGrip);
	callback(this.bottomLeftGrip);
};

Resizable.prototype.on = function on (eventName, callback) {
	const lowerEventName = eventName.toLowerCase();
	if (lowerEventName.includes('start')) {
		this.events.startResize.push(callback);
	}
	else if (lowerEventName.includes('ing')) {
		this.events.resizing.push(callback);
	}
	else if (lowerEventName.includes('end') || lowerEventName.includes('stop')) {
		this.events.stopResize.push(callback);
	}
	return this;
};

Resizable.prototype.onDragStart = function onDragStart (ev) {
	if (!this.isResizable) return;
	this.startMouseX = ev.clientX;
	this.startMouseY = ev.clientY;

	this.elm.classList.add('resizing');
	this.box = this.elm.getBoundingClientRect();

	this.bindDraggingHandler(ev.target.classList);
	document.addEventListener('mouseup', this.onDrop);
	this.events.startResize.forEach(cb => cb(ev));
};

Resizable.prototype.bindDraggingHandler = function bindDraggingHandler (classList) {
	if (classList.contains('top-left-grip')) {
		this.boundDirection = direction.topLeft;
		document.addEventListener('mousemove', this.onDraggingTopLeft);
	}
	else if (classList.contains('top-right-grip')) {
		this.boundDirection = direction.topRight;
		document.addEventListener('mousemove', this.onDraggingTopRight);
	}
	else if (classList.contains('bottom-right-grip')) {
		this.boundDirection = direction.btmRight;
		document.addEventListener('mousemove', this.onDraggingBottomRight);
	}
	else if (classList.contains('bottom-left-grip')) {
		this.boundDirection = direction.btmLeft;
		document.addEventListener('mousemove', this.onDraggingBottomLeft);
	}
};

Resizable.prototype.onDraggingTopLeft = function onDraggingTopLeft (ev) {
	const mouseMovedX = this.startMouseX - ev.clientX;
	const mouseMovedY = this.startMouseY - ev.clientY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';
	this.elm.style.top = this.box.top - Math.max(mouseMovedY, (this.box.height - this.minHeight) * -1) + 'px';
	this.elm.style.left = this.box.left - Math.max(mouseMovedX, (this.box.width - this.minWidth) * -1) + 'px';

	this.events.resizing.forEach(cb => cb(ev));
};

Resizable.prototype.onDraggingTopRight = function onDraggingTopRight (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = this.startMouseY - ev.clientY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';
	this.elm.style.top = this.box.top - Math.max(mouseMovedY, (this.box.height - this.minHeight) * -1) + 'px';

	this.events.resizing.forEach(cb => cb(ev));
};

Resizable.prototype.onDraggingBottomRight = function onDraggingBottomRight (ev) {
	const mouseMovedX = ev.clientX - this.startMouseX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';

	this.events.resizing.forEach(cb => cb(ev));
};

Resizable.prototype.onDraggingBottomLeft = function onDraggingBottomLeft (ev) {
	const mouseMovedX = this.startMouseX - ev.clientX;
	const mouseMovedY = ev.clientY - this.startMouseY;

	this.elm.style.width = Math.max(this.minWidth, this.box.width + mouseMovedX) + 'px';
	this.elm.style.height = Math.max(this.minHeight, this.box.height + mouseMovedY) + 'px';
	this.elm.style.left = this.box.left - Math.max(mouseMovedX, (this.box.width - this.minWidth) * -1) + 'px';
	this.elm.style.bottom = this.box.bottom - Math.max(mouseMovedY, this.box.height * -1) + 'px';

	this.events.resizing.forEach(cb => cb(ev));
};

Resizable.prototype.onDrop = function onDrop (ev) {
	this.elm.classList.remove('resizing');

	let gripHandler;
	switch (this.boundDirection) {
		case direction.topLeft:
			gripHandler = this.onDraggingTopLeft;
			break;
		case direction.topRight:
			gripHandler = this.onDraggingTopRight;
			break;
		case direction.btmRight:
			gripHandler = this.onDraggingBottomRight;
			break;
		case direction.btmLeft:
			gripHandler = this.onDraggingBottomLeft;
			break;
	}

	document.removeEventListener('mousemove', gripHandler);
	document.removeEventListener('mouseup', this.onDrop);

	this.boundDirection = null;
	this.box = null;

	const box = this.elm.getBoundingClientRect();
	this.events.stopResize.forEach(cb => cb(ev, box));
};

Resizable.prototype.disable = function disable () {
	this.isResizable = false;
	this.elm.classList.add('resize-disabled');
	this.forEachGrip((grip) => {
		grip.style.display = 'none';
	});
	return this;
};

Resizable.prototype.enable = function enable () {
	this.isResizable = true;
	this.elm.classList.remove('resize-disabled');
	this.forEachGrip((grip) => {
		grip.style.display = '';
	});
	return this;
};

Resizable.prototype.destroy = function destroy () {
	this.forEachGrip((grip) => {
		grip.removeEventListener('mousedown', this.onDragStart);
	});

	this.destroyGrips();

	this.elm.classList.remove('resizable', 'resizing');
	if (this.originalPosition) {
		this.elm.style.position = this.originalPosition;
	}

	this.events = null;
	this.elm = null;
};

Resizable.prototype.destroyGrips = function destroyGrips () {
	this.hideGrips();
	// this.unbindToggleGrips();
	this.forEachGrip((grip) => {
		this.elm.removeChild(grip);
	});
	this.topLeftGrip = null;
	this.topRightGrip = null;
	this.bottomRightGrip = null;
	this.bottomLeftGrip = null;
};

const MINIMIZE_SYMBOL = '&#128469;';
const RESTORE_SYMBOL = '&#128470;';
const CLOSE_SYMBOL = '&#10006;';
const MAXIMIZE_SYMBOL = '&#9974;';

const DEFAULT_MIN_WIDTH = 250;
const DEFAULT_MIN_HEIGHT = 150;

function resolveArgs (maybeTitle, maybeBody, maybeOpts) {
	let title = null;
	let body = null;
	let opts = null;

	if (!maybeTitle && !maybeBody && !maybeOpts) {
		return [title, body, opts];
	}

	if (maybeOpts && typeof maybeOpts == 'object') {
		opts = maybeOpts;

		if (maybeBody instanceof HTMLElement) {
			body = maybeBody;
		}

		if (maybeTitle && typeof maybeTitle == 'string') {
			title = maybeTitle;
		}
	}
	else if (maybeBody) {
		if (maybeBody instanceof HTMLElement) {
			body = maybeBody;

			if (maybeTitle) {
				if (typeof maybeTitle == 'string') {
					title = maybeTitle;
				}
				else if (maybeTitle instanceof HTMLElement) {
					title = maybeTitle;
				}
			}
		}
		else if (typeof maybeBody == 'object') {
			opts = maybeBody;

			if (typeof maybeTitle == 'string') {
				title = maybeTitle;
			}
			else if (maybeTitle instanceof HTMLElement) {
				body = maybeTitle;
			}
		}
	}
	else if (maybeTitle) {
		if (typeof maybeTitle == 'string') {
			title = maybeTitle;
		}
		else if (maybeTitle instanceof HTMLElement) {
			body = maybeTitle;
		}
		else if (maybeTitle && typeof maybeTitle == 'object') {
			opts = maybeTitle;
		}
	}

	return [title, body, opts];
}

function resolveOptions (rawOpts) {
	if (!rawOpts) {
		return {
			id: null,
			classname: null,
			showHeader: true,
			showActions: true,
			showClose: true,
			showMinimize: true,
			showMaximize: true,
			toggleHeader: false,
			toggleActions: false,
			minWidth: DEFAULT_MIN_WIDTH,
			minHeight: DEFAULT_MIN_HEIGHT,
		};
	}

	return {
		id: rawOpts.id && typeof rawOpts.id == 'string' ? rawOpts.id : null,
		classname: typeof rawOpts.classname == 'string' || Array.isArray(rawOpts.classname) ? rawOpts.classname : null,
		showHeader: typeof rawOpts.showHeader == 'boolean' ? rawOpts.showHeader : true,
		showActions: typeof rawOpts.showActions == 'boolean' ? rawOpts.showActions : true,
		showClose: typeof rawOpts.showClose == 'boolean' ? rawOpts.showClose : true,
		showMinimize: typeof rawOpts.showMinimize == 'boolean' ? rawOpts.showMinimize : true,
		showMaximize: typeof rawOpts.showMaximize == 'boolean' ? rawOpts.showMaximize : true,
		toggleHeader: typeof rawOpts.toggleHeader == 'boolean' ? rawOpts.toggleHeader : false,
		toggleActions: typeof rawOpts.toggleActions == 'boolean' ? rawOpts.toggleActions : false,
		minWidth: typeof rawOpts.minWidth == 'number' ? rawOpts.minWidth : DEFAULT_MIN_WIDTH,
		minHeight: typeof rawOpts.minHeight == 'number' ? rawOpts.minHeight : DEFAULT_MIN_HEIGHT,
	};
}

function widget (...args) {
	const [title, body, rawOpts] = resolveArgs(...args);
	const opts = resolveOptions(rawOpts);
	return new Widget(title, body, opts);
}

function Widget (title, body, opts) {
	this.initMethods(opts);
	this.createDOM(title, body, opts);

	this.toggleHeader = opts.toggleHeader;
	this.toggleActions = opts.toggleActions;
	this.minWidth = opts.minWidth;
	this.minHeight = opts.minHeight;
	this.draggable = null;
	this.resizable = null;
	this.isMinimized = false;
	this.isMaximized = false;
	this.isMounted = false;
}


Widget.prototype.createWrapperElm = function createWrapperElm (opts) {
	const widgetClassnames = resolveClassnames(opts.classname);
	const elm = create('div', widgetClassnames);
	if (opts.id) elm.id = opts.id;

	return elm;
};

Widget.prototype.createDefaultHeader = function createDefaultHeader (titleText, opts) {
	const header = create('header', ['widget-header']);
	this.title = create('div', ['widget-title'], titleText);
	this.actions = null;
	this.closeBtn = null;
	this.minimizeBtn = null;
	this.maximizeBtn = null;

	header.appendChild(this.title);

	if (opts.showActions) {
		this.actions = create('div', ['widget-action-buttons']);

		if (opts.toggleActions) {
			this.hideActions();
		}

		if (opts.showMinimize) {
			this.minimizeBtn = create('button', ['widget-button', 'widget-minimize-button'], MINIMIZE_SYMBOL);
			this.minimizeBtn.setAttribute('title', 'Minimize');
			this.actions.appendChild(this.minimizeBtn);
		}

		if (opts.showMaximize) {
			this.maximizeBtn = create('button', ['widget-button', 'widget-maximize-button'], MAXIMIZE_SYMBOL);
			this.maximizeBtn.setAttribute('title', 'Maximize');
			this.actions.appendChild(this.maximizeBtn);
		}

		if (opts.showClose) {
			this.closeBtn = create('button', ['widget-button', 'widget-close-button'], CLOSE_SYMBOL);
			this.closeBtn.setAttribute('title', 'Close');
			this.actions.appendChild(this.closeBtn);
		}

		header.appendChild(this.actions);
	}
	this.header = header;

	if (opts.toggleHeader || opts.showHeader == false) {
		this.hideHeader();
	}

	return header;
};

Widget.prototype.createDOM = function createDOM (title, body, opts) {
	this.title = null;
	this.actions = null;
	this.closeBtn = null;
	this.minimizeBtn = null;
	this.maximizeBtn = null;
	this.elm = this.createWrapperElm(opts);
	this.bodyContainer = create('section', ['widget-body-container']);

	if (!title || typeof title == 'string') {
		this.header = this.createDefaultHeader(title, opts);
	}
	else if (title instanceof HTMLElement) {
		this.header = title;
		this.header.classList.add('widget-header');
		this.title = null;
	}

	this.elm.appendChild(this.header);

	if (body) {
		body.classList.add('widget-body');
		this.body = body;
		this.bodyContainer.appendChild(body);
	}
	else this.body = null;

	this.elm.appendChild(this.bodyContainer);
};

Widget.prototype.initMethods = function initMethods (opts) {
	if (opts.toggleHeader || opts.toggleActions) {
		this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
		this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
	}

	if (opts.showMinimize) {
		this.toggleMinimize = this.toggleMinimize.bind(this);
	}

	if (opts.showMaximize) {
		this.toggleMaximize = this.toggleMaximize.bind(this);
	}

	if (opts.showClose) {
		this.destroy = this.destroy.bind(this);
	}
};

Widget.prototype.mount = function mount () {
	if (this.isMounted) return;

	this.closeBtn && this.closeBtn.addEventListener('click', this.destroy);
	this.minimizeBtn && this.minimizeBtn.addEventListener('click', this.toggleMinimize);
	this.maximizeBtn && this.maximizeBtn.addEventListener('click', this.toggleMaximize);

	if (this.toggleHeader || this.toggleActions) {
		this.elm.addEventListener('mouseenter', this.mouseEnterHandler);
		this.elm.addEventListener('mouseleave', this.mouseLeaveHandler);
	}

	document.body.appendChild(this.elm);

	this.draggable = draggable(this.elm, {
		grip: this.title
	});

	this.resizable = resizable(this.elm, {
		minWidth: this.minWidth,
		minHeight: this.minHeight,
	});

	this.isMounted = true;

	return this;
};

Widget.prototype.unmount = function unmount () {
	if (!this.isMounted) return this;

	document.body.removeChild(this.elm);

	this.closeBtn && this.closeBtn.removeEventListener('click', this.destroy);
	this.minimizeBtn && this.minimizeBtn.removeEventListener('click', this.toggleMinimize);

	if (this.toggleHeader || this.toggleActions) {
		this.elm.removeEventListener('mouseenter', this.mouseEnterHandler);
		this.elm.removeEventListener('mouseleave', this.mouseLeaveHandler);
	}

	this.isMounted = false;

	return this;
};

Widget.prototype.mouseEnterHandler = function mouseEnterHandler (ev) {
	if (this.toggleHeader) {
		this.showHeader();
	}

	if (this.toggleActions) {
		this.showActions();
	}
};

Widget.prototype.mouseLeaveHandler = function mouseLeaveHandler () {
	if (this.toggleHeader && !this.isMinimized && !this.isMaximized) {
		this.hideHeader();
	}

	if (this.toggleActions) {
		this.hideActions();
	}
};

Widget.prototype.show = function show () {
	this.elm.style.display = '';
	return this;
};

Widget.prototype.hide = function hide () {
	this.elm.style.display = 'none';
	return this;
};

Widget.prototype.showHeader = function showHeader (grip) {
	this.header.style.visibility = '';
	this.bodyContainer.classList.remove('no-header');
	this.draggable.setGrip(grip || this.title);
	return this;
};

Widget.prototype.hideHeader = function hideHeader (grip) {
	this.header.style.visibility = 'hidden';
	this.bodyContainer.classList.add('no-header');
	this.draggable && this.draggable.setGrip(grip || this.bodyContainer);
	return this;
};

Widget.prototype.showActions = function showActions (ev) {
	this.actions.style.display = '';
	return this;
};

Widget.prototype.hideActions = function hideActions (ev) {
	this.actions.style.display = 'none';
	return this;
};

Widget.prototype.minimize = function minimize () {
	this.minimizeBtn.innerHTML = RESTORE_SYMBOL;
	this.elm.classList.add('minimized');
	this.minimizeBtn.classList.add('widget-button-active');

	if (this.toggleHeader || this.toggleActions) {
		this.showHeader();
	}

	this.isMinimized = true;
	return this;
};

Widget.prototype.unMinimize = function unMinimize () {
	this.minimizeBtn.innerHTML = MINIMIZE_SYMBOL;
	this.elm.classList.remove('minimized');
	this.minimizeBtn.classList.remove('widget-button-active');
	this.isMinimized = false;
	return this;
};

Widget.prototype.maximize = function maximize () {
	this.box = this.elm.getBoundingClientRect();
	const elmStyle = this.elm.style;

	elmStyle.width = '100%';
	elmStyle.height = '100%';
	elmStyle.top = '0px';
	elmStyle.left = '0px';

	this.maximizeBtn.innerHTML = RESTORE_SYMBOL;
	this.elm.classList.add('maximized');
	this.maximizeBtn.classList.add('widget-button-active');

	if (this.toggleHeader || this.toggleActions) {
		this.showHeader();
	}

	this.draggable.disable();
	this.resizable.disable();

	this.isMaximized = true;
	return this;
};

Widget.prototype.unMaximize = function unMaximize () {
	const elmStyle = this.elm.style;

	elmStyle.width = this.box.width + 'px';
	elmStyle.height = this.box.height + 'px';
	elmStyle.top = this.box.top + 'px';
	elmStyle.left = this.box.left + 'px';

	this.box = null;

	this.maximizeBtn.innerHTML = MAXIMIZE_SYMBOL;
	this.elm.classList.remove('maximized');
	this.maximizeBtn.classList.remove('widget-button-active');
	this.isMaximized = false;
	this.draggable.enable();
	this.resizable.enable();
	return this;
};

Widget.prototype.toggleMinimize = function toggleMinimize () {
	if (this.isMinimized) this.unMinimize();
	else this.minimize();
};

Widget.prototype.toggleMaximize = function toggleMaximize () {
	if (this.isMaximized) this.unMaximize();
	else this.maximize();
};

Widget.prototype.restoreSize = function restoreSize () {
	this.unMinimize();
	this.unMaximize();
	return this;
};

Widget.prototype.setTitle = function setTitle (newTitle) {
	this.title.innerText = newTitle;
	return this;
};

Widget.prototype.setBody = function setBody (newBody) {
	this.body.innerHTML = '';
	this.body.appendChild(newBody);
	return this;
};

Widget.prototype.setView = function setView (newTitle, newBody) {
	return this.setTitle(newTitle).setBody(newBody);
};

Widget.prototype.destroy = function destroy () {
	if (!this.isMounted) return;

	this.unmount();
	this.draggable.destroy();
	this.draggable = null;
	this.resizable.destroy();
	this.resizable = null;

	this.elm = null;
	this.header = null;
	this.bodyContainer = null;
	this.body = null;
	this.title = null;
	this.closeBtn = null;
	this.minimizeBtn = null;
	this.maximizeBtn = null;
	this.actions = null;
};


function create (node, classnames, content) {
	const elm = document.createElement(node);
	elm.classList.add(...classnames);

	if (content) {
		elm.innerHTML = content;
	}

	return elm;
}

function resolveClassnames (optsClassnames) {
	if (!optsClassnames) return ['widget'];

	if (typeof optsClassnames == 'string') {
		optsClassnames = optsClassnames.split(/\s+/);
	}

	if (Array.isArray(optsClassnames)) {
		optsClassnames.push('widget');
		return optsClassnames;
	}

	return ['widget'];
}

export default widget;
