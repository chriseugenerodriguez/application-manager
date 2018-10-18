import { browser, element, by } from 'protractor';

// MODULES
import { Buttons } from './applications.buttons.e2e-spec';
import { Grid } from './applications.grid.e2e-spec';

export class ApplicationsPage {
	navigateTo() {
		return browser.get('/');
	}
}

describe('Applications Grid', () => {
	let page = new ApplicationsPage;
	let buttons = new Buttons;
	let grid = new Grid;

	it('navigation to page', () => {
		page.navigateTo().then(function() {
				return browser.getTitle();
			}).then(function(title) {
				expect(title).toEqual('App Manager - Applications');
			});
	})

	describe('Buttons', () => {

		it('able to see all 4 buttons', () => {
			expect(buttons.archive.isDisplayed()).toBeTruthy();
			expect(buttons.clearfilter.isDisplayed()).toBeTruthy();
			expect(buttons.export.isDisplayed()).toBeTruthy();
			expect(buttons.newapp.isDisplayed()).toBeTruthy();
		});

		describe('New App', () => {

			it('should be able click LC link', () => {

				buttons.newapp.click().then(function(){
					expect(buttons.newapplc.isPresent()).toBe(true);
				});
			});
			it('should be able click GC link', () => {

				buttons.newapp.click().then(function(){
					expect(buttons.newappgc.isPresent()).toBe(true);
				});
			});
		});

		describe('Archive', () => {

			let text = '.app-viewer .k-grid tbody tr:first-child input';
			it('able to select an application', () => {
				element(by.css(text)).click()
				expect(element(by.css(text)).getAttribute('checked')).toBeTruthy();
			});
			it('able to archive an application', () => {
					// able to archive application
			});
		});

		describe('Export Conditions', () => {

			let text = '.app-viewer .k-grid tbody tr:first-child';
			// it('able to select an application', () => {
				// element(by.css(text)).click().then(function(this){
					// TO DO
					// ABILITY TO EXPORT
				// });
			// });
			// it('get data from selecting an application', () => {
				// element(by.buttonText('Export Conditions')).click().then(function(this){
					// TO DO
					// EXTRACT EXPORT DATA EXCEL
				// });
			// });
		});

	});

	describe('Grid', () => {
		let td = element(by.css('.k-grid tbody tr'))
		let menus = element.all(by.css('.app-viewer .k-grid thead tr th'));

		it('should fill in with data of all applications', () => {
			element(by.css('.k-grid tbody')).isDisplayed().then(function(){
				expect(element(by.css('.k-grid tbody tr:first-child')).isDisplayed()).toBe(true);
			});
		});

		it('can select an application', () => {
			buttons.clearfilter.click()
			element(by.css('.app-viewer .k-grid tbody tr:first-child td:nth-child(2) a')).click().then(function(){
				expect(browser.getCurrentUrl()).toContain('/#/form-lc/11231');
			});
			page.navigateTo();
		});

		describe('columns', () => {
			it('1st column should be App ID', () => {
				expect(menus.get(1).getText()).toBe('App ID');
			});
			it('2nd column should be Status', () => {
				expect(menus.get(2).getText()).toBe('Status');
			});
			it('3rd column should be App Description', () => {
				expect(menus.get(3).getAttribute('textContent')).toContain('App Description');
			});
			it('4th column should be Published', () => {
				expect(menus.get(4).getText()).toBe('Published');
			});
			it('5th column should be Part Desc.', () => {
				expect(menus.get(5).getText()).toBe('Part Desc.');
			});
			it('6th column should be Sample Prep', () => {
				expect(menus.get(6).getText()).toBe('Sample Prep');
			});
			it('7th column should be Created By', () => {
				expect(menus.get(7).getAttribute('textContent')).toContain('Created By');
			});
			it('8th column should be Created', () => {
				expect(menus.get(8).getAttribute('textContent')).toContain('Created');
			});
			it('9th column should be Modified', () => {
				expect(menus.get(9).getAttribute('textContent')).toContain('Modified');
			});
		});

		describe('Filter', () => {
			let items = element.all(by.css('.app-viewer .k-grid tbody tr'));

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
