import {expectTypeOf} from 'expect-type';
import type {ConditionalKeys} from '../index';

type Example = {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
};

declare const exampleConditionalKeys: ConditionalKeys<Example, string>;
expectTypeOf(exampleConditionalKeys).toEqualTypeOf<'a'>();

declare const exampleConditionalKeysWithUndefined: ConditionalKeys<Example, string | undefined>;
expectTypeOf(exampleConditionalKeysWithUndefined).toEqualTypeOf<'a' | 'c'>();
