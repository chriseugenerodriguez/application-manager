import { by, element, browser, protractor } from 'protractor';

export class Form {

	save = element(by.css('phx-sample-pre-create .create-sample-prep .save-submit input'));
	submit = element(by.css('phx-sample-pre-create .create-sample-prep .save-submit button'));
	clone = element(by.css('phx-sample-pre-create .content .clone'));
	newstep = element(by.css('phx-app phx-sample-pre-create .create-sample-prep .btn-full'));

}
