import {expectTypeOf} from 'expect-type';
import type {ConditionalPickDeep} from '../index';

type Example = {
	a: string;
	b: string | boolean;
	c: {
		d: string;
		e: {
			f?: string;
			g?: boolean;
			h: string | boolean;
			i: boolean | bigint;
		};
		j: boolean;
	};
};

declare const stringPick: ConditionalPickDeep<Example, string>;
expectTypeOf(stringPick).toEqualTypeOf<{a: string; c: {d: string}}>();

declare const stringPickOptional: ConditionalPickDeep<Example, string | undefined>;
expectTypeOf(stringPickOptional).toEqualTypeOf<{a: string; c: {d: string; e: {f?: string}}}>();

declare const stringPickOptionalOnly: ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
expectTypeOf(stringPickOptionalOnly).toEqualTypeOf<{c: {e: {f?: string}}}>();

declare const booleanPick: ConditionalPickDeep<Example, boolean | undefined>;
expectTypeOf(booleanPick).toEqualTypeOf<{c: {e: {g?: boolean}; j: boolean}}>();

declare const numberPick: ConditionalPickDeep<Example, number>;
expectTypeOf(numberPick).toEqualTypeOf<{}>();

declare const stringOrBooleanPick: ConditionalPickDeep<Example, string | boolean>;
expectTypeOf(stringOrBooleanPick).toEqualTypeOf<{
	a: string;
	b: string | boolean;
	c: {
		d: string;
		e: {h: string | boolean};
		j: boolean;
	};
}>();

declare const stringOrBooleanPickOnly: ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
expectTypeOf(stringOrBooleanPickOnly).toEqualTypeOf<{b: string | boolean; c: {e: {h: string | boolean}}}>();
