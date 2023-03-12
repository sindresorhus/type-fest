import {expectType} from 'tsd';
import type {CascadeOptional} from '../index';

type Test1 = {
	objectKey: {
		nestedArrayKey: string[];
	};
};

type ExpectedTest1 = {
	objectKey: {
		nestedArrayKey: string[];
	};
};

declare const testValue1: ExpectedTest1;
expectType<CascadeOptional<Test1>>(testValue1);

type Test2 = {
	objectKey: {
		nestedObjectKey?: {
			nestedKey: unknown;
		};
	};
};

type ExpectedTest2 = {
	objectKey: {
		nestedObjectKey?: {
			nestedKey: unknown;
		};
	};
};

declare const testValue2: ExpectedTest2;
expectType<CascadeOptional<Test2>>(testValue2);

type Test3 = {
	objectKeyOptional?: {
		nestedKeyNotOriginallyOptional: {
			deeplyNestedKey: unknown;
		};
	};
};

type ExpectedTest3 = {
	objectKeyOptional?: {
		nestedKeyNotOriginallyOptional?: {
			deeplyNestedKey: unknown;
		};
	};
};

declare const testValue3: ExpectedTest3;
expectType<CascadeOptional<Test3>>(testValue3);
