import {expectType} from 'tsd';
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
expectType<{a: string; c: {d: string}}>(stringPick);

declare const stringPickOptional: ConditionalPickDeep<Example, string | undefined>;
expectType<{a: string; c: {d: string; e: {f?: string}}}>(stringPickOptional);

declare const stringPickOptionalOnly: ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
expectType<{c: {e: {f?: string}}}>(stringPickOptionalOnly);

declare const booleanPick: ConditionalPickDeep<Example, boolean | undefined>;
expectType<{c: {e: {g?: boolean}; j: boolean}}>(booleanPick);

declare const numberPick: ConditionalPickDeep<Example, number>;
expectType<{}>(numberPick);

declare const stringOrBooleanPick: ConditionalPickDeep<Example, string | boolean>;
expectType<{
	a: string;
	b: string | boolean;
	c: {
		d: string;
		e: {h: string | boolean};
		j: boolean;
	};
}>(stringOrBooleanPick);

declare const stringOrBooleanPickOnly: ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
expectType<{b: string | boolean; c: {e: {h: string | boolean}}}>(stringOrBooleanPickOnly);
