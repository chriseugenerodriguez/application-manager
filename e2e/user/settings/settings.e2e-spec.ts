import { browser, element, by, protractor } from 'protractor';

// MODULES
import { Buttons } from './buttons.settings.e2e-spec';

export class SettingsPage {
	navigateTo() {
		return browser.get('/#/user/settings');
	}
}

describe('Settings Page', () => {
	const page = new SettingsPage;
	let buttons = new Buttons;

	it('should be able to navigate to settings page', () => {
		page.navigateTo();
	})

	describe('Settings', () => {

		it('Able to change status', async () => {
			buttons.status.click();
			await browser.sleep(300);
			element(by.css('kendo-popup kendo-list ul li:nth-child(2)')).click();
			await browser.sleep(300);
			expect(element(by.css('.setting-user .setting .status kendo-dropdownlist .k-input')).getText()).toContain('Analyst Review');
		});

		it('Able to change technology', async () => {
			buttons.technology.click();
			await browser.sleep(300);
			element(by.css('kendo-popup kendo-list ul li:nth-child(2)')).click();
			await browser.sleep(300);
			expect(element(by.css('.setting-user .setting .technology kendo-dropdownlist .k-input')).getText()).toContain('Facebook');
		});

		it('Able to change assigned-to', async () => {
			buttons.assigned.click();
			await browser.sleep(300);
			element(by.css('kendo-popup kendo-list ul li:nth-child(2)')).click();
			await browser.sleep(300);
			expect(element(by.css('.setting-user .setting .assigned-to kendo-dropdownlist .k-input')).getText()).toContain('Chris Rodriquez');
		});
	});
});
