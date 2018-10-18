import { by, element } from 'protractor';

export class Buttons {
	newapp = element(by.css('.app-viewer header .main-action-buttons #new-app'));

	newapplc = element(by.css('.app-viewer header .main-action-buttons')).element(by.tagName('.dropdown-menu li:first-child a'));

	newappgc = element(by.css('.app-viewer header .main-action-buttons')).element(by.tagName('.dropdown-menu li:last-child a'));

	archive = element(by.css('.app-viewer header .options #archive'));

	export = element(by.css('.app-viewer header .options #export-conditions'));

	clearfilter = element(by.css('.app-viewer header .right #clear-filter'));

}
