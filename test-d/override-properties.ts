import {expectType} from 'tsd';
import type {OverrideProperties} from '../source/override-properties';

type Foo = {
	a: number;
	b: string;
};

const fixture: OverrideProperties<Foo, {b: number}> = {a: 1, b: 2};
expectType<{a: number; b: number}>(fixture);

// @ts-expect-error
type Bar = OverrideProperties<Foo, {c: number}>;

// @ts-expect-error
type Bar = OverrideProperties<Foo, {b: number; c: number}>;
