import {expectTypeOf} from 'nz';
import type {ObjectValue} from '../../source/internal/index.d.ts';

type ObjectT = {
	string: string;
	0: number;
	'1': number;
};

declare const normal: ObjectValue<ObjectT, 'string'>;
expectTypeOf(normal).toBe<string>();

declare const test0: ObjectValue<ObjectT, 0>;
expectTypeOf(test0).toBe<number>();
declare const teststring0: ObjectValue<ObjectT, '0'>;
expectTypeOf(teststring0).toBe<number>();
declare const test1: ObjectValue<ObjectT, 1>;
expectTypeOf(test1).toBe<number>();
declare const teststring1: ObjectValue<ObjectT, '1'>;
expectTypeOf(teststring1).toBe<number>();
