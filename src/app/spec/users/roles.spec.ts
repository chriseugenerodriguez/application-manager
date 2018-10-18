import { TestBed, async, inject, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { APIService } from '../api'


describe('Users:', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpModule
			],
			providers: [
				{provide: HttpClient, deps: [MockBackend]},
				APIService
		]
		});

		TestBed.compileComponents();
	}));

	describe('Roles -', () => {
		it('Title', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Title');
			});
		})));

		it('Overview', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Status');
			});
		})));

		it('Column Details', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Technology');
			});
		})));

		it('Instrumentation and Conditions', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Instrumentation and Conditions');
			});
		})));

		it('Analyte Details', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Analyte Details');
			});
		})));

		it('Sample Prep Method', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Sample Prep Method');
			});
		})));

		it('Chromatograms', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Chromatograms');
			});
		})));

		it('Documents and Related Terms', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Documents and Related Terms');
			});
		})));

		it('Coding and Related Terms', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Coding and Related Terms');
			});
		})));

		it('Publish', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Publish');
			});
		})));

		it('Assign To', async(inject([APIService], (service: APIService) => {
			service.get('users/1/roles').subscribe((r) => {
				expect(r.text).toContain('Assign To');
			});
		})));
	});

});
