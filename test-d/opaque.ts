import {expectAssignable, expectError} from 'tsd';
import {Opaque} from '../index';

type Value = Opaque<number, 'Value'>;

// We make an explicit cast so we can test the value.
const value: Value = 2 as Value;

// The underlying type of the value is still a number.
expectAssignable<number>(value);

// You cannot modify an opaque value.
expectError<Value>(value + 2); // eslint-disable-line @typescript-eslint/restrict-plus-operands

type WithoutToken = Opaque<number>;
expectAssignable<WithoutToken>(2 as WithoutToken);

// @ts-expect-error
type Person = {
	id: Opaque<number, Person>; // eslint-disable-line @typescript-eslint/no-unused-vars
	name: string;
};
