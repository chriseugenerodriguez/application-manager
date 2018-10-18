import { browser, by, element, protractor } from 'protractor';

// MODULES
import { Form } from './create.form.e2e-spec';
import { async } from '@angular/core/testing';

export class CreateSamplePrepPage {
	navigateTo() {
		return browser.get('/#/sample-preps/create');
	}
}

describe('Sample Prep |', () => {
	let page = new CreateSamplePrepPage;
	let form = new Form;

	it('should be able to navigate to create sample preps page', () => {
		page.navigateTo().then(function() {
			return browser.getTitle();
		}).then(function(title) {
			expect(title).toEqual('App Manager - Create Sample Prep');
		});
	})

	describe('Form -', () => {

		it('input Title', () => {
				element(by.css('.content header input')).sendKeys('asdasd');
		});

		it('textarea Pre-Treatment Notes', () => {
				element(by.css('textarea[formcontrolname="PreTreatmentNotes"]')).sendKeys('asdasd1');
		});

		it('textarea Pre-Treatment Notes', () => {
				element(by.css('textarea[formcontrolname="SamplePrepNotes"]')).sendKeys('asdasd2');
		});

		it('input Sample Prep. Technique', async () => {
				element(by.css('kendo-combobox[formcontrolname="SamplePrepTechnique"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="SamplePrepTechnique"] input')).getAttribute('value')).toContain('Two');
		});

		it('select Competitor Column', async () => {
				element(by.css('kendo-combobox[formcontrolname="PHECompetitorKey"] input')).sendKeys('Competitor Column');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="PHECompetitorKey"] input')).getAttribute('value')).toContain('Competitor Column');
		});

		it('input Commercial Description', () => {
			element(by.css('input[formcontrolname="CommercialDescription"]')).sendKeys('comm desc 1 - 2');
		});

		it('select PHE', async () => {
					element(by.css('kendo-combobox[formcontrolname="PHECompetitorKey"] input')).clear();
					element(by.css('kendo-combobox[formcontrolname="PHECompetitorKey"] input')).sendKeys('PHE');
					await browser.sleep(300);
					browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
					browser.actions().sendKeys(protractor.Key.ENTER).perform();
					await browser.sleep(300);
					expect(element(by.css('kendo-combobox[formcontrolname="PHECompetitorKey"] input')).getAttribute('value')).toContain('PHE');
		})

		it('select Part Number', async () => {
				element(by.css('kendo-combobox[formcontrolname="PHEPartNumberKey"] input')).sendKeys('123ABC123');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="PHEPartNumberKey"] input')).getAttribute('value')).toContain('123ABC123');
		});

		it('input Description 1', () => {
				expect(element(by.css('input[formcontrolname="Description1"]')).getAttribute('value')).toContain('desc 1 - 2');
		});

		it('input Description 2', () => {
				expect(element(by.css('input[formcontrolname="Description2"]')).getAttribute('value')).toContain('desc 2 - 2');
		});

		it('select Mfg Code', () => {
			expect(element(by.css('input[formcontrolname="MfgCode"]')).getAttribute('value')).toContain('1');
		});

		it('select Brand Code', () => {
				expect(element(by.css('input[formcontrolname="BrandCode"]')).getAttribute('value')).toContain('2');
		});

		it('select Format Type', () => {
				expect(element(by.css('input[formcontrolname="FormatType"]')).getAttribute('value')).toContain('format type');
		});

		it('select Format Volume', () => {
				expect(element(by.css('input[formcontrolname="FormatVolume"]')).getAttribute('value')).toContain('format volume');
		});

		it('select Volume Unit', () => {
				expect(element(by.css('input[formcontrolname="VolumeUnit"]')).getAttribute('value')).toContain('volume unit');
		});

		it('select Format Mass', () => {
				expect(element(by.css('input[formcontrolname="FormatMass"]')).getAttribute('value')).toContain('format mass');
		});

		it('select Mass Unit', () => {
				expect(element(by.css('input[formcontrolname="MassUnit"]')).getAttribute('value')).toContain('format unit');
		});

		it('select Sorbent Lot', () => {
				element(by.css('input[formcontrolname="SorbentLot"]')).sendKeys('asdasd1');
		});

		it('select Production Lot', () => {
				element(by.css('input[formcontrolname="ProductionLot"]')).sendKeys('asdasd1');
		});

		it('input Collection Plate', () => {
				element(by.css('input[formcontrolname="CollectionPlate"]')).sendKeys('asdasd3');
		});

		it('input Sealing Mat', () => {
				element(by.css('input[formcontrolname="SealingMat"]')).sendKeys('asdasd3');
		});

		it('able to add new steps', async () => {
			for (let i = 1; i < 5; i++) {

				if ( i > 1 && i < 5 ) {
					element(by.css('.create-sample-prep .btn-full')).click();
				}

				element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="Details"]')).sendKeys('detail' + i);
				element(by.css('.table tr:nth-child(' + i + ') kendo-combobox[formcontrolname="TypeKey"] input')).sendKeys('Condition');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);

				expect(element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="Details"]')).getAttribute('value')).toContain('detail' + i);
				expect(element(by.css('.table tr:nth-child(' + i + ')  kendo-combobox[formcontrolname="TypeKey"] input')).getAttribute('value')).toContain('Condition');

			}
		});

			// it('able to clone form', () => {
			// 	// TO DO
			// 	// able to clone form
			// });

			it('able to submit form', async () => {
				element(by.css('.save-submit button')).click();
				await browser.sleep(300);
				expect(by.css('.create-sample-prep .view')).toBeDefined();
			});
	});

	describe('Sidebar', () => {
		it('See Analyst', () => {
			expect(element(by.css('aside section.analyst label')).getText()).toContain('Analyst');
		});
		it('There be a created date set', () => {
			expect(element(by.css('aside section.created label')).getText()).toContain('Created');
		});
		it('There be a modified date set', () => {
			expect(element(by.css('aside section.modified label')).getText()).toContain('Modified');
		});
	});

	// describe('Associated Apps', () => {
	// 	let apps = element(by.css('phx-sample-pre-create .existing-sample-preps .view'));
	// 	it('show applications', () => {
	// 		apps.click()
	// 		element(by.css('phx-sample-pre-create .existing-sample-preps .k-grid tbody')).isDisplayed().then(function(){
	// 			expect(element(by.css('phx-sample-pre-create .existing-sample-preps .k-grid tbody tr:first-child')).isDisplayed()).toBe(true);
	// 		});
	// 	});

	// 	it('able to filter', async () => {
	// 		await browser.sleep(300);
	// 		element(by.css('phx-sample-pre-create .existing-sample-preps tr th:first-child input')).sendKeys('122');
	// 		await browser.sleep(300);
	// 		expect(element(by.className('k-grid-norecords'))).toBeDefined();
	// 	});
	// })

});
