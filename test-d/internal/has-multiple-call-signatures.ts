import {expectTypeOf} from 'nz';
import type {HasMultipleCallSignatures} from '../../source/internal/index.d.ts';

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Overloaded2 = {
	(foo: number | undefined): string;
	(foo: number): string;
};

type Namespace = {
	(foo: number): string;
	baz: boolean[];
};

expectTypeOf<HasMultipleCallSignatures<Overloaded>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded2>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Namespace>>().toBe<false>();
