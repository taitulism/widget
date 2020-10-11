import draggable from 'draggable-elm';
import resizable from 'resizable-elm';

import create from './create-element';
import resolveClassnames from './resolve-classnames';

const MINIMIZE_SYMBOL = '&#128469;';
const MAXIMIZE_SYMBOL = '&#128470;';
const CLOSE_SYMBOL = '&#10006;';

const MOUSE_CLICK = 'click';
const MOUSE_ENTER = 'mouseenter';
const MOUSE_LEAVE = 'mouseleave';

export default function Widget (title, body, opts) {
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

	this.closeBtn && this.closeBtn.addEventListener(MOUSE_CLICK, this.destroy);
	this.minimizeBtn && this.minimizeBtn.addEventListener(MOUSE_CLICK, this.toggleMinimize);
	this.maximizeBtn && this.maximizeBtn.addEventListener(MOUSE_CLICK, this.toggleMaximize);

	if (this.toggleHeader || this.toggleActions) {
		this.elm.addEventListener(MOUSE_ENTER, this.mouseEnterHandler);
		this.elm.addEventListener(MOUSE_LEAVE, this.mouseLeaveHandler);
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
	this.closeBtn && this.closeBtn.removeEventListener(MOUSE_CLICK, this.destroy);
	this.minimizeBtn && this.minimizeBtn.removeEventListener(MOUSE_CLICK, this.toggleMinimize);
	this.maximizeBtn && this.maximizeBtn.removeEventListener(MOUSE_CLICK, this.toggleMaximize);

	if (includeHover && (this.toggleHeader || this.toggleActions)) {
		this.elm.removeEventListener(MOUSE_ENTER, this.mouseEnterHandler);
		this.elm.removeEventListener(MOUSE_LEAVE, this.mouseLeaveHandler);
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
