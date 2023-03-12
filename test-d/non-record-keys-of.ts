import {expectType} from 'tsd';
import type {NonRecordKeysOf} from '../index';

type ExampleType = {
	arrayKey: string[];
	objectKey: {
		nestedTwoArrayKey: string[];
		nestedTwoObjectKey?: {
			nestedThreeNumberKey: number;
		};
		nestedTwoStringKey: string;
		nestedTwoFunctionKey: () => void;
	};
	stringKey: string;
	numberKey: number;
	functionKey: () => void;
};

type ExpectedType = 'arrayKey' | 'stringKey' | 'numberKey' | 'functionKey';

declare const actualValue: ExpectedType;

expectType<NonRecordKeysOf<ExampleType>>(actualValue);
