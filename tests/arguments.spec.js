import {TITLE} from './utils';

export default () => {
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

	describe('()', () => {
		it('creates a widget', () => {
			wgt = widget();
			expect(wgt.elm.classList.contains('winjet')).to.be.true;
		});

		it('has no title', () => {
			wgt = widget();
			expect(wgt.title.innerHTML).to.equal('');
		});

		it('has no body', () => {
			wgt = widget();
			expect(wgt.bodyContainer.children).to.have.lengthOf(0);
			expect(wgt.body).to.be.null;
		});
	});

	describe('(title)', () => {
		it('sets the widget title text', () => {
			wgt = widget(TITLE);
			expect(wgt.title.innerHTML).to.equal(TITLE);
		});

		it('has no body', () => {
			wgt = widget(TITLE);
			expect(wgt.bodyContainer.children).to.have.lengthOf(0);
			expect(wgt.body).to.be.null;
		});
	});

	describe('(body)', () => {
		it('sets the widget body', () => {
			wgt = widget(target);
			expect(wgt.body.innerHTML).to.include('AAA');
			expect(wgt.body.innerHTML).to.include('BBB');
			expect(wgt.body.innerHTML).to.include('CCC');
		});

		it('has no title', () => {
			wgt = widget(target);
			expect(wgt.title.innerHTML).to.equal('');
		});
	});

	describe('(title, body)', () => {
		it('sets the widget title text', () => {
			wgt = widget(TITLE, target);
			expect(wgt.title.innerHTML).to.equal(TITLE);
		});

		it('sets the widget body', () => {
			wgt = widget(TITLE, target);
			expect(wgt.body.innerHTML).to.include('AAA');
			expect(wgt.body.innerHTML).to.include('BBB');
			expect(wgt.body.innerHTML).to.include('CCC');
		});
	});


	describe('(header, body)', () => {
		it('sets the widget header', () => {
			wgt = widget(header, target);
			expect(header.innerHTML).to.contain('Custom Header');
		});

		it('sets a classname on the header', () => {
			wgt = widget(header, target);
			expect(header.classList.contains('winjet-header')).to.be.true;
		});

		it('has no title', () => {
			wgt = widget(header, target);
			expect(wgt.title).to.be.null;
		});

		it('has no actions', () => {
			wgt = widget(header, target);
			expect(wgt.title).to.be.null;
		});
	});

	describe('(options)', () => {
		it('sets an `id` attribute on the widget element', () => {
			wgt = widget({id: 'the-widget'});
			expect(wgt.elm.id).to.equal('the-widget');
		});

		it('has no title', () => {
			wgt = widget({id: 'the-widget'});
			expect(wgt.title.innerHTML).to.equal('');
		});

		it('has no body', () => {
			wgt = widget({id: 'the-widget'});
			expect(wgt.bodyContainer.children).to.have.lengthOf(0);
			expect(wgt.body).to.be.null;
		});
	});

	describe('(title, options)', () => {
		it('sets the widget title text', () => {
			wgt = widget(TITLE, {id: 'the-widget'});
			expect(wgt.title.innerHTML).to.equal(TITLE);
		});

		it('sets an `id` attribute on the widget element', () => {
			wgt = widget(TITLE, {id: 'the-widget'});
			expect(wgt.elm.id).to.equal('the-widget');
		});

		it('has no body', () => {
			wgt = widget(TITLE, {id: 'the-widget'});
			expect(wgt.bodyContainer.children).to.have.lengthOf(0);
			expect(wgt.body).to.be.null;
		});
	});

	describe('(body, options)', () => {
		it('sets the widget body', () => {
			wgt = widget(target, {id: 'the-widget'});
			expect(wgt.body.innerHTML).to.include('AAA');
			expect(wgt.body.innerHTML).to.include('BBB');
			expect(wgt.body.innerHTML).to.include('CCC');
		});

		it('sets an `id` attribute on the widget element', () => {
			wgt = widget(target, {id: 'the-widget'});
			expect(wgt.elm.id).to.equal('the-widget');
		});

		it('has no title', () => {
			wgt = widget(target, {id: 'the-widget'});
			expect(wgt.title.innerHTML).to.equal('');
		});
	});

	describe('(title, body, options)', () => {
		it('sets the widget title text', () => {
			wgt = widget(TITLE, target, {id: 'the-widget'});
			expect(wgt.title.innerHTML).to.equal(TITLE);
		});

		it('sets the widget body', () => {
			wgt = widget(TITLE, target, {id: 'the-widget'});
			expect(wgt.body.innerHTML).to.include('AAA');
			expect(wgt.body.innerHTML).to.include('BBB');
			expect(wgt.body.innerHTML).to.include('CCC');
		});

		it('sets an `id` attribute on the widget element', () => {
			wgt = widget(TITLE, target, {id: 'the-widget'});
			expect(wgt.elm.id).to.equal('the-widget');
		});
	});

	describe('(header, body, options)', () => {
		it('sets the widget header', () => {
			wgt = widget(header, target);
			expect(header.innerHTML).to.contain('Custom Header');
		});

		it('sets the widget body', () => {
			wgt = widget(header, target, {id: 'the-widget'});
			expect(wgt.body.innerHTML).to.include('AAA');
			expect(wgt.body.innerHTML).to.include('BBB');
			expect(wgt.body.innerHTML).to.include('CCC');
		});

		it('sets an `id` attribute on the widget element', () => {
			wgt = widget(TITLE, target, {id: 'the-widget'});
			expect(wgt.elm.id).to.equal('the-widget');
		});
	});
};
