const MINIMIZE_SYMBOL = '&#128469;';
const MAXIMIZE_SYMBOL = '&#128470;';

function widget (opts = {}) {
	return new Widget(opts);
}

function Widget (opts) {
	this.showActions = this.showActions.bind(this);
	this.hideActions = this.hideActions.bind(this);
	this.minimize = this.minimize.bind(this);

	const elm = document.createElement('div');
	elm.classList.add('widget');
	this.elm = elm;
	this.header = null;
	this.title = null;
	this.actions = null;
	this.closeBtn = null;
	this.minimizeBtn = null;

	this.isMinimized = false;

	if (opts.title) this.createTitle(opts.title);
	if (opts.close) this.createClose();
	if (opts.minimize) this.createMinimze();

	if (opts.close || opts.minimize) {
		this.createActionsContainer();
		this.minimizeBtn && this.actions.appendChild(this.minimizeBtn);
		this.closeBtn && this.actions.appendChild(this.closeBtn);
	}

	if (opts.title || opts.close || opts.minimize) {
		this.createHeader();
		this.title && this.header.appendChild(this.title);
		(this.closeBtn || this.minimizeBtn) && this.header.appendChild(this.actions);
		elm.appendChild(this.header);
	}

	this.createBody();
	elm.appendChild(this.body);
}

Widget.prototype.createHeader = function () {
	const header = document.createElement('header');
	header.classList.add('widget-header');
	this.header = header;
};

Widget.prototype.createActionsContainer = function () {
	const actions = document.createElement('div');
	actions.classList.add('widget-header-buttons');
	actions.style.display = 'none';

	this.elm.addEventListener('mouseenter', this.showActions);
	this.elm.addEventListener('mouseleave', this.hideActions);

	this.actions = actions;
};

Widget.prototype.createClose = function () {
	const close = document.createElement('div');
	close.classList.add('widget-btn', 'widget-close');
	close.innerHTML = '&#10006;';

	close.addEventListener('click', (ev) => {
		this.elm.style.display = 'none';
	});

	this.closeBtn = close;
};

Widget.prototype.createMinimze = function () {
	const minimize = document.createElement('div');
	minimize.classList.add('widget-btn', 'widget-minimize');
	minimize.innerHTML = MINIMIZE_SYMBOL;

	minimize.addEventListener('click', this.minimize);

	this.minimizeBtn = minimize;
};

Widget.prototype.createTitle = function (titleText) {
	const title = document.createElement('div');
	title.classList.add('widget-title');
	this.title = title;
	this.setTitle(titleText);
};

Widget.prototype.createBody = function () {
	const body = document.createElement('section');
	body.classList.add('widget-body-container');
	this.body = body;
	return this
};

Widget.prototype.mount = function () {
	document.body.appendChild(this.elm);
	this.draggable = draggable(this.elm);
	return this;
};

Widget.prototype.unmount = function () {
	document.body.removeChild(this.elm);
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

Widget.prototype.setTitle = function (titleText) {
	this.title.innerText = titleText;
	return this;
};

Widget.prototype.hide = function () {
	this.elm.style.display = 'none';
	return this;
};

Widget.prototype.show = function () {
	this.elm.style.display = 'block';
	return this;
};

Widget.prototype.minimize = function () {
	this.isMinimized = !this.isMinimized;

	if (this.isMinimized) {
		this.minimizeBtn.innerHTML = MAXIMIZE_SYMBOL;
		this.elm.classList.add('minimized');
	}
	else {
		this.minimizeBtn.innerHTML = MINIMIZE_SYMBOL;
		this.elm.classList.remove('minimized');
	}
};

Widget.prototype.destroy = function () {
	this.unmount();

	if (this.actions) {
		this.elm.removeEventListener('mouseenter', this.showActions);
		this.elm.removeEventListener('mouseleave', this.hideActions);
		this.hideActions();
	}

	return this;
};
