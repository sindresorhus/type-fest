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

function withBar<T extends AbstractConstructor<object>>(Ctor: T): AbstractClass<object> {
	abstract class ExtendedBar extends Ctor {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		extendedBarMethod() {}
	}
	return ExtendedBar;
}

function assertWithBar() {
	// This lacks `barMethod`.
	expectError(class WrongConcreteExtendedBar extends withBar(Bar) {});

	// This should be alright since `barMethod` is implemented.
	class CorrectConcreteExtendedBar extends withBar(Bar) {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		barMethod() {}
	}
}

expectAssignable(functionRecevingAbsClass(Foo));
assertWithBar();
