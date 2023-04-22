import {expectError, expectType} from 'tsd';
import type {OverrideProperties} from '../source/override-properties';

type Foo = {
	a: number;
	b: string;
};

const aMod: OverrideProperties<Foo, {b: number}> = {a: 1, b: 2};
expectType<{a: number; b: number}>(aMod);

expectError(() => {
    type Bar = OverrideProperties<Foo, {c: number}>;
});
