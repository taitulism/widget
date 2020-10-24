/* eslint-disable no-invalid-this */

import draggable from 'draggable-elm';
import resizable from 'resizable-elm';
import createWidgetDOM from './create-widget-dom';
import { MAXIMIZE_SYMBOL, MINIMIZE_SYMBOL } from './html-entities';

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
		createWidgetDOM(this, title, body, opts);
		initSubModules(this, opts);
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
		this.resizable.destroy();
		this.draggable = null;
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

function initSubModules (wgt) {
	const grip = wgt.isHeaderShown
		? wgt.title || wgt.header
		: wgt.bodyContainer
	;

	wgt.draggable = draggable(wgt.elm, {grip, top: 120, right: 120});
	wgt.resizable = resizable(wgt.elm, {
		minWidth: wgt.minWidth,
		minHeight: wgt.minHeight,
	});
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
