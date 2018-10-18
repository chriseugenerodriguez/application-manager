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

	describe('Grid -', () => {

		it('Able to connect to API', async(inject([APIService], (service: APIService) => {
			service.get('sample-preps', '?page=1&pageSize=20').subscribe((r) => {
				expect(r.status).toBe('200');
			});
		})));

		it('Retreive data items', async(inject([APIService], (service: APIService) => {
			service.get('sample-preps', '?page=1&pageSize=20').subscribe((r) => {
				expect(r).toBeDefined();
			});
		})));

	});
});
