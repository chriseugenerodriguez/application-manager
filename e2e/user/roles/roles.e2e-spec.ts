import { browser, element, by, protractor } from 'protractor';

// MODULES
import { Buttons } from './buttons.roles.e2e-spec';
import { Roles } from './role.roles.e2e-spec';

export class RolesPage {
	navigateTo() {
		return browser.get('/#/user/roles');
	}
}

describe('Roles Page', () => {
	const page = new RolesPage;
	let buttons = new Buttons;
	let roles = new Roles;

	it('should be able to navigate to roles page', () => {
		page.navigateTo();
	})

	describe('All Roles', () => {
		it('Able to click add role', () => {
			buttons.add.click().then(function(){
				expect(element(by.css('.k-dialog-wrapper')).isDisplayed()).toBeTruthy();
			})
		});

		describe('New Role', () => {
			it('Create Role Name', () => {
					let input = element(by.css('.k-dialog-wrapper header input'));
					let text = 'test app';
					input.sendKeys(text);
					expect(input.getAttribute('value')).toEqual(text);
			});

			it('Able to click read / write for all sections', () => {
					roles.overviewRead.click().then(function(){
						expect(roles.overviewRead.getAttribute('class')).toContain('k-switch-on');
					});
					roles.columnDetailsWrite.click().then(function(){
						expect(roles.columnDetailsWrite.getAttribute('class')).toContain('k-switch-on');
					});
					roles.instrumentationConditionsRead.click().then(function(){
						expect(roles.instrumentationConditionsRead.getAttribute('class')).toContain('k-switch-on');
					});
					roles.analyteDetailsRead.click().then(function(){
						expect(roles.analyteDetailsRead.getAttribute('class')).toContain('k-switch-on');
					});
					roles.samplePrepWrite.click().then(function(){
						expect(roles.samplePrepWrite.getAttribute('class')).toContain('k-switch-on');
					});
					roles.chromatogramsWrite.click().then(function(){
						expect(roles.chromatogramsWrite.getAttribute('class')).toContain('k-switch-on');
					});
					roles.documentsRelatedTermsRead.click().then(function(){
						expect(roles.documentsRelatedTermsRead.getAttribute('class')).toContain('k-switch-on');
					});
					roles.codingrelatedtermsRead.click().then(function(){
						expect(roles.codingrelatedtermsRead.getAttribute('class')).toContain('k-switch-on');
					});
			});

			it('Able to click publish', () => {
					roles.publish.click().then(function(){
						expect(roles.publish.isSelected()).toBeTruthy();
					});
			});

			it('Able to select a person', async () => {
					roles.assignto.click();
					await browser.sleep(300);
					element(by.css('kendo-popup kendo-list ul li:first-child')).click();
					await browser.sleep(300);
					expect(element(by.css('.k-dialog-wrapper kendo-combobox input')).getAttribute('value')).toContain('Patton Ng');
			});

			it('Able to save role', async () => {
				buttons.save.click();
				await browser.sleep(300);
				let s = element.all(by.css('phx-roles .details tbody tr'));
				s.then(function(items){
					expect(items[6].getText()).toContain('test app');
				})

			});
		});

		it('Able to edit the created role', () => {
			element(by.css('phx-roles .details tbody tr:last-child a.edit')).click();
			expect(element(by.css('.k-dialog-wrapper header input')).getAttribute('value')).toBe('test app');
		});

		it('Able to change a field and click save', async () => {
			element(by.css('.k-dialog-wrapper header input')).sendKeys('test change');
			expect(element(by.css('.k-dialog-wrapper header input')).getAttribute('value')).toEqual('test apptest change');

			buttons.save.click();
			await browser.sleep(300);
			let s = element.all(by.css('phx-roles .details tbody tr'));
			s.then(function(items){
				expect(items[6].getText()).toContain('test apptest change');
			})
		});


		it('Delete the newly created role', async () => {
			element(by.css('phx-roles .details tbody tr:last-child a.delete')).click();
			element(by.css('.k-dialog-buttongroup .k-button.k-primary')).click();
			await browser.sleep(300);
			let s = element.all(by.css('phx-roles .details tbody tr'));
			s.then(function(items){
				expect(items[6]).toBeUndefined();
			});
		});
	});
});
