import { by, element } from 'protractor';

export class Status {
	analystdraft() {
		return element(by.css('phx-app phx-form .bs-wizard .bs-wizard-step:first-child() .bs-wizard-stepnum'));
	}

	analystreview() {
		return element(by.css('phx-app phx-form .bs-wizard .bs-wizard-step:nth-child(2) .bs-wizard-stepnum'));
	}

	marketingdraft() {
		return element(by.css('phx-app phx-form .bs-wizard .bs-wizard-step:nth-child(3) .bs-wizard-stepnum'));
	}

	marketingreview() {
		return element(by.css('phx-app phx-form .bs-wizard .bs-wizard-step:nth-child(4) .bs-wizard-stepnum'));
	}

	chromatogramupload() {
		return element(by.css('phx-app phx-form .bs-wizard .bs-wizard-step:nth-child(5) .bs-wizard-stepnum'));
	}

	webapproval() {
		return element(by.css('phx-app phx-form .bs-wizard .bs-wizard-step:nth-child(6) .bs-wizard-stepnum'));
	}

	live() {
		return element(by.css('phx-app phx-form .bs-wizard .bs-wizard-step:nth-child(7) .bs-wizard-stepnum'));
	}
}
