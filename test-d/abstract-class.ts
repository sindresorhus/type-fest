import {expectError, expectAssignable, expectNotAssignable} from 'tsd';
import type {AbstractConstructor, AbstractClass} from '../index';

abstract class Foo {
	constructor(x: number) {
		void (x);
	}

	abstract fooMethod(): void;
}

abstract class Bar {
	abstract barMethod(): void;
}

function functionReceivingAbsClass<T>(cls: AbstractClass<T>) {
	return cls;
}

function withBar<T extends AbstractConstructor<object>>(Ctor: T) {
	abstract class ExtendedBar extends Ctor {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		extendedBarMethod() {}
	}
	return ExtendedBar;
}

// This lacks `barMethod`.
// @ts-expect-error
class WrongConcreteExtendedBar extends withBar(Bar) {}

// This should be alright since `barMethod` is implemented.
class CorrectConcreteExtendedBar extends withBar(Bar) {
	constructor(x: number, y: number) {
		super();
		void (x);
		void (y);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	barMethod() {}
}

function assertWithBar() {
	functionReceivingAbsClass<Bar>(withBar(Bar));
	functionReceivingAbsClass<Bar>(CorrectConcreteExtendedBar);
}

functionReceivingAbsClass(Foo);
expectError(functionReceivingAbsClass<Bar>(Foo));
assertWithBar();

expectAssignable<AbstractConstructor<{barMethod(): void}, []>>(Bar);
expectAssignable<AbstractClass<{barMethod(): void}, []>>(Bar);

// Prototype test
expectAssignable<{barMethod(): void}>(Bar.prototype);
expectNotAssignable<{fooMethod(): void}>(Bar.prototype);
expectError(new CorrectConcreteExtendedBar(12));
expectAssignable<{barMethod(): void}>(new CorrectConcreteExtendedBar(12, 15));
// /Prototype test
