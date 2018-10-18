import { by, element } from 'protractor';

export class Buttons {

	status = element(by.css('.setting-user .setting .status kendo-dropdownlist span.k-select'));
	technology = element(by.css('.setting-user .setting .technology kendo-dropdownlist span.k-select'));
	assigned = element(by.css('.setting-user .setting .assigned-to kendo-dropdownlist span.k-select'));

}
