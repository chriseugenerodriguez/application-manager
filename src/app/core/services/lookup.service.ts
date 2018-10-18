import { Injectable } from '@angular/core';
import { ILookup } from '../index';

@Injectable()
export class LookupService {
	constructor() {}

  public lookupKeyValue(lookupTable: Array<ILookup>, lookupValue: number): string {
    if (lookupTable.length !== 0) {
        for (const record of lookupTable) {
            if (record['Key'] === lookupValue) {
                return record['Value'];
            }
      }
    }
        
    return null;
  }

	public lookupKey(lookupTable: Array<ILookup>, lookupValue: string): number {
		for (const record of lookupTable) {
			if (record['Value'] === lookupValue) {
				return record['Key'];
			}
		}
		return null;
	}

}
