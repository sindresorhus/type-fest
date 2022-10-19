import type {Constructor} from '../index';

class Foo {
	constructor(x: number, y: any) {
		console.log(x, y);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	method(): void {}
}

function fn(Cls: Constructor<Foo>): Foo {
	return new Cls(1, '', 123);
}

function fn2(Cls: Constructor<Foo, [number, number]>): Foo {
	// @ts-expect-error
	// eslint-disable-next-line no-new
	new Cls(1, '');
	return new Cls(1, 2);
}

fn(Foo);
fn2(Foo);
