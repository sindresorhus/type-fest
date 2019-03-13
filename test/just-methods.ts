import {expectType} from 'tsd-check';
import {JustMethods} from '..';

interface Foo {
	a: string;
	b: number;
	c(): string;
	d(x: string): string;
}

const foo: JustMethods<Foo> = {c: () => 'c', d: (x: string) => x};

expectType<{c(): string}>(foo);
