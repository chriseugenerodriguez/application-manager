import { by, element } from 'protractor';

export class Buttons {
	newapp = element(by.css('.sample-prep-viewer header .btn-primary'));
	clearfilter = element(by.css('.sample-prep-viewer header .right .btn'));
}
