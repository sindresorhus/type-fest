import {expectType} from 'tsd';
import type {ConditionalKeys} from '../index.d.ts';

type Example = {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
	e: never;
};

declare const exampleConditionalKeys: ConditionalKeys<Example, string>;
expectType<'a'>(exampleConditionalKeys);

declare const exampleConditionalKeysWithUndefined: ConditionalKeys<Example, string | undefined>;
expectType<'a' | 'c'>(exampleConditionalKeysWithUndefined);

declare const exampleConditionalKeysTargetingNever: ConditionalKeys<Example, never>;
expectType<'e'>(exampleConditionalKeysTargetingNever);
