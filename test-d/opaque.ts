import {expectType} from 'tsd';
import {Opaque} from '..';

type Value = Opaque<number>;

// We make an explicit cast so we can test the value.
const value: Value = 2 as Value;

// Every opaque type should have a private symbol member, so the compiler can differentiate separate opaque types.
expectType<symbol>(value.__opaque__);

// The underlying type of the value is still a number.
expectType<number>(value);
