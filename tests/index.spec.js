import argsSpec from './arguments.spec';
import structureSpec from './structure.spec';
import actionsSpec from './actions.spec';
import optionsSpec from './options.spec';
import apiSpec from './api.spec';

describe('widget', () => {
	let testDOMContainer, container, target, header, headerSpan, wgt;

	before(() => {
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

		header = document.createElement('div');
		headerSpan = document.createElement('span');
		header.id = 'custom-header';
		headerSpan.id = 'header-span';
		headerSpan.innerHTML = 'Custom Header';
		header.appendChild(headerSpan);

		target = document.createElement('div');
		target.id = 'target';
		target.innerHTML = `
			<ul>
				<li>AAA</li>
				<li>BBB</li>
				<li>CCC</li>
			</ul>
		`;

		container.appendChild(target);
		testDOMContainer.appendChild(container);

		Array.from(document.getElementsByClassName('winjet')).forEach((wgt) => {
			wgt.parentNode.removeChild(wgt);
		});
	});

	afterEach(() => {
		target.innerHTML = '';
		target.parentNode && target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;

		header = null;
		headerSpan = null;

		if (wgt && wgt.elm) {
			wgt.destroy();
		}
	});

	after(() => {
		testDOMContainer = null;
	});

	it('is a function', () => expect(widget).to.be.a('function'));

	it('returns a Widget instance', () => {
		wgt = widget();
		const ctor = Object.getPrototypeOf(wgt).constructor;
		expect(ctor.name).to.equal('Widget');
	});

	describe('Arguments', argsSpec);
	describe('Widget Element Structure', structureSpec);
	describe('Actions', actionsSpec);
	describe('Options', optionsSpec);
	describe('API Methods', apiSpec);
});
