/* global widget */

// const widget = require('../widget');

const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

function simulateMouseEnter (elm, x, y) {
	const event = createEvent('mouseenter', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseLeave (elm, x, y) {
	const event = createEvent('mouseleave', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateDragNDrop (elm, moveX, moveY) {
	simulateMouseDown(elm, 0, 0);
	simulateMouseMove(elm, moveX, moveY);
	simulateMouseUp(elm, moveX, moveY);
}

describe('widget', () => {
	let testDOMContainer, container, target, box, body;

	before(() => {
		body = document.body;

		testDOMContainer = document.getElementById('test-dom-container');
		if (!testDOMContainer) {
			testDOMContainer = document.createElement('div');
			testDOMContainer.id = 'test-dom-container';
			document.body.appendChild(testDOMContainer);
		}
	});

	beforeEach(() => {
		container = document.createElement('div');
		container.id = 'container';

		target = document.createElement('div');
		target.id = 'target';

		container.appendChild(target);
		testDOMContainer.appendChild(container);

		box = target.getBoundingClientRect();

		Array.from(document.getElementsByClassName('widget')).forEach((wgt) => {
			wgt.parentNode.removeChild(wgt);
		});
	});

	afterEach(() => {
		target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;

		box = null;

		// Array.from(document.getElementsByClassName('widget')).forEach((wgt) => {
		// 	wgt.parentNode.removeChild(wgt);
		// });
	});

	after(() => {
		body = null;
		testDOMContainer = null;
	});

	it('is a function', () => expect(widget).to.be.a('function'));

	it('returns a widget instance', () => {
		const widgetInstance = widget(target);
		const ctor = Object.getPrototypeOf(widgetInstance).constructor;

		expect(ctor.name).to.equal('Widget');
	});

	describe('.mount()', () => {
		it('appends a new widget element to the <body>', () => {
			const wgt = widget();

			expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('widget')).to.have.lengthOf(1);
		});

		it('makes the widget element draggable', () => {
			const wgt = widget();

			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(1);
		});
	});

	describe('.unmount()', () => {
		it('removes the widget element from the <body>', () => {
			const wgt = widget();

			expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('widget')).to.have.lengthOf(1);
			wgt.unmount();
			expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
		});
	});

	describe('.show() / .hide()', () => {
		it('toggles the widget visibility', () => {
			const wgt = widget().mount();

			expect(wgt.elm.style.display).to.not.equal('none');
			wgt.hide();
			expect(wgt.elm.style.display).to.equal('none');
			wgt.show();
			expect(wgt.hide()).to.eql(wgt);
			expect(wgt.show()).to.eql(wgt);
		});

		it('returns the widget instance', () => {
			const wgt = widget().mount();
			expect(wgt.hide()).to.eql(wgt);
			expect(wgt.show()).to.eql(wgt);
		});
	});

	describe('.showActions() / .hideActions()', () => {
		it('toggles the action buttons visibility', () => {
			const wgt = widget({close: true}).mount();

			expect(wgt.actions.style.display).to.equal('none');
			wgt.showActions();
			expect(wgt.actions.style.display).to.equal('flex');
			wgt.hideActions();
			expect(wgt.actions.style.display).to.equal('none');
		});

		it('returns the widget instance', () => {
			const wgt = widget({close: true}).mount();
			expect(wgt.showActions()).to.eql(wgt);
			expect(wgt.hideActions()).to.eql(wgt);
		});
	});

	describe('.minimize()', () => {
		it('minimizes the widget', () => {
			const wgt = widget({minimize: true}).mount();

			expect(wgt.elm.classList.contains('minimized')).to.be.false;
			expect(wgt.body.style.display).to.not.equal('none');
			wgt.minimize();
			expect(wgt.elm.classList.contains('minimized')).to.be.true;
			expect(wgt.body.style.display).to.equal('none');
		});
	});

	describe('.restore()', () => {
		it('restores the widget size (unMinimize)', () => {
			const wgt = widget({minimize: true}).mount();

			wgt.minimize();
			expect(wgt.elm.classList.contains('minimized')).to.be.true;
			expect(wgt.body.style.display).to.equal('none');
			wgt.restore();
			expect(wgt.elm.classList.contains('minimized')).to.be.false;
			expect(wgt.body.style.display).to.not.equal('none');
		});
	});

	describe('.setTitle()', () => {
		it('changes the widget title', () => {
			const wgt = widget({title: 'My Widget'});
			expect(wgt.title.innerText).to.equal('My Widget');
			wgt.setTitle('New Title');
			expect(wgt.title.innerText).to.equal('New Title');
		});
	});

	describe('Elements & ClassNames', () => {
		describe('Main Element', () => {
			it('is stored in `elm` property', () => {
				const wgt = widget();
				expect(wgt.elm).to.be.instanceOf(HTMLElement);
			});

			it('has classnames', () => {
				const wgt = widget();

				expect(wgt.elm.classList.contains('widget')).to.be.true;
				expect(wgt.elm.classList.contains('draggable')).to.be.false;
				wgt.mount();
				expect(wgt.elm.classList.contains('draggable')).to.be.true;
			});
		});

		describe('Widget Header', () => {
			it('is stored in `header` property', () => {
				const wgt = widget({title: 'My Widget'});
				expect(wgt.header).to.be.instanceOf(HTMLElement);
			});

			it('has a classname', () => {
				const wgt = widget({title: 'My Widget'});
				expect(wgt.header.classList.contains('widget-header')).to.be.true;
			});

			describe('Widget Title', () => {
				it('is stored in `title` property', () => {
					const wgt = widget({title: 'My Widget'});
					expect(wgt.title).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					const wgt = widget({title: 'My Widget'});
					expect(wgt.title.classList.contains('widget-title')).to.be.true;
				});
			});

			describe('Widget Action Buttons', () => {
				it('is stored in `actions` property', () => {
					const wgt = widget({minimize: true});
					expect(wgt.actions).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					const wgt = widget({minimize: true});
					expect(wgt.actions.classList.contains('widget-action-buttons')).to.be.true;
				});
			});

			describe('Widget Minimize Button', () => {
				it('is stored in `minimizeBtn` property', () => {
					const wgt = widget({minimize: true});
					expect(wgt.minimizeBtn).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					const wgt = widget({minimize: true});
					expect(wgt.minimizeBtn.classList.contains('widget-minimize')).to.be.true;
				});
			});

			describe('Widget Close Button', () => {
				it('is stored in `closeBtn` property', () => {
					const wgt = widget({close: true});
					expect(wgt.closeBtn).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					const wgt = widget({close: true});
					expect(wgt.closeBtn.classList.contains('widget-close')).to.be.true;
				});
			});
		});

		describe.skip('Widget Body', () => {
			it('is stored in `body` property', () => {
				const wgt = widget({close: true});
				expect(wgt.body).to.be.instanceOf(HTMLElement);
			});

			it('has a classname', () => {
				const wgt = widget({body: true});
				expect(wgt.body.classList.contains('widget-body')).to.be.true;
			});
		});
	});

	describe('Options', () => {
		describe('title', () => {
			it('sets the widget title', () => {
				const wgt = widget({title: 'My Widget'});
				expect(wgt.title.innerText).to.equal('My Widget');
			});
		});

		describe('close', () => {
			it('clicking the `close` button hides the widget', () => {
				const wgt = widget({close: true}).mount();

				expect(wgt.elm.style.display).to.not.equal('none');
				wgt.closeBtn.click();
				expect(wgt.elm.style.display).to.equal('none');
			});
		});

		describe('minimize', () => {
			it('toggles the widget body visibility', () => {
				const wgt = widget({minimize: true}).mount();

				expect(wgt.elm.classList.contains('minimized')).to.be.false;
				wgt.minimizeBtn.click();
				expect(wgt.elm.classList.contains('minimized')).to.be.true;
				wgt.minimizeBtn.click();
				expect(wgt.elm.classList.contains('minimized')).to.be.false;
			});
		});
	});

	describe('Behavior', () => {
		it('toggles actions visiblity on hover', () => {
			const wgt = widget({close: true}).mount();

			// TODO: use document selector instead of wgt[elm]
			// console.log(document.getElementsByClassName('widget-action-buttons').length);

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('flex');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
		});
	});

	describe('.destroy()', () => {
		it('removes the widget element from the <body>', () => {
			const wgt = widget();

			expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('widget')).to.have.lengthOf(1);
			wgt.destroy();
			expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
		});

		it('removes hover toggle `close/header-btns` listener', () => {
			const wgt = widget({close : true}).mount();

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('flex'); // flex
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('flex'); // flex

			wgt.destroy();

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
		});

		it.skip('removes close click listener', () => {

		});

		it.skip('removes toggle minify listener', () => {

		});

		it.skip('releases all element references', () => {

		});
	});
});
