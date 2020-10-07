var widget = (function () {
	'use strict';

	function draggable (elm, opts) {
		return new Draggable(elm, opts);
	}

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
		this.events = {
			grab: [],
			drop: [],
			dragging: []
		};

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

			if (axis === 'x') this.xAxis = true;
			else if (axis === 'y') this.yAxis = true;
		}
		else {
			this.mouseUpContextElm = elm;
			this.xAxis = true;
			this.yAxis = true;
		}

		this.setGrip(opts.grip);

		elm.addEventListener('mousedown', this.onDragStart);
	}

	Draggable.prototype.setGrip = function setGrip (grip) {
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

	Draggable.prototype.on = function on (eventName, callback) {
		this.events[eventName].push(callback);
		return this;
	};

	Draggable.prototype.onDragStart = function onDragStart (ev) {
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

	Draggable.prototype.onDragging = function onDragging (ev) {
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

	Draggable.prototype.onDrop = function onDrop (ev) {
		document.removeEventListener('mousemove', this.onDragging);
		this.mouseUpContextElm.removeEventListener('mouseup', this.onDrop);

		this.box = null;
		this.elm.classList.remove('grabbed', 'dragging');
		this.events.drop.forEach(cb => cb(ev));
	};

	Draggable.prototype.disable = function disable () {
		this.isDraggable = false;
		this.elm.classList.add('drag-disabled');
	};

	Draggable.prototype.enable = function enable () {
		this.isDraggable = true;
		this.elm.classList.remove('drag-disabled');
	};

	Draggable.prototype.destroy = function destroy () {
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
		if (isSelector) { // `grip` is a string
			return function gripMatcher (eventTarget) {
				return eventTarget.matches(grip) || eventTarget.closest(grip) != null;
			};
		}

		// `grip` is an HTMLElement
		return function gripMatcher (eventTarget) {
			return grip === eventTarget || isInside(eventTarget, grip);
		};
	}

	/* eslint-disable indent, no-magic-numbers */

	function resizable (elm, opts) {
		return new Resizable(elm, opts);
	}

	const px = 'px';

	function bindListener (elm, eventName, callback) {
		elm.addEventListener(eventName, callback, false);

		return function off () {
			elm.removeEventListener(eventName, callback, false);
		};
	}

	function calculateWidth (width, diff, minWidth) {
		return Math.max(width - diff, minWidth);
	}

	function calculateHeight (height, diff, minHeight) {
		return Math.max(height - diff, minHeight);
	}

	function calculateLeft (left, minWidth, width, mouseDiff) {
		return left + Math.min(mouseDiff, width - minWidth);
	}

	function calculateTop (top, minHeight, height, mouseDiff) {
		return top + Math.min(mouseDiff, height - minHeight);
	}

	const direction = {
		top: 0,
		right: 1,
		bottom: 2,
		left: 3,
		topLeft: 4,
		topRight: 5,
		bottomRight: 6,
		bottomLeft: 7,
	};

	const gripsDefinitions = {
		[direction.top]: {
			propName: 'grip',
			name: 'top',
			cursor: 'n',
			position: 'top',
			isCorner: false,
			isXAxis: false,
			isYAxis: true,
			moveHandler (startBox, XDiff, YDiff) {
				return {
					height: calculateHeight(startBox.height, YDiff, this.minHeight),
					top: calculateTop(startBox.top, this.minHeight, startBox.height, YDiff),
				};
			}
		},

		[direction.right]: {
			propName: 'grip',
			name: 'right',
			cursor: 'e',
			position: 'right',
			isCorner: false,
			isXAxis: true,
			isYAxis: false,
			moveHandler (startBox, XDiff) {
				return {
					width: calculateWidth(startBox.width, -XDiff, this.minWidth),
				};
			}
		},

		[direction.bottom]: {
			propName: 'grip',
			name: 'bottom',
			cursor: 's',
			position: 'bottom',
			isCorner: false,
			isXAxis: false,
			isYAxis: true,
			moveHandler (startBox, XDiff, YDiff) {
				return {
					height: calculateHeight(startBox.height, -YDiff, this.minHeight),
				};
			}
		},

		[direction.left]: {
			propName: 'grip',
			name: 'left',
			cursor: 'w',
			position: 'left',
			isCorner: false,
			isXAxis: true,
			isYAxis: false,
			moveHandler (startBox, XDiff) {
				return {
					width: calculateWidth(startBox.width, XDiff, this.minWidth),
					left: calculateLeft(startBox.left, this.minWidth, startBox.width, XDiff),
				};
			}
		},

		[direction.topLeft]: {
			propName: 'topLeft',
			name: 'top-left',
			cursor: 'nw',
			position: ['top', 'left'],
			isCorner: true,
			moveHandler (startBox, XDiff, YDiff) {
				return {
					width: calculateWidth(startBox.width, XDiff, this.minWidth),
					height: calculateHeight(startBox.height, YDiff, this.minHeight),
					left: calculateLeft(startBox.left, this.minWidth, startBox.width, XDiff),
					top: calculateTop(startBox.top, this.minHeight, startBox.height, YDiff),
				};
			}
		},

		[direction.topRight]: {
			propName: 'topRight',
			name: 'top-right',
			cursor: 'ne',
			position: ['top', 'right'],
			isCorner: true,
			moveHandler (startBox, XDiff, YDiff) {
				return {
					width: calculateWidth(startBox.width, -XDiff, this.minWidth),
					height: calculateHeight(startBox.height, YDiff, this.minHeight),
					top: calculateTop(startBox.top, this.minHeight, startBox.height, YDiff),
				};
			}
		},

		[direction.bottomRight]: {
			propName: 'bottomRight',
			name: 'bottom-right',
			cursor: 'se',
			position: ['bottom', 'right'],
			isCorner: true,
			moveHandler (startBox, XDiff, YDiff) {
				return {
					width: calculateWidth(startBox.width, -XDiff, this.minWidth),
					height: calculateHeight(startBox.height, -YDiff, this.minHeight),
				};
			}
		},

		[direction.bottomLeft]: {
			propName: 'bottomLeft',
			name: 'bottom-left',
			cursor: 'sw',
			position: ['bottom', 'left'],
			isCorner: true,
			moveHandler (startBox, XDiff, YDiff) {
				return {
					width: calculateWidth(startBox.width, XDiff, this.minWidth),
					height: calculateHeight(startBox.height, -YDiff, this.minHeight),
					left: calculateLeft(startBox.left, this.minWidth, startBox.width, XDiff),
				};
			}
		},
	};

	function getGripCreator (gripSize) {
		const gripSizePx = gripSize + px;
		const gripOffset = (gripSize / 2 * -1) + px;

		return function createGrip (gripDefKey) {
			const {
				propName,
				name,
				cursor,
				position,
				isCorner,
				isXAxis,
				isYAxis,
				moveHandler,
			} = gripsDefinitions[gripDefKey];

			const grip = document.createElement('div');
			const gripStyle = grip.style;
			const gripClassname = `${name}-grip`;

			gripStyle.position = 'absolute';
			gripStyle.width = isYAxis ? '100%' : gripSizePx;
			gripStyle.height = isXAxis ? '100%' : gripSizePx;
			gripStyle.cursor = `${cursor}-resize`;
			gripStyle.borderRadius = gripSizePx;
			gripStyle.opacity = '0';

			if (isCorner) {
				position.forEach((pos) => {
					gripStyle[pos] = gripOffset;
				});
			}
			else {
				gripStyle[position] = gripOffset;
			}

			grip.classList.add('resize-grip', gripClassname);

			return {elm: grip, moveHandler, propName};
		};
	}

	function Resizable (elm, opts = {}) {
		this.minWidth = opts.minWidth || 0;
		this.minHeight = opts.minHeight || 0;
		this.elm = elm;
		this.isResizable = true;
		this.originalPosition = elm.style.position || null;
		this.destructionQueue = [];
		this.unbindMouseMove = null;
		this.grip = null;
		this.grips = {};

		this.events = {
			startResize: [],
			resizing: [],
			stopResize: [],
		};

		this.initMethods();
		this.initGrips(opts.gripSize, opts.direction);
		this.initElm(elm);
	}

	Resizable.prototype.initMethods = function initMethods () {
		this.onResizeStart = this.onResizeStart.bind(this);
		this.onDrop = this.onDrop.bind(this);
	};

	Resizable.prototype.initGrips = function initGrips (gripSize, gripDirection) {
		const createGrip = getGripCreator(gripSize || 10);

		if (gripDirection) {
			const {elm, moveHandler} = createGrip(direction[gripDirection]);
			this.grip = elm;
			this.elm.appendChild(elm);

			const unbind = bindListener(elm, 'mousedown', (ev) => {
				this.onResizeStart(ev, moveHandler);
			});

			this.destructionQueue.push(unbind);
		}
		else {
			[
				direction.topLeft,
				direction.topRight,
				direction.bottomRight,
				direction.bottomLeft,
			].forEach((gripDir) => {
				const {propName, elm, moveHandler} = createGrip(gripDir);
				this.grips[propName] = elm;
				this.elm.appendChild(elm);

				const unbind = bindListener(elm, 'mousedown', (ev) => {
					this.onResizeStart(ev, moveHandler);
				});

				this.destructionQueue.push(unbind);
			});
		}
	};

	Resizable.prototype.initElm = function initElm (elm) {
		const position = elm.style.position || window.getComputedStyle(elm).position;
		const box = elm.getBoundingClientRect();

		if (position !== 'absolute') {
			elm.style.position = 'absolute';
			elm.style.top = box.top + px;
			elm.style.left = box.left + px;
		}

		if (box.width < this.minWidth) {
			elm.style.width = this.minWidth + px;
		}

		if (box.height < this.minHeight) {
			elm.style.height = this.minHeight + px;
		}

		elm.classList.add('resizable');
	};

	Resizable.prototype.showGrips = function showGrips () {
		return this.forEachGrip((grip) => {
			grip.style.opacity = '1';
		});
	};

	Resizable.prototype.hideGrips = function hideGrips () {
		return this.forEachGrip((grip) => {
			grip.style.opacity = '0';
		});
	};

	Resizable.prototype.forEachGrip = function forEachGrip (callback) {
		if (this.grip) {
			callback(this.grip);
		}
		else {
			callback(this.grips.topLeft);
			callback(this.grips.topRight);
			callback(this.grips.bottomRight);
			callback(this.grips.bottomLeft);
		}

		return this;
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

	Resizable.prototype.onResizeStart = function onResizeStart (startEvent, moveHandler) {
		if (!this.isResizable) return;

		const startMouseX = startEvent.clientX;
		const startMouseY = startEvent.clientY;

		const startBox = this.elm.getBoundingClientRect();
		this.elm.classList.add('grabbed');

		this.unbindMouseMove && this.unbindMouseMove();
		this.unbindMouseMove = bindListener(document, 'mousemove', (moveEvent) => {
			const XDiff = moveEvent.clientX - startMouseX;
			const YDiff = moveEvent.clientY - startMouseY;

			const newBox = moveHandler.call(this, startBox, XDiff, YDiff);
			this.updateElm(newBox);
			this.elm.classList.replace('grabbed', 'resizing');
			this.events.resizing.forEach(cb => cb(moveEvent, {
				width: newBox.width,
				height: newBox.height,
			}));

			moveEvent.preventDefault();
		});

		document.addEventListener('mouseup', this.onDrop);
		this.events.startResize.forEach(cb => cb(startEvent));
	};

	Resizable.prototype.updateElm = function updateElm ({width, height, top, left}) {
		const elmStyle = this.elm.style;

		if (width) elmStyle.width = width + px;
		if (height) elmStyle.height = height + px;
		if (top) elmStyle.top = top + px;
		if (left) elmStyle.left = left + px;
	};

	Resizable.prototype.onDrop = function onDrop (dropEvent) {
		this.elm.classList.remove('grabbed', 'resizing');
		this.unbindMouseMove();
		this.unbindMouseMove = null;
		document.removeEventListener('mouseup', this.onDrop);

		const newBox = this.elm.getBoundingClientRect();
		this.events.stopResize.forEach(cb => cb(dropEvent, newBox));
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
		this.destructionQueue.forEach(callback => callback());
		this.forEachGrip((grip) => {
			this.elm.removeChild(grip);
		});
		this.grips = null;
	};

	const MINIMIZE_SYMBOL = '&#128469;';
	const RESTORE_SYMBOL = '&#128470;';
	const CLOSE_SYMBOL = '&#10006;';
	const MAXIMIZE_SYMBOL = '&#9974;';

	const DEFAULT_MIN_WIDTH = 180;
	const DEFAULT_MIN_HEIGHT = 110;

	/* eslint-disable-next-line complexity */
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

		this.isHeaderShown = opts.showHeader;
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
		elm.style.position = 'absolute';

		return elm;
	};

	Widget.prototype.createDefaultHeader = function createDefaultHeader (titleText, opts) {
		const header = create('header', ['winjet-default-header']);
		this.title = create('div', ['winjet-title'], titleText);
		this.actions = null;
		this.closeBtn = null;
		this.minimizeBtn = null;
		this.maximizeBtn = null;

		header.appendChild(this.title);

		if (opts.showActions) {
			this.actions = create('div', ['winjet-action-buttons']);

			if (opts.toggleActions) {
				this.hideActions();
			}

			if (opts.showMinimize) {
				this.minimizeBtn = create('button', ['winjet-button', 'winjet-minimize-button'], MINIMIZE_SYMBOL);
				this.minimizeBtn.setAttribute('title', 'Minimize');
				this.actions.appendChild(this.minimizeBtn);
			}

			if (opts.showMaximize) {
				this.maximizeBtn = create('button', ['winjet-button', 'winjet-maximize-button'], MAXIMIZE_SYMBOL);
				this.maximizeBtn.setAttribute('title', 'Maximize');
				this.actions.appendChild(this.maximizeBtn);
			}

			if (opts.showClose) {
				this.closeBtn = create('button', ['winjet-button', 'winjet-close-button'], CLOSE_SYMBOL);
				this.closeBtn.setAttribute('title', 'Close');
				this.actions.appendChild(this.closeBtn);
			}

			header.appendChild(this.actions);
		}
		this.header = header;

		if (opts.toggleHeader || !opts.showHeader) {
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
		this.bodyContainer = create('section', ['winjet-body-container']);

		if (!title || typeof title == 'string') {
			this.header = this.createDefaultHeader(title, opts);
		}
		else if (title instanceof HTMLElement) {
			this.header = title;
			this.title = null;
		}

		this.header.classList.add('winjet-header');
		this.elm.appendChild(this.header);

		if (body) {
			body.classList.add('winjet-body');
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

		const grip = this.isHeaderShown
			? this.title || this.header
			: this.bodyContainer
		;

		this.draggable = draggable(this.elm, {grip});
		this.resizable = resizable(this.elm, {
			minWidth: this.minWidth,
			minHeight: this.minHeight,
		});

		this.isMounted = true;

		return this;
	};

	Widget.prototype.unmount = function unmount () {
		if (!this.isMounted) return this;
		this.unmountHeader(true);
		document.body.removeChild(this.elm);
		this.isMounted = false;
		return this;
	};

	Widget.prototype.unmountHeader = function unmountHeader (includeHover = false) {
		this.closeBtn && this.closeBtn.removeEventListener('click', this.destroy);
		this.minimizeBtn && this.minimizeBtn.removeEventListener('click', this.toggleMinimize);
		this.maximizeBtn && this.maximizeBtn.removeEventListener('click', this.toggleMaximize);

		if (includeHover && (this.toggleHeader || this.toggleActions)) {
			this.elm.removeEventListener('mouseenter', this.mouseEnterHandler);
			this.elm.removeEventListener('mouseleave', this.mouseLeaveHandler);
		}
	};

	Widget.prototype.mouseEnterHandler = function mouseEnterHandler () {
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
		this.isHeaderShown = true;
		this.header.style.visibility = '';
		this.bodyContainer.classList.remove('no-header');
		this.draggable.setGrip(grip || this.title || this.header);
		return this;
	};

	Widget.prototype.hideHeader = function hideHeader (grip) {
		this.isHeaderShown = false;
		this.header.style.visibility = 'hidden';
		this.bodyContainer.classList.add('no-header');
		this.draggable && this.draggable.setGrip(grip || this.bodyContainer);
		return this;
	};

	Widget.prototype.showActions = function showActions () {
		this.actions.style.display = '';
		return this;
	};

	Widget.prototype.hideActions = function hideActions () {
		this.actions.style.display = 'none';
		return this;
	};

	Widget.prototype.minimize = function minimize () {
		if (this.isMinimized) return this;

		this.minimizeBtn.innerHTML = RESTORE_SYMBOL;
		this.elm.classList.add('minimized');
		this.minimizeBtn.classList.add('winjet-button-active');
		this.bodyContainer.style.display = 'none';

		if (this.toggleHeader || this.toggleActions) {
			this.showHeader();
		}

		this.isMinimized = true;
		return this;
	};

	Widget.prototype.unMinimize = function unMinimize () {
		if (!this.isMinimized) return this;

		this.minimizeBtn.innerHTML = MINIMIZE_SYMBOL;
		this.elm.classList.remove('minimized');
		this.minimizeBtn.classList.remove('winjet-button-active');
		this.bodyContainer.style.display = '';
		this.isMinimized = false;
		return this;
	};

	Widget.prototype.maximize = function maximize () {
		if (this.isMaximized) return this;

		this.box = this.elm.getBoundingClientRect();
		const elmStyle = this.elm.style;

		elmStyle.width = '100%';
		elmStyle.height = '100%';
		elmStyle.top = '0px';
		elmStyle.left = '0px';

		this.maximizeBtn.innerHTML = RESTORE_SYMBOL;
		this.elm.classList.add('maximized');
		this.maximizeBtn.classList.add('winjet-button-active');

		if (this.toggleHeader || this.toggleActions) {
			this.showHeader();
		}

		this.draggable.disable();
		this.resizable.disable();

		this.isMaximized = true;
		return this;
	};

	Widget.prototype.unMaximize = function unMaximize () {
		if (!this.isMaximized) return this;

		const elmStyle = this.elm.style;

		elmStyle.width = this.box.width + 'px';
		elmStyle.height = this.box.height + 'px';
		elmStyle.top = this.box.top + 'px';
		elmStyle.left = this.box.left + 'px';

		this.box = null;

		this.maximizeBtn.innerHTML = MAXIMIZE_SYMBOL;
		this.elm.classList.remove('maximized');
		this.maximizeBtn.classList.remove('winjet-button-active');
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

	Widget.prototype.setHeader  = function setHeader  (newHeader) {
		this.unmountHeader();
		this.title = null;
		this.header.replaceWith(newHeader);
		this.header = newHeader;
		this.draggable.setGrip(newHeader);
		newHeader.classList.add('winjet-header');
		return this;
	};

	Widget.prototype.setBody = function setBody (newBody) {
		this.bodyContainer.innerHTML = '';
		this.bodyContainer.appendChild(newBody);
		this.body = newBody;
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
		if (!optsClassnames) return ['winjet'];

		if (typeof optsClassnames == 'string') {
			optsClassnames = optsClassnames.split(/\s+/u);
		}

		if (Array.isArray(optsClassnames)) {
			optsClassnames.push('winjet');
			return optsClassnames;
		}

		return ['winjet'];
	}

	return widget;

}());
