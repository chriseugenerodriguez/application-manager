import { by, element } from 'protractor';

export class Grid {

	titlesrow() {
		return element(by.css('.app-viewer .k-grid thead tr:nth-child(2) th'));
	}

	filterrow() {
		return element(by.css('.app-viewer .k-grid thead kendogridfilterrow th'));
	}

	itemrow() {
		return element(by.css('.app-viewer .k-grid tbody tr'));
	}

}
