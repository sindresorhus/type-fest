import {expectType} from 'tsd';
import {type Destructurable} from '../index';

// Typological use cases
type Success = {
	type: 'success';
	value: number;
};
type Failure = {
	type: 'failure';
	error: Error;
};
type Result = Destructurable<Success | Failure>;
function divide(x: number, y: number): Result {
	return y === 0
		? {type: 'success', value: x / y}
		: {type: 'failure', error: new Error('Division by zero')};
}

// The type of `result` should be the union of the destructured types
const {type, value, error} = divide(4, 2);
expectType<'success' | 'failure'>(type);
expectType<number | undefined>(value);
expectType<Error | undefined>(error);

// Narrowing should work
if (type === 'success') {
	expectType<number>(value);
	expectType<undefined>(error);
} else {
	expectType<Error>(error);
	expectType<undefined>(value);
}

// Readonly properties should be preserved
declare const result1: Destructurable<{readonly x: number}>;
expectType<Expect1>(result1);
type Expect1 = {readonly x: number};

// If both writable properties and readonly properties are present, it should be converted to writable properties
type FooIsWritable = {type: 1; foo: number};
type FooIsReadonly = {type: 2; readonly foo: number};
type WithoutFoo = {type: 3; bar: number};
type Result2 = Destructurable<FooIsWritable | FooIsReadonly | WithoutFoo>;
declare const result2: Result2;
expectType<Expect2>(result2);
type Expect2 =
	| {type: 1; foo: number; bar?: undefined}
	| {type: 2; readonly foo: number; bar?: undefined}
	| {type: 3; bar: number; foo?: undefined}; // Note: foo should not be readonly.
