function widget (opts = {}) {
	return new Widget(opts);
}

function Widget (opts) {
	const elm = document.createElement('div');
	elm.classList.add('widget');
	this.elm = elm;
	this.isMinimized = false;

	if (opts.title) this.createTitle(opts.title);
	if (opts.close) this.createClose();
	if (opts.minimize) this.createMinimze();

	if (opts.close || opts.minimize) {
		this.createHeaderButtons();
		this.minimize && this.headerButtons.appendChild(this.minimize);
		this.close && this.headerButtons.appendChild(this.close);
	}

	if (opts.title || opts.close || opts.minimize) {
		this.header = this.createHeader();
		this.title && this.header.appendChild(this.title);
		(this.close || this.minimize) && this.header.appendChild(this.headerButtons);
		// this.minimize && this.header.appendChild(this.minimize);
		elm.appendChild(this.header);
	}

	this.createBody();
	elm.appendChild(this.body);
}

Widget.prototype.mount = function () {
	document.body.appendChild(this.elm);
	this.draggable = draggable(this.elm);
	return this;
};

Widget.prototype.createHeaderButtons = function () {
	const headerButtons = document.createElement('div');
	headerButtons.classList.add('widget-header-buttons');
	headerButtons.style.display = 'none';

	this.elm.addEventListener('mouseenter', (ev) => {
		headerButtons.style.display = 'flex';
	});

	this.elm.addEventListener('mouseleave', (ev) => {
		headerButtons.style.display = 'none';
	});

	this.headerButtons = headerButtons;
};

Widget.prototype.createClose = function () {
	const close = document.createElement('div');
	close.classList.add('widget-btn', 'widget-close');
	close.innerHTML = '&#10006;';

	close.addEventListener('click', (ev) => {
		this.elm.style.display = 'none';
	});

	this.close = close;
};

const MINIMIZE_SYMBOL = '&#128469;';
const MAXIMIZE_SYMBOL = '&#128470;';

Widget.prototype.createMinimze = function () {
	const minimize = document.createElement('div');
	minimize.classList.add('widget-btn', 'widget-minimize');
	minimize.innerHTML = MINIMIZE_SYMBOL;

	minimize.addEventListener('click', (ev) => {
		this.isMinimized = !this.isMinimized;

		if (this.isMinimized) {
			minimize.innerHTML = MAXIMIZE_SYMBOL;
			this.body.classList.add('minimized');
		}
		else {
			minimize.innerHTML = MINIMIZE_SYMBOL;
			this.body.classList.remove('minimized');
		}
	});

	this.minimize = minimize;
};

Widget.prototype.createTitle = function (titleText) {
	const title = document.createElement('div');
	title.classList.add('widget-title');
	this.title = title;
	this.setTitle(titleText);
};

Widget.prototype.setTitle = function (titleText) {
	this.title.innerText = titleText;
	return this;
};

Widget.prototype.createHeader = function () {
	const header = document.createElement('header');
	header.classList.add('widget-header');
	return header;
};

Widget.prototype.createBody = function () {
	const body = document.createElement('section');
	body.classList.add('widget-body-container');
	this.body = body;
	return this
};

Widget.prototype.hide = function () {
	this.elm.style.display = 'none';
	return this;
};

Widget.prototype.show = function () {
	this.elm.style.display = 'block';
	return this;
};
