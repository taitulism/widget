const MINIMIZE_SYMBOL = '&#128469;';
const MAXIMIZE_SYMBOL = '&#128470;';
const CLOSE_SYMBOL = '&#10006;';

function widget (opts = {}) {
	return new Widget(opts);
}

function Widget (opts) {
	this.initMethods();
	this.createDOM(opts);

	this.draggable = null;
	this.isMinimized = false;
}

Widget.prototype.createDOM = function (opts) {
	this.elm = create('div', ['widget']);
	this.body = create('section', ['widget-body']);

	this.title = opts.title
		? create('div', ['widget-title'], opts.title)
		: null;

	this.closeBtn = opts.close
		? create('button', ['widget-btn', 'widget-close'], CLOSE_SYMBOL)
		: null;

	this.minimizeBtn = opts.minimize
		? create('button', ['widget-btn', 'widget-minimize'], MINIMIZE_SYMBOL)
		: null;

	const hasActions = Boolean(opts.close || opts.minimize);
	const hasHeader = Boolean(opts.title || hasActions);

	if (hasHeader) {
		this.header = create('header', ['widget-header']);

		this.title && this.header.appendChild(this.title);

		if (hasActions) {
			this.actions = create('div', ['widget-action-buttons']);

			this.minimizeBtn && this.actions.appendChild(this.minimizeBtn);
			this.closeBtn && this.actions.appendChild(this.closeBtn);

			this.header.appendChild(this.actions);
		}
		else {
			this.actions = null;
		}

		this.elm.appendChild(this.header);
	}
	else {
		this.header = null;
	}

	this.elm.appendChild(this.body);
};

Widget.prototype.initMethods = function (opts) {
	this.show = this.show.bind(this);
	this.hide = this.hide.bind(this);
	this.showActions = this.showActions.bind(this);
	this.hideActions = this.hideActions.bind(this);
	this.restore = this.restore.bind(this);
	this.minimize = this.minimize.bind(this);
	this.toggleMinimize = this.toggleMinimize.bind(this);
};

Widget.prototype.mount = function () {
	if (this.actions) {
		this.closeBtn && this.closeBtn.addEventListener('click', this.hide);
		this.minimizeBtn && this.minimizeBtn.addEventListener('click', this.toggleMinimize);

		this.elm.addEventListener('mouseenter', this.showActions);
		this.elm.addEventListener('mouseleave', this.hideActions);

		this.hideActions();
	}

	document.body.appendChild(this.elm);
	this.draggable = draggable(this.elm);

	return this;
};

Widget.prototype.unmount = function () {
	document.body.removeChild(this.elm);

	if (this.actions) {
		this.closeBtn && this.closeBtn.removeEventListener('click', this.hide);
		this.minimizeBtn && this.minimizeBtn.removeEventListener('click', this.toggleMinimize);
		this.elm.removeEventListener('mouseenter', this.showActions);
		this.elm.removeEventListener('mouseleave', this.hideActions);
		this.hideActions();
	}

	return this;
};

Widget.prototype.show = function () {
	this.elm.style.display = 'block';
	return this;
};

Widget.prototype.hide = function () {
	this.elm.style.display = 'none';
	return this;
};

Widget.prototype.showActions = function (ev) {
	this.actions.style.display = 'flex';
	return this;
};

Widget.prototype.hideActions = function (ev) {
	this.actions.style.display = 'none';
	return this;
};

Widget.prototype.restore = function () {
	this.minimizeBtn.innerHTML = MINIMIZE_SYMBOL;
	this.body.style.display = 'block';
	this.elm.classList.remove('minimized');
	return this;
};

Widget.prototype.minimize = function () {
	this.minimizeBtn.innerHTML = MAXIMIZE_SYMBOL;
	this.body.style.display = 'none';
	this.elm.classList.add('minimized');
	return this;
};

Widget.prototype.toggleMinimize = function () {
	this.isMinimized = !this.isMinimized;

	if (this.isMinimized) this.minimize();
	else this.restore();
};

Widget.prototype.setTitle = function (titleText) {
	this.title.innerText = titleText;
	return this;
};

Widget.prototype.destroy = function () {
	this.unmount();
	this.draggable.destroy();
};


function create (node, classnames, content) {
	const elm = document.createElement(node);
	elm.classList.add(...classnames);

	if (content) {
		elm.innerHTML = content;
	}

	return elm;
}
