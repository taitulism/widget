/* eslint-disable no-invalid-this */

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

export default class Widget {
	constructor (title, body, opts) {
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

		initMethods(this, opts);
		createDOM(this, title, body, opts);
	}

	mount () {
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
	}

	unmount () {
		if (!this.isMounted) return this;
		unmountHeader(this, true);
		document.body.removeChild(this.elm);
		this.isMounted = false;
		return this;
	}

	show () {
		this.elm.style.display = '';
		return this;
	}

	hide () {
		this.elm.style.display = 'none';
		return this;
	}

	showHeader (grip) {
		this.isHeaderShown = true;
		this.header.style.visibility = '';
		this.bodyContainer.classList.remove('no-header');
		this.draggable.setGrip(grip || this.title || this.header);
		return this;
	}

	hideHeader (grip) {
		this.isHeaderShown = false;
		this.header.style.visibility = 'hidden';
		this.bodyContainer.classList.add('no-header');
		this.draggable && this.draggable.setGrip(grip || this.bodyContainer);
		return this;
	}

	showActions () {
		this.actions.style.display = '';
		return this;
	}

	hideActions () {
		this.actions.style.display = 'none';
		return this;
	}

	minimize () {
		if (this.isMinimized) return this;

		this.elm.classList.add('minimized');
		this.minimizeBtn.classList.add('winjet-button-active');
		this.bodyContainer.style.display = 'none';

		if (this.toggleHeader || this.toggleActions) {
			this.showHeader();
		}

		this.isMinimized = true;
		return this;
	}

	unMinimize () {
		if (!this.isMinimized) return this;

		this.minimizeBtn.innerHTML = MINIMIZE_SYMBOL;
		this.elm.classList.remove('minimized');
		this.minimizeBtn.classList.remove('winjet-button-active');
		this.bodyContainer.style.display = '';
		this.isMinimized = false;
		return this;
	}

	maximize () {
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
	}

	unMaximize () {
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
	}

	toggleMinimize () {
		if (this.isMinimized) this.unMinimize();
		else this.minimize();
	}

	toggleMaximize () {
		if (this.isMaximized) this.unMaximize();
		else this.maximize();
	}

	restoreSize () {
		this.unMinimize();
		this.unMaximize();
		return this;
	}

	setTitle (newTitle) {
		this.title.innerText = newTitle;
		return this;
	}

	setHeader (newHeader) {
		unmountHeader(this);
		this.title = null;
		this.header.replaceWith(newHeader);
		this.header = newHeader;
		this.draggable.setGrip(newHeader);
		newHeader.classList.add('winjet-header');
		return this;
	}

	setBody (newBody) {
		this.bodyContainer.innerHTML = '';
		this.bodyContainer.appendChild(newBody);
		this.body = newBody;
		return this;
	}

	setView (newTitle, newBody) {
		return this.setTitle(newTitle).setBody(newBody);
	}

	destroy () {
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
	}
}

/* ---------------------------------------------------------------------------------------------- */

function mouseEnterHandler () {
	if (this.toggleHeader) {
		this.showHeader();
	}

	if (this.toggleActions) {
		this.showActions();
	}
}

function mouseLeaveHandler () {
	if (this.toggleHeader && !this.isMinimized && !this.isMaximized) {
		this.hideHeader();
	}

	if (this.toggleActions) {
		this.hideActions();
	}
}

/* ---------------------------------------------------------------------------------------------- */

function createWrapperElm (opts) {
	const widgetClassnames = resolveClassnames(opts.classname);
	const elm = create('div', widgetClassnames);
	if (opts.id) elm.id = opts.id;
	elm.style.position = 'absolute';

	return elm;
}

function createDefaultHeader (wgt, titleText, opts) {
	const header = create('header', ['winjet-default-header']);
	wgt.title = create('div', ['winjet-title'], titleText);
	wgt.actions = null;
	wgt.closeBtn = null;
	wgt.minimizeBtn = null;
	wgt.maximizeBtn = null;

	header.appendChild(wgt.title);

	if (opts.showActions) {
		wgt.actions = create('div', ['winjet-action-buttons']);

		if (opts.toggleActions) {
			wgt.hideActions();
		}

		if (opts.showMinimize) {
			wgt.minimizeBtn = create('button', ['winjet-button', 'winjet-minimize-button'], MINIMIZE_SYMBOL);
			wgt.minimizeBtn.setAttribute('title', 'Minimize');
			wgt.actions.appendChild(wgt.minimizeBtn);
		}

		if (opts.showMaximize) {
			wgt.maximizeBtn = create('button', ['winjet-button', 'winjet-maximize-button'], MAXIMIZE_SYMBOL);
			wgt.maximizeBtn.setAttribute('title', 'Maximize');
			wgt.actions.appendChild(wgt.maximizeBtn);
		}

		if (opts.showClose) {
			wgt.closeBtn = create('button', ['winjet-button', 'winjet-close-button'], CLOSE_SYMBOL);
			wgt.closeBtn.setAttribute('title', 'Close');
			wgt.actions.appendChild(wgt.closeBtn);
		}

		header.appendChild(wgt.actions);
	}
	wgt.header = header;

	if (opts.toggleHeader || !opts.showHeader) {
		wgt.hideHeader();
	}

	return header;
}

function createDOM (wgt, title, body, opts) {
	wgt.title = null;
	wgt.actions = null;
	wgt.closeBtn = null;
	wgt.minimizeBtn = null;
	wgt.maximizeBtn = null;
	wgt.elm = createWrapperElm(opts);
	wgt.bodyContainer = create('section', ['winjet-body-container']);

	if (!title || typeof title == 'string') {
		wgt.header = createDefaultHeader(wgt, title, opts);
	}
	else if (title instanceof HTMLElement) {
		wgt.header = title;
		wgt.title = null;
	}

	wgt.header.classList.add('winjet-header');
	wgt.elm.appendChild(wgt.header);

	if (body) {
		body.classList.add('winjet-body');
		wgt.body = body;
		wgt.bodyContainer.appendChild(body);
	}
	else wgt.body = null;

	wgt.elm.appendChild(wgt.bodyContainer);
}

function initMethods (wgt, opts) {
	if (opts.toggleHeader || opts.toggleActions) {
		wgt.mouseEnterHandler = mouseEnterHandler.bind(wgt);
		wgt.mouseLeaveHandler = mouseLeaveHandler.bind(wgt);
	}

	if (opts.showMinimize) {
		wgt.toggleMinimize = wgt.toggleMinimize.bind(wgt);
	}

	if (opts.showMaximize) {
		wgt.toggleMaximize = wgt.toggleMaximize.bind(wgt);
	}

	if (opts.showClose) {
		wgt.destroy = wgt.destroy.bind(wgt);
	}
}

function unmountHeader (wgt, includeHover = false) {
	wgt.closeBtn && wgt.closeBtn.removeEventListener(MOUSE_CLICK, wgt.destroy);
	wgt.minimizeBtn && wgt.minimizeBtn.removeEventListener(MOUSE_CLICK, wgt.toggleMinimize);
	wgt.maximizeBtn && wgt.maximizeBtn.removeEventListener(MOUSE_CLICK, wgt.toggleMaximize);

	if (includeHover && (wgt.toggleHeader || wgt.toggleActions)) {
		wgt.elm.removeEventListener(MOUSE_ENTER, wgt.mouseEnterHandler);
		wgt.elm.removeEventListener(MOUSE_LEAVE, wgt.mouseLeaveHandler);
	}
}

