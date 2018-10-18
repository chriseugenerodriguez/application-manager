import { by, element } from 'protractor';

export class Sidebar {
	send() {
		return element(by.css('phx-app phx-form aside button.btn-primary[type="send"]'));
	}

	approve() {
		return element(by.css('phx-app phx-form aside button.btn-primary[type="approve"]'));
	}

	reject() {
		return element(by.css('phx-app phx-form aside button.btn[type="reject"]'));
	}

	publish() {
		return element(by.css('phx-app phx-form aside button.btn-primary[type="publish"]'));
	}

	status() {
		return element(by.css('phx-app phx-form aside section:nth-child(2) span'));
	}

	approver() {
		return element(by.css('phx-app phx-form aside section:nth-child(3) span'));
	}

	created() {
		return element(by.css('phx-app phx-form aside section:nth-child(4) span'));
	}

	modified() {
		return element(by.css('phx-app phx-form aside section:nth-child(5) span'));
	}
}
