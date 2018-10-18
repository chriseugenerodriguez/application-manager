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

	describe('Settings -', () => {
		it('Status', async(inject([APIService], (service: APIService) => {
			service.get('users/1/settings').subscribe((r) => {
				expect(r.text).toContain('Status');
			});
		})));

		it('Technology', async(inject([APIService], (service: APIService) => {
			service.get('users/1/settings').subscribe((r) => {
				expect(r.text).toContain('Technology');
			});
		})));

		it('Assigned To', async(inject([APIService], (service: APIService) => {
			service.get('users/1/settings').subscribe((r) => {
				expect(r.text).toContain('Assigned To');
			});
		})));

	});

});
