import {expectType} from 'tsd';
import type {ObjectValue} from '../../source/internal/index.d.ts';

type ObjectT = {
	string: string;
	0: number;
	'1': number;
};

declare const normal: ObjectValue<ObjectT, 'string'>;
expectType<string>(normal);

declare const test0: ObjectValue<ObjectT, 0>;
expectType<number>(test0);
declare const teststring0: ObjectValue<ObjectT, '0'>;
expectType<number>(teststring0);
declare const test1: ObjectValue<ObjectT, 1>;
expectType<number>(test1);
declare const teststring1: ObjectValue<ObjectT, '1'>;
expectType<number>(teststring1);
