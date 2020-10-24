import create from './create-element';
import resolveClassnames from './resolve-classnames';
import { CLOSE_SYMBOL, MAXIMIZE_SYMBOL, MINIMIZE_SYMBOL } from './html-entities';

export default function createWidgetDOM (wgt, title, body, opts) {
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
