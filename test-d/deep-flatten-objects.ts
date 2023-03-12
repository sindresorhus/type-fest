import {expectAssignable} from 'tsd';
import type {DeepFlattenRecord} from '../index';

type Test1 = {
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

type ExpectedTest1Cascade = {
	arrayKey: string[];
	nestedTwoArrayKey: string[];
	nestedThreeNumberKey?: number;
	nestedTwoStringKey: string;
	nestedTwoFunctionKey: () => void;
	stringKey: string;
	numberKey: number;
	functionKey: () => void;
};

type ExpectedTest1NoCascade = {
	arrayKey: string[];
	nestedTwoArrayKey: string[];
	nestedThreeNumberKey: number;
	nestedTwoStringKey: string;
	nestedTwoFunctionKey: () => void;
	stringKey: string;
	numberKey: number;
	functionKey: () => void;
};

declare const actualValueCascadeOptionality: ExpectedTest1Cascade;
declare const actualValueNoCascade: ExpectedTest1NoCascade;

expectAssignable<DeepFlattenRecord<Test1>>(actualValueCascadeOptionality);
expectAssignable<DeepFlattenRecord<Test1, {cascadeOptionality: false}>>(actualValueNoCascade);
