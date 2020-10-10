import argsSpec from './arguments.spec';
import structureSpec from './structure.spec';
import actionsSpec from './actions.spec';
import optionsSpec from './options.spec';
import apiSpec from './api.spec';

describe('widget', () => {
	let testDOMContainer;

	before(() => {
		testDOMContainer = document.createElement('div');
		testDOMContainer.id = 'test-dom-container';
		testDOMContainer.style.height = '400px';
		testDOMContainer.style.width = '1000';
		testDOMContainer.style.padding = '75px';
		document.body.appendChild(testDOMContainer);
	});

	after(() => {
		testDOMContainer.parentNode.removeChild(testDOMContainer);
		testDOMContainer = null;
	});

	it('is a function', () => expect(widget).to.be.a('function'));

	it('returns a Widget instance', () => {
		const wgt = widget();
		const ctor = Object.getPrototypeOf(wgt).constructor;

		expect(ctor.name).to.equal('Widget');
	});

	describe('Arguments', argsSpec);
	describe('Widget Element Structure', structureSpec);
	describe('Actions', actionsSpec);
	describe('Options', optionsSpec);
	describe('API Methods', apiSpec);
});
