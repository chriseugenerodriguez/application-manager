import { by, element } from 'protractor';

export class Buttons {
	save = element(by.css('kendo-dialog .k-dialog-buttongroup .k-button.k-primary'));
	add = element(by.css('phx-roles header button'));
}

