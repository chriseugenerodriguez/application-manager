import { browser, element, by } from 'protractor';

// MODULES
import { Buttons } from './samplepreps.buttons.e2e-spec';

export class SamplePrepPage {
	navigateTo() {
		return browser.get('/#/sample-preps');
	}
}

describe('Sample Preps Page', () => {
	let page = new SamplePrepPage;
	let buttons = new Buttons;

	it('navigation to page', () => {
		page.navigateTo().then(function() {
				return browser.getTitle();
			}).then(function(title) {
				expect(title).toEqual('App Manager - Sample Preps');
			});
	})

	describe('Buttons', () => {
		it('able to see all 2 buttons', () => {
			expect(buttons.newapp.isDisplayed()).toBeTruthy();
			expect(buttons.clearfilter.isDisplayed()).toBeTruthy();
		});

		it('click new sp button and go to page', () => {
			buttons.newapp.click();
			expect(browser.get('/#/sample-preps/create'));
			page.navigateTo()
		})
	});

	describe('Grid', () => {
		let td = element(by.css('.k-grid tbody tr'))
		let menus = element.all(by.css('.sample-prep-viewer .k-grid thead tr th'));

			it('should fill in with data of all applications', () => {
			element(by.css('.k-grid tbody')).isDisplayed().then(function(){
				expect(element(by.css('.k-grid tbody tr:first-child')).isDisplayed()).toBe(true);
			});
		});

		describe('columns', () => {

			it('1st column should be ID', () => {
				expect(menus.get(0).getText()).toBe('ID');
			});
			it('2nd column should be Status', () => {
				expect(menus.get(1).getText()).toBe('Status');
			});
			it('3rd column should be Title', () => {
				expect(menus.get(2).getAttribute('textContent')).toContain('Title');
			});
			it('4th column should be Part #', () => {
				expect(menus.get(3).getText()).toBe('Part #');
			});
			it('5th column should be Description', () => {
				expect(menus.get(4).getText()).toBe('Description');
			});
			it('6th column should be Activated', () => {
				expect(menus.get(5).getText()).toBe('Activated');
			});
			it('8th column should be Assigned', () => {
				expect(menus.get(6).getAttribute('textContent')).toContain('Assigned');
			});
			it('9th column should be Created By', () => {
				expect(menus.get(7).getAttribute('textContent')).toContain('Created By');
			});
			it('10th column should be Modified', () => {
				expect(menus.get(8).getAttribute('textContent')).toContain('Modified');
			});
		});

		describe('Filter', () => {
			let items = element.all(by.css('.sample-prep-viewer .k-grid tbody tr'));

			it('should be able to clear filters when clicking clear filter button', () => {
				buttons.clearfilter.click().then(function(){
					items.count().then(function(count) {
						expect(count).toBe(4);
					});
				})
			});

			it('clear filter buttons disapears when nothing in input', () => {
				expect(buttons.clearfilter + '[disabled]').toBeTruthy();
			});
		});

	});
});
