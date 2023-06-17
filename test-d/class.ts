import {expectAssignable, expectError, expectNotAssignable, expectType} from 'tsd';
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

// Prototype test
type PositionProps = {
	top: number;
	left: number;
};

class Position {
	public top: number;

	public left: number;

	constructor(parameterTop: number, parameterLeft: number) {
		this.top = parameterTop;
		this.left = parameterLeft;
	}
}

declare const Bar: Class<PositionProps>;

expectAssignable<Class<PositionProps>>(Position);

expectNotAssignable<Class<PositionProps, [number]>>(Position);

expectAssignable<Class<PositionProps, [number, number]>>(Position);
expectAssignable<Constructor<PositionProps, [number, number]>>(Position);

expectType<IsAny<typeof Bar['prototype']>>(false);
expectType<PositionProps>(Position.prototype);
// /Prototype test

expectError(new Position(17));
expectAssignable<PositionProps>(new Position(17, 34));
