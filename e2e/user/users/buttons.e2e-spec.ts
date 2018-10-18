import { by, element } from 'protractor';

export class Buttons {

	add = element(by.css('phx-users .search-user .btn'));
	cancel = element(by.css('phx-users kendo-dialog .k-button-group .k-button:first-child'));
	create = element(by.css('phx-users kendo-dialog .k-dialog-buttongroup .k-button.k-primary'));
	selectuser = element(by.css('phx-users kendo-dialog kendo-combobox span.k-select'));
	selectrole = element(by.css('phx-users kendo-dialog kendo-multiselect'));
	close = element(by.css('phx-users kendo-dialog .k-dialog-buttongroup .k-button:first-child'));

}
