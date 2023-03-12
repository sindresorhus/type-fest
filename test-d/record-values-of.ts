import {expectType} from 'tsd';
import type {RecordValuesOf} from '../index';

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

type ExpectedType = {
	nestedTwoArrayKey: string[];
	nestedTwoObjectKey?: {
		nestedThreeNumberKey: number;
	};
	nestedTwoStringKey: string;
	nestedTwoFunctionKey: () => void;
};

declare const actualValue: ExpectedType;

expectType<RecordValuesOf<ExampleType>>(actualValue);
