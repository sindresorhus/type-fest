import {expectType} from 'tsd';
import type {IsEqual, LiteralToPrimitiveDeep} from '../index.d.ts';

type LiteralObject = {
	a: string;
	b: number;
	c: boolean;
	d: {
		e: bigint;
		f: symbol;
		g: {
			h: string[];
			i: {
				j: boolean;
				k: {
					l: 1;
					m: 'hello';
					o: [1, 2, 3];
					p: ['a', 'b', 'c'];
					q: [1, 'a', true];
				};
			};
		};
	};
};

type PrimitiveObject = {
	a: string;
	b: number;
	c: boolean;
	d: {
		e: bigint;
		f: symbol;
		g: {
			h: string[];
			i: {
				j: boolean;
				k: {
					l: number;
					m: string;
					o: number[];
					p: string[];
					q: Array<number | string | boolean>;
				};
			};
		};
	};
};

const typeEqual: IsEqual<
LiteralToPrimitiveDeep<LiteralObject>,
PrimitiveObject
> = true;
expectType<true>(typeEqual);
