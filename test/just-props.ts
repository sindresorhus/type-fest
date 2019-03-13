import {expectType} from 'tsd-check';
import {JustProps} from '..';

interface Foo {
	a: string;
	b: number;
	c(): string;
	d(x: string): string;
}

const foo: JustProps<Foo> = {a: 'a', b: 2};

expectType<{a: string; b: number}>(foo);
