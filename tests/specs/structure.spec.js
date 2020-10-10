import {createTarget, $byClassname} from '../utils';

export default () => {
	let testDOMContainer, target, wgt;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
	});

	beforeEach(() => {
		target = createTarget();
		testDOMContainer.appendChild(target);
	});

	afterEach(() => {
		wgt && wgt.elm && wgt.destroy();
		target.parentNode && target.parentNode.removeChild(target);
		target = null;
	});

	describe('Wrapper', () => {
		it('is the main element', () => {
			wgt = widget();
			expect(wgt.elm).to.be.instanceOf(HTMLElement);
			expect(wgt.elm.parentNode).to.be.null;
		});

		it('is added to the DOM', () => {
			expect($byClassname('winjet')).to.have.lengthOf(0);
			wgt = widget().mount();
			expect($byClassname('winjet')[0]).to.deep.equal(wgt.elm);
		});
	});

	describe('Header', () => {
		it('created', () => {
			wgt = widget();
			expect(wgt.header).to.be.instanceOf(HTMLElement);
			expect(wgt.header.parentNode).to.deep.equal(wgt.elm);
		});

		it('is added to the DOM', () => {
			expect($byClassname('winjet-header')).to.have.lengthOf(0);
			wgt = widget().mount();
			expect($byClassname('winjet-header')[0]).to.deep.equal(wgt.header);
		});

		describe('Title', () => {
			it('created', () => {
				wgt = widget();
				expect(wgt.title).to.be.instanceOf(HTMLElement);
				expect(wgt.title.parentNode).to.deep.equal(wgt.header);
			});

			it('is added to the DOM', () => {
				expect($byClassname('winjet-title')).to.have.lengthOf(0);
				wgt = widget().mount();
				expect($byClassname('winjet-title')[0]).to.deep.equal(wgt.title);
			});
		});

		describe('Action Buttons', () => {
			it('created', () => {
				wgt = widget();
				expect(wgt.actions).to.be.instanceOf(HTMLElement);
				expect(wgt.actions.parentNode).to.deep.equal(wgt.header);
			});

			it('is added to the DOM', () => {
				expect($byClassname('winjet-action-buttons')).to.have.lengthOf(0);
				wgt = widget().mount();
				expect($byClassname('winjet-action-buttons')[0]).to.deep.equal(wgt.actions);
			});

			it('has buttons', () => {
				wgt = widget();
				expect(wgt.actions.children).to.not.have.lengthOf(0);
				expect(wgt.actions.getElementsByClassName('winjet-button')).to.not.have.lengthOf(0);
			});

			describe('Close Button', () => {
				it('created', () => {
					wgt = widget();
					expect(wgt.closeBtn).to.be.instanceOf(HTMLElement);
					expect(wgt.closeBtn.parentNode).to.deep.equal(wgt.actions);
					expect(wgt.closeBtn.classList.contains('winjet-button')).to.be.true;
				});

				it('is added to the DOM', () => {
					expect($byClassname('winjet-close')).to.have.lengthOf(0);
					wgt = widget().mount();
					expect($byClassname('winjet-close-button')[0]).to.deep.equal(wgt.closeBtn);
				});
			});

			describe('Minimize Button', () => {
				it('created', () => {
					wgt = widget();
					expect(wgt.minimizeBtn).to.be.instanceOf(HTMLElement);
					expect(wgt.minimizeBtn.parentNode).to.deep.equal(wgt.actions);
					expect(wgt.minimizeBtn.classList.contains('winjet-button')).to.be.true;
				});

				it('is added to the DOM', () => {
					expect($byClassname('winjet-minimize')).to.have.lengthOf(0);
					wgt = widget().mount();
					expect($byClassname('winjet-minimize-button')[0]).to.deep.equal(wgt.minimizeBtn);
				});
			});

			describe('Maximize Button', () => {
				it('created', () => {
					wgt = widget();
					expect(wgt.maximizeBtn).to.be.instanceOf(HTMLElement);
					expect(wgt.maximizeBtn.parentNode).to.deep.equal(wgt.actions);
					expect(wgt.maximizeBtn.classList.contains('winjet-button')).to.be.true;
				});

				it('is added to the DOM', () => {
					expect($byClassname('winjet-maximize-button')).to.have.lengthOf(0);
					wgt = widget().mount();
					expect($byClassname('winjet-maximize-button')[0]).to.deep.equal(wgt.maximizeBtn);
				});
			});
		});
	});

	describe('Body Container', () => {
		it('created', () => {
			wgt = widget();
			expect(wgt.bodyContainer).to.be.instanceOf(HTMLElement);
			expect(wgt.bodyContainer.parentNode).to.deep.equal(wgt.elm);
		});

		it('is added to the DOM', () => {
			expect($byClassname('winjet-body-container')).to.have.lengthOf(0);
			wgt = widget().mount();
			expect($byClassname('winjet-body-container')[0]).to.deep.equal(wgt.bodyContainer);
		});

		it('is empty by default', () => {
			wgt = widget();
			expect(wgt.bodyContainer.children).to.have.lengthOf(0);
			expect(wgt.body).to.be.null;
		});

		it('holds the custom body element', () => {
			wgt = widget(target);
			expect(wgt.bodyContainer.children).to.have.lengthOf(1);
			expect(wgt.bodyContainer.children[0]).to.deep.equal(target);
		});

		describe('Custom Body', () => {
			it('created', () => {
				wgt = widget(target);
				expect(wgt.body).to.deep.equal(target);
				expect(target.parentNode).to.deep.equal(wgt.bodyContainer);
			});

			it('is added to the DOM', () => {
				expect($byClassname('winjet-body')).to.have.lengthOf(0);
				wgt = widget(target).mount();
				expect($byClassname('winjet-body')[0]).to.deep.equal(wgt.body);
			});
		});
	});
};
