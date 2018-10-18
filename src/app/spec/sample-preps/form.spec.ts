import { TestBed, async, inject, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { APIService } from '../api'


describe('Sample Preps:', () => {

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

	describe('Form -', () => {
		it('Sample Prep Technique', async(inject([APIService], (service: APIService) => {
			service.get('lookup/SamplePrepTechnique').subscribe((r) => {
				expect(r).toBeDefined();
			});
		})));

		it('PHE or Competitor', async(inject([APIService], (service: APIService) => {
			service.get('lookup/PHECompetitorKey').subscribe((r) => {
				expect(r).toBeDefined();
			});
		})));

		it('Mfg Code', async(inject([APIService], (service: APIService) => {
			service.get('lookup/mfgCodeKey').subscribe((r) => {
				expect(r).toBeDefined();
			});
		})));

		it('Brand Code', async(inject([APIService], (service: APIService) => {
			service.get('lookup/brandCodeKey').subscribe((r) => {
				expect(r).toBeDefined();
			});
		})));
	});

});
