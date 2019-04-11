import {expectType} from 'tsd';
import {Mutable} from '..';

type Foo = {
	readonly a: number;
	readonly b: string;
};

const ab: Mutable<Foo> = {a: 1, b: '2'};
expectType<{a: number; b: string}>(ab);
expectType<Mutable<Readonly<Foo>>>(ab);
