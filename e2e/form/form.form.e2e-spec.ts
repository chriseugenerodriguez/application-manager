import { by, element, browser, protractor } from 'protractor';

export class Form {
	overview() {
		return element(by.css('phx-app phx-form .content .application-details phx-overview .panel-group accordion-group .panel'));
	}

	columndetails() {
		return element(by.css('phx-app phx-form .content .application-details phx-column-details .panel-group accordion-group .panel'));
	}

	instrumentationconditions() {
		return element(by.css('phx-app phx-form .content .application-details phx-instrumentation-conditions .panel-group accordion-group .panel'));
	}

	analytedetails() {
		return element(by.css('phx-app phx-form .content .application-details phx-analyte-details .panel-group accordion-group .panel'));
	}

	samplepreperation() {
		return element(by.css('phx-app phx-form .content .application-details phx-sample-preparation-methodology .panel-group accordion-group .panel'));
	}

	documentofficialmethod() {
		return element(by.css('phx-app phx-form .content .application-details phx-document-terms .panel-group accordion-group .panel'));
	}

	codingrelatedterms() {
		return element(by.css('phx-app phx-form .content .application-details phx-coding-related-terms .panel-group accordion-group .panel'));
	}

	chromatograms() {
		return element(by.css('phx-app phx-form .content .application-details phx-chromatograms .panel-group accordion-group .panel'));
	}

	save() {
		return element(by.css('phx-app phx-form .content .application-details .save-submit .btn[value="Save"]'));
	}

	clone() {
		return element(by.css('phx-app phx-form .content .clone'));
	}

	click(accordion) {
		return element(by.css(accordion)).click();
	}

}
