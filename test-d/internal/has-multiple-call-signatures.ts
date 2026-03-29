import {expectType} from 'tsd';
import type {HasMultipleCallSignatures} from '../../source/internal/index.d.ts';

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Overloaded2 = {
	(foo: number | undefined): string;
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	(foo: number): string;
};

type Namespace = {
	(foo: number): string;
	baz: boolean[];
};

expectType<true>({} as HasMultipleCallSignatures<Overloaded>);
expectType<true>({} as HasMultipleCallSignatures<Overloaded2>);
expectType<false>({} as HasMultipleCallSignatures<Namespace>);
