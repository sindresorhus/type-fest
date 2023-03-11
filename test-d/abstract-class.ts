import {expectAssignable, expectError} from 'tsd';
import type {AbstractConstructor, AbstractClass} from '../index';

abstract class Foo {
	abstract fooMethod(): void;
}

abstract class Bar {
	abstract barMethod(): void;
}

function functionRecevingAbsClass<T>(cls: AbstractClass<T>) {
	return cls;
}

function withBar<T extends AbstractConstructor<object>>(Ctor: T) {
	abstract class ExtendedBar extends Ctor {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		extendedBarMethod() {}
	}
	return ExtendedBar;
}

function assertWithBar() {
	// This lacks `barMethod`.
	// @ts-expect-error
	class WrongConcreteExtendedBar extends withBar(Bar) {}

	// This should be alright since `barMethod` is implemented.
	class CorrectConcreteExtendedBar extends withBar(Bar) {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		barMethod() {}
	}
	expectAssignable(functionRecevingAbsClass<Bar>(withBar(Bar)));
	expectAssignable(functionRecevingAbsClass<Bar>(CorrectConcreteExtendedBar));
}

expectAssignable(functionRecevingAbsClass(Foo));
expectError(functionRecevingAbsClass<Bar>(Foo));
assertWithBar();
