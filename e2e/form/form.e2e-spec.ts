import { browser, by, element, protractor } from 'protractor';

// MODULES
import { Form } from './form.form.e2e-spec';
import { Sidebar } from './form.sidebar.e2e-spec';
import { Status } from './form.status.e2e-spec';

export class ApplicationsPage {
	formlc() {
		return browser.get('#/form-lc');
	}
	formgc() {
		return browser.get('#/form-gc');
	}
	sampleprep() {
		return element(by.css('.sample-preperation-methodology button'));
	}
}

describe('Applications', () => {
	let page = new ApplicationsPage;
	let form = new Form;
	let sidebar = new Sidebar;
	let status = new Status;
	let title = element(by.css('.content h1'));

	it('navigate to form lc page', () => {
		page.formlc().then(function(){
			expect(title.getText()).toBe('LC Application Form');
		});
	});

	it('nagivate to form gc page', () => {
		page.formgc().then(function(){
			expect(title.getText()).toBe('GC Application Form');
		});
	});

	describe('Form |', () => {
		let unhighlighted = element.all(by.css('phx-app phx-form .content .application-details [ng-reflect-is-disabled="true"] .panel .panel-open'));
		let titles = element.all(by.css('.panel-default > .panel-heading .panel-title .accordion-toggle div'));

		it('should only see 5 accordions highlighted', () => {
			expect(titles.get(0).getText()).toBe('Overview');
			expect(titles.get(1).getText()).toBe('Column Details');
			expect(titles.get(2).getText()).toBe('Instrumentation and Conditions');
			expect(titles.get(3).getText()).toBe('Analyte Details');
			expect(titles.get(4).getText()).toBe('Sample Prep Method');
		});

		it('unable to click and open unhighlighted accordion components', () => {
			unhighlighted.each(function (item) {
				expect(item.length).toBe(0);
			});
		});

		it('input Title', () => {
			element(by.css('.content header input')).sendKeys('asdasd');
			expect(element(by.css('.content header input')).getAttribute('value')).toContain('asdasd');
		});

		describe('Overview Accordion -', () => {

			it('input application reason', () => {
				element(by.css('textarea[formcontrolname="ApplicationReason"]')).sendKeys('asdasd2');
			});

			it('input customer third party details', () => {
				element(by.css(' textarea[formcontrolname="CustomerThirdPartyDetails"]')).sendKeys('asdasd2');
			});

			it('combobox separation mode', async () => {
				element(by.css('kendo-combobox[formcontrolname="SeparationMode"] input')).sendKeys('One');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="SeparationMode"] input')).getAttribute('value')).toContain('One');
			});

			it('able to submit form', () => {
				element(by.css('.overview .btn-primary')).click();
				expect(element(by.css('.overview a.edit'))).toBeDefined();
			});

			it('can click edit and show fields to redit existing data', () => {
				element(by.css('.overview a.edit')).click().then(function(){
					element(by.css('textarea[formcontrolname="ApplicationReason"]')).sendKeys('1');
					expect(element(by.css('textarea[formcontrolname="ApplicationReason"]')).getAttribute('value')).toBe('asdasd21');
				});
			});

		});
		describe('Column Details Accordion -', () => {

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

			it('select MfgCode', async () => {
				element(by.css('kendo-combobox[formcontrolname="mfgCodeKey"] input')).sendKeys('Helium');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="mfgCodeKey"] input')).getAttribute('value')).toContain('Helium');
			});

			it('select Brand Code', async () => {
				element(by.css('kendo-combobox[formcontrolname="brandCodeKey"] input')).sendKeys('Helium');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="brandCodeKey"] input')).getAttribute('value')).toContain('Helium');
			});

			it('input Length', () => {
				element(by.css('input[formcontrolname="Length"]')).sendKeys('12');
				expect(element(by.css('input[formcontrolname="Length"]')).getAttribute('value')).toContain('12')
			});

			it('input Internal Diameter', () => {
				element(by.css('input[formcontrolname="InternalDiameter"]')).sendKeys('23');
				expect(element(by.css('input[formcontrolname="InternalDiameter"]')).getAttribute('value')).toContain('23')
			});

			it('input Film Thickness', () => {
				element(by.css('input[formcontrolname="FilmThickness"]')).sendKeys('14');
				expect(element(by.css('input[formcontrolname="FilmThickness"]')).getAttribute('value')).toContain('14')
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

			it('input MfgCode', () => {
				expect(element(by.css('input[formcontrolname="MfgCode"]')).getAttribute('value')).toContain('Helium');
			});

			it('input Brand Code', () => {
				expect(element(by.css('input[formcontrolname="BrandCode"]')).getAttribute('value')).toContain('Nitrogen');
			});

			it('input Length', () => {
				expect(element(by.css('input[formcontrolname="Length"]')).getAttribute('value')).toContain('14')
			});

			it('input Internal Diameter', () => {
				expect(element(by.css('input[formcontrolname="InternalDiameter"]')).getAttribute('value')).toContain('4613')
			});

			it('input Film Thickness', () => {
				expect(element(by.css('input[formcontrolname="FilmThickness"]')).getAttribute('value')).toContain('12')
			});

			it('input Serial Number', () => {
				element(by.css('input[formcontrolname="SerialNumber"]')).sendKeys('12');
				expect(element(by.css('input[formcontrolname="SerialNumber"]')).getAttribute('value')).toContain('12')
			});

			it('input Batch Number', () => {
				element(by.css('input[formcontrolname="BatchNumber"]')).sendKeys('23');
				expect(element(by.css('input[formcontrolname="BatchNumber"]')).getAttribute('value')).toContain('23')
			});

			it('input Column Efficiency', () => {
				element(by.css('input[formcontrolname="ColumnEfficiency"]')).sendKeys('14');
				expect(element(by.css('input[formcontrolname="ColumnEfficiency"]')).getAttribute('value')).toContain('14')
			});

			it('combobox inlet base seal', async () => {
				element(by.css('kendo-combobox[formcontrolname="InletBaseSeal"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="InletBaseSeal"] input')).getAttribute('value')).toContain('Two');
			});

			it('combobox inlet liner', async () => {
				element(by.css('kendo-combobox[formcontrolname="InletLiner"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="InletLiner"] input')).getAttribute('value')).toContain('Two');
			});

			it('combobox guard column', async () => {
				element(by.css('kendo-combobox[formcontrolname="GuardColumn"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="GuardColumn"] input')).getAttribute('value')).toContain('Two');
			});

			it('combobox syringe filter', async () => {
				element(by.css('kendo-combobox[formcontrolname="SyringeFilter"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="SyringeFilter"] input')).getAttribute('value')).toContain('Two');
			});

			it('able to submit form', () => {
				element(by.css('.column-details .btn-primary[value="Submit"]')).click();
				expect(element(by.css('.column-details a.edit'))).toBeDefined();
			});

			it('can click edit and show fields to redit existing data', () => {
				element(by.css('.column-details a.edit')).click().then(function(){
					element(by.css('input[formcontrolname="ColumnEfficiency"]')).sendKeys('1');
					expect(element(by.css('input[formcontrolname="ColumnEfficiency"]')).getAttribute('value')).toBe('141');
				});
			});

		});

		describe('Instrumentation and Conditions Accordion -', () => {

			it('input inj. volume', () => {
				element(by.css('input[formcontrolname="InjVolume"]')).sendKeys('asdasd2');
			});

			it('combobox inj. unit', async () => {
				element(by.css('kendo-combobox[formcontrolname="InjUnit"] input')).sendKeys('1');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="InjUnit"] input')).getAttribute('value')).toContain('1');
			});

			it('input injector temp', () => {
				element(by.css('input[formcontrolname="InjectorTemp"]')).sendKeys('asdasd2');
			});

			it('input column temp', () => {
				element(by.css('input[formcontrolname="ColumnTemp"]')).sendKeys('asdasd2');
			});

			it('input detector temp', () => {
				element(by.css('input[formcontrolname="DetectorTemp"]')).sendKeys('asdasd2');
			});

			it('combobox gc system', async () => {
				element(by.css('kendo-combobox[formcontrolname="GCSystem"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="GCSystem"] input')).getAttribute('value')).toContain('Two');
			});

			it('combobox detector type', async () => {
				element(by.css('kendo-combobox[formcontrolname="DetectorType"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="DetectorType"] input')).getAttribute('value')).toContain('Two');
			});

			it('combobox detector instrumentation', async () => {
				element(by.css('kendo-combobox[formcontrolname="DetectorInstrumentation"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="DetectorInstrumentation"] input')).getAttribute('value')).toContain('Two');
			});

			it('input detector detail 1', () => {
				element(by.css('input[formcontrolname="DetectorDetail1"]')).sendKeys('asdasd2');
			});

			it('combobox unit 1', async () => {
				element(by.css('kendo-combobox[formcontrolname="Unit1"] input')).sendKeys('D (degree AU)');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="Unit1"] input')).getAttribute('value')).toContain('D (degree AU)');
			});

			it('input detector detail 2', () => {
				element(by.css('input[formcontrolname="DetectorDetail2"]')).sendKeys('asdasd2');
			});

			it('combobox unit 2', async () => {
				element(by.css('kendo-combobox[formcontrolname="Unit2"] input')).sendKeys('D (degree AU)');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="Unit2"] input')).getAttribute('value')).toContain('D (degree AU)');
			});

			it('combobox flow rate', async () => {
				element(by.css('kendo-combobox[formcontrolname="FlowRateUnit"] input')).sendKeys('µL/min');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="FlowRateUnit"] input')).getAttribute('value')).toContain('µL/min');
			});

			it('combobox flow rate technique', async () => {
				element(by.css('kendo-combobox[formcontrolname="FlowRateTechnique"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="FlowRateTechnique"] input')).getAttribute('value')).toContain('Two');
			});

			it('combobox injection mode', async () => {
				element(by.css('kendo-combobox[formcontrolname="InjectionMode"] input')).sendKeys('Split');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="InjectionMode"] input')).getAttribute('value')).toContain('Split');
			});

			it('combobox carrier gas', async () => {
				element(by.css('kendo-combobox[formcontrolname="CarrierGas"] input')).sendKeys('Helium');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="CarrierGas"] input')).getAttribute('value')).toContain('Helium');
			});

			it('input split ratio', () => {
				element(by.css('input[formcontrolname="SplitRatio"]')).sendKeys('asdasd2');
			});

			it('input splitless hold time', () => {
				element(by.css('input[formcontrolname="SplitlessHoldTime"]')).sendKeys('asdasd2');
			});

			it('able to add new steps', () => {
				for (let i = 1; i < 5; i++) {

					if ( i > 1 && i < 5 ) {
						element(by.css('.instrumentation-conditions button[kendobutton]')).click();
					}

					element(by.css('.table tr:nth-child(' + i + ') kendo-combobox[formcontrolname="FlowType"] input')).sendKeys('1');
					element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempC"]')).sendKeys('detail' + i);

					element(by.css('.table tr:nth-child(' + i + ') kendo-maskedtextbox[formcontrolname="FlowTime"] input')).click();
					browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
					browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
					browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
					browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
					browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
					element(by.css('.table tr:nth-child(' + i + ') kendo-maskedtextbox[formcontrolname="FlowTime"] input')).sendKeys('111' + i);


					element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempStart"]')).sendKeys('detail' + i);
					element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempEnd"]')).sendKeys('detail' + i);
					element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempRate"]')).sendKeys('detail' + i);

					expect(element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempC"]')).getAttribute('value')).toContain('detail' + i);
					expect(element(by.css('.table tr:nth-child(' + i + ') kendo-maskedtextbox[formcontrolname="FlowTime"] input')).getAttribute('value')).toContain('11:1' + i);
					expect(element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempStart"]')).getAttribute('value')).toContain('detail' + i);
					expect(element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempEnd"]')).getAttribute('value')).toContain('detail' + i);
					expect(element(by.css('.table tr:nth-child(' + i + ') input[formcontrolname="TempRate"]')).getAttribute('value')).toContain('detail' + i);
					expect(element(by.css('.table tr:nth-child(' + i + ')  kendo-combobox[formcontrolname="FlowType"] input')).getAttribute('value')).toContain('1');
				}
			});

			it('able to submit form', () => {
				element(by.css('.instrumentation-conditions .btn-primary')).click();
				expect(element(by.css('.instrumentation-conditions a.edit'))).toBeDefined();
			});

			it('can click edit and show fields to redit existing data', () => {
				element(by.css('.instrumentation-conditions a.edit')).click().then(function(){
					element(by.css('input[formcontrolname="InjVolume"]')).sendKeys('1');
					expect(element(by.css('input[formcontrolname="InjVolume"]')).getAttribute('value')).toBe('asdasd21');
				});
			});

		});

		describe('Analyte Details Accordion - ', () => {

			it('textarea Matrix Notes', () => {
				element(by.css('textarea[formcontrolname="MatrixNotes"]')).sendKeys('asdasdad');
				expect(element(by.css('textarea[formcontrolname="MatrixNotes"]')).getAttribute('value')).toContain('asdasdad')
			});

			it('textarea Analyte Diluent Notes', () => {
				element(by.css('textarea[formcontrolname="AnalyteDiluentNotes"]')).sendKeys('asdasdad');
				expect(element(by.css('textarea[formcontrolname="AnalyteDiluentNotes"]')).getAttribute('value')).toContain('asdasdad')
			});

			it('combobox Matrix', async () => {
				element(by.css('kendo-combobox[formcontrolname="Matrix"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="Matrix"] input')).getAttribute('value')).toContain('Two');
			});

			it('combobox Sample Preperation', async () => {
				element(by.css('kendo-combobox[formcontrolname="SamplePreparation"] input')).sendKeys('Two');
				await browser.sleep(300);
				browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
				browser.actions().sendKeys(protractor.Key.ENTER).perform();
				await browser.sleep(300);
				expect(element(by.css('kendo-combobox[formcontrolname="SamplePreparation"] input')).getAttribute('value')).toContain('Two');
			});

						// describe('upload .csv', () => {
						// 	// TO DO
						// 	// wait till backend csv is done
						// 	it('select .csv and upload it', () => {})
						// 	it('output .csv data into table', () => {})

						// });

			it('able to submit form', () => {
				element(by.css('.analyte-details .btn-primary[value="Submit"]')).click();
				expect(element(by.css('.analyte-details a.edit'))).toBeDefined();
			});

			it('can click edit and show fields to redit existing data', () => {
				element(by.css('.analyte-details a.edit')).click().then(function(){
					element(by.css('textarea[formcontrolname="AnalyteDiluentNotes"]')).sendKeys('1');
					expect(element(by.css('textarea[formcontrolname="AnalyteDiluentNotes"]')).getAttribute('value')).toBe('asdasdad1');
				});
			});
		});

		describe('Sample Preparation Accordion', () => {

			it('should be able to navigate to create sample preps page', async () => {
				page.sampleprep().click();
				expect(title.getText()).toBe('Sample Prep Form');
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

				it('able to create new sample prep', () => {
					element(by.css('.save-submit button')).click();
				});

				it('search sample preps and select one', async() => {
					element(by.css('kendo-combobox[formcontrolname="SearchExistingSamplePrep"] input')).sendKeys('Enzymes Kinetex One');
					await browser.sleep(300);
					browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
					browser.actions().sendKeys(protractor.Key.ENTER).perform();
					await browser.sleep(300);
					expect(element(by.css('kendo-combobox[formcontrolname="SearchExistingSamplePrep"] input')).getAttribute('value')).toBe('Enzymes Kinetex One');
				});

				it('able to submit form', () => {
					element(by.css('.sample-preperation-methodology .btn-primary[value="Submit"]')).click();
					expect(element(by.css('.sample-preperation-methodology a.edit'))).toBeDefined();
				});

				it('can click edit and show fields to redit existing data', async() => {
					element(by.css('.sample-preperation-methodology a.edit')).click()
					element(by.css('kendo-combobox[formcontrolname="SearchExistingSamplePrep"] input')).clear();
					element(by.css('kendo-combobox[formcontrolname="SearchExistingSamplePrep"] input')).sendKeys('GMO Kinetex Twenty-Four');
					await browser.sleep(300);
					browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
					browser.actions().sendKeys(protractor.Key.ENTER).perform();
					await browser.sleep(300);
					expect(element(by.css('kendo-combobox[formcontrolname="SearchExistingSamplePrep"] input')).getAttribute('value')).toBe('GMO Kinetex Twenty-Four');
				});
			});

		});
	});

	describe('Status', () => {

		it('analyst draft be highlighted', () => {
			let a = element.all(by.css('.bs-wizard .bs-wizard-step'));
				expect(a.get(0).getAttribute('class')).toContain('active');
		});
	});

	describe('Sidebar', () => {

		// it('Send form when completed', () => {
		// 	element(by.css('phx-app phx-form aside button.btn-primary:only-child')).click().then(function(this){
		// 		form.textvalid(this, 'Analyst Draft');
		// 	});
		// });
		it('See status type to Analyst Draft', () => {
			expect(element(by.css('phx-app phx-form aside section.status label')).getText()).toBe('Status');
		});
		it('There be a created date set', () => {
			expect(element(by.css('phx-app phx-form aside section.created label')).getText()).toBe('Created Date');
		});
		it('There be a modified date set', () => {
			expect(element(by.css('phx-app phx-form aside section.modified label')).getText()).toBe('Modified By');
		});
	});

});
