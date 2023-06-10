import {expectAssignable, expectError, expectType} from 'tsd';
import type {Class, Constructor, IsAny} from '../index';

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
	expectError(new Cls(1, ''));
	return new Cls(1, 2);
}

fn(Foo);
fn2(Foo);

type PositionProps = {
	top: number;
	left: number;
};

class Position {
	top = 0;
	left = 0;
}

declare const Bar: Class<PositionProps>;

expectAssignable<Class<PositionProps>>(Position);
expectAssignable<Constructor<PositionProps>>(Position);
expectType<IsAny<typeof Bar['prototype']>>(false);
expectType<PositionProps>(Position.prototype);
