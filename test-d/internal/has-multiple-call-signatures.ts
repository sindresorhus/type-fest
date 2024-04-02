import {expectType} from 'tsd';
import type {HasMultipleCallSignatures} from '../../source/internal';

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Namespace = {
	(foo: number): string;
	baz: boolean[];
};

expectType<true>({} as HasMultipleCallSignatures<Overloaded>);
expectType<false>({} as HasMultipleCallSignatures<Namespace>);
