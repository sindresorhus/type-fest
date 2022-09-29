import {expectType} from 'tsd';
import type {ConditionalKeys} from '../index';

type Example = {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
};

declare const exampleConditionalKeys: ConditionalKeys<Example, string>;
expectType<'a'>(exampleConditionalKeys);

declare const exampleConditionalKeysWithUndefined: ConditionalKeys<Example, string | undefined>;
expectType<'a' | 'c'>(exampleConditionalKeysWithUndefined);
