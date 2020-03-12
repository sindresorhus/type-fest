import {expectAssignable, expectError} from 'tsd';
import {Opaque} from '..';

type Value = Opaque<number, 'Value'>;

// We make an explicit cast so we can test the value.
const value: Value = 2 as Value;

// Every opaque type should have a private member with a type of the Token parameter, so the compiler can differentiate separate opaque types.
expectAssignable<unknown>(value.__opaque__);

// The underlying type of the value is still a number.
expectAssignable<number>(value);

// You cannot modify an opaque value.
expectError<Value>(value + 2); // eslint-disable-line @typescript-eslint/restrict-plus-operands
