import {Mutable} from '..';

type Foo = {
	readonly a: number;
	readonly b: string;
};

const ab: Mutable<Foo> = {a: 1, b: '2'};
ab.a = 2;
const ab2: Mutable<Readonly<Foo>> = ab;
ab2.a = 2;
