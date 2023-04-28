import {expectError, expectType} from 'tsd';
import type {OverrideProperties} from '../source/override-properties';

type Foo = {
	a: number;
	b: string;
};

const fixture: OverrideProperties<Foo, {b: number}> = {a: 1, b: 2};
expectType<{a: number; b: number}>(fixture);

expectError(() => {
    type Bar = OverrideProperties<Foo, {c: number}>;
});

expectError(() => {
    type Bar = OverrideProperties<Foo, {b: number; c: number}>;
});
