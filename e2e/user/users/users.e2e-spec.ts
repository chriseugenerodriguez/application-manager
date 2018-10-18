import { browser, element, by, protractor } from 'protractor';

// MODULES
import { Buttons } from './buttons.e2e-spec';

export class UsersPage {
	navigateTo() {
		return browser.get('/#/user/users');
	}
}

describe('Users Page', () => {
	let buttons = new Buttons;
	const page = new UsersPage;

	beforeEach(() => {

	});

	it('should be able to navigate to users page', () => {
		page.navigateTo();
	})

	describe('Add new user', () => {
		it('able to open popup', async () => {
			buttons.add.click();
			await browser.sleep(300);
			expect(element(by.css('phx-users kendo-dialog'))).toBeTruthy();
		});

		it('select a new user', async () => {
			buttons.selectuser.click();
			await browser.sleep(300);
			element(by.css('kendo-popup kendo-list ul li:first-child')).click();
			await browser.sleep(300);
			expect(element(by.css('phx-users kendo-dialog kendo-combobox input')).getAttribute('value')).toContain('Peter Kim');
		});

		it('select a role', async () => {
			buttons.selectrole.click();
			await browser.sleep(300);
			element(by.css('kendo-popup kendo-list ul li:first-child')).click();
			await browser.sleep(300);
			expect(element(by.css('phx-users kendo-dialog kendo-multiselect li.k-button span'))).toBeDefined();
		});

		it('create a new role', async () => {
			buttons.create.click();
			await browser.sleep(300);
			expect(element(by.css('phx-users .details tbody tr:nth-child(4)'))).toBeDefined();
		});
	});

	describe('Edit user', () => {
		it('change role of new user', async () => {
			element(by.css('phx-users .details tbody tr:nth-child(4) a.edit')).click();
			await browser.sleep(300);
			element(by.css('phx-app .k-multiselect-wrap .k-button span.k-icon')).click();
			buttons.selectrole.click();
			await browser.sleep(300);
			element(by.css('kendo-popup kendo-list ul li:nth-child(2)')).click();
			await browser.sleep(300);
			expect(element(by.css('phx-app .k-multiselect-wrap .k-button')).getText()).toEqual('Review Approvers');
		});

		it('save edited user', async () => {
			buttons.create.click();
			await browser.sleep(300);
			expect(element(by.css('phx-users .details tbody tr:nth-child(4)')).getText()).toContain('Review Approvers');
		});
	});
});
