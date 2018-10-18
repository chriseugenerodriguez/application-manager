import { by, element } from 'protractor';

export class Roles {

	overviewRead = element(by.css('.k-dialog-wrapper .overview kendo-switch[formcontrolname="overviewRead"]'));
	overviewWrite = element(by.css('.k-dialog-wrapper .overview kendo-switch[formcontrolname="overviewWrite"]'));

	columnDetailsRead = element(by.css('.k-dialog-wrapper .column-details kendo-switch[formcontrolname="columnRead"]'));
	columnDetailsWrite = element(by.css('.k-dialog-wrapper .column-details kendo-switch[formcontrolname="columnWrite"]'));

	instrumentationConditionsRead = element(by.css('.k-dialog-wrapper .instrumentation-conditions kendo-switch[formcontrolname="instrRead"]'));
	instrumentationConditionsWrite = element(by.css('.k-dialog-wrapper .instrumentation-conditions kendo-switch[formcontrolname="instrWrite"]'));

	analyteDetailsRead = element(by.css('.k-dialog-wrapper .analyte-details kendo-switch[formcontrolname="analyteRead"]'));
	analyteDetailsWrite = element(by.css('.k-dialog-wrapper .analyte-details kendo-switch[formcontrolname="analyteWrite"]'));

	samplePrepRead = element(by.css('.k-dialog-wrapper .sample-prep kendo-switch[formcontrolname="sampleRead"]'));
	samplePrepWrite = element(by.css('.k-dialog-wrapper .sample-prep kendo-switch[formcontrolname="sampleWrite"]'));

	chromatogramsRead = element(by.css('.k-dialog-wrapper .chromatograms kendo-switch[formcontrolname="chromRead"]'));
	chromatogramsWrite = element(by.css('.k-dialog-wrapper .chromatograms kendo-switch[formcontrolname="chromWrite"]'));

	documentsRelatedTermsRead = element(by.css('.k-dialog-wrapper .document-terms kendo-switch[formcontrolname="docRead"]'));
	documentsRelatedTermsWrite = element(by.css('.k-dialog-wrapper .document-terms kendo-switch[formcontrolname="docWrite"]'));

	codingrelatedtermsRead = element(by.css('.k-dialog-wrapper .coding-related-terms kendo-switch[formcontrolname="codingRead"]'));
	codingrelatedtermsWrite = element(by.css('.k-dialog-wrapper .coding-related-terms kendo-switch[formcontrolname="codingWrite"]'));

	publish = element(by.css('.k-dialog-wrapper .publish input'));
	assignto = element(by.css('.k-dialog-wrapper kendo-combobox span.k-select'));

}
