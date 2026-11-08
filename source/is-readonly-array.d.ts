import type {IsNever} from './is-never.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {FixedLengthArray} from './fixed-length-array.d.ts'; // For `@link`

/**
Returns a boolean for whether the given array or tuple is readonly.

Useful for writing array transformations that preserve mutability. Only the outer array is checked, not its elements.

Distributes over unions: A mix of mutable and readonly arrays returns `boolean`. Returns `boolean` for `any` and `false` for `never`. Non-array types are not accepted.

@example
```
import type {IsReadonlyArray} from 'type-fest';

type Readonly = IsReadonlyArray<readonly string[]>;
//=> true

type Mutable = IsReadonlyArray<[string, number?]>;
//=> false

type Mixed = IsReadonlyArray<string[] | readonly number[]>;
//=> boolean
```

@example
```
import type {If, IsReadonlyArray} from 'type-fest';

type WrapElements<Array_ extends readonly unknown[]> = Array_ extends unknown
	? If<IsReadonlyArray<Array_>, ReadonlyArray<{value: Array_[number]}>, Array<{value: Array_[number]}>>
	: never;

type Mutable = WrapElements<string[]>;
//=> {value: string}[]

type Readonly = WrapElements<readonly number[]>;
//=> readonly {value: number}[]

type Mixed = WrapElements<string[] | readonly number[]>;
//=> {value: string}[] | readonly {value: number}[]
```

This checks assignability to mutable arrays. Custom array types without the full mutable array interface, such as {@link FixedLengthArray}, are treated as readonly even if individual indices are writable. The `never` check prevents an empty union from returning `never`.

@category Type Guard
@category Array
*/
export type IsReadonlyArray<Array_ extends UnknownArray> = IsNever<Array_> extends true ? false : Array_ extends unknown[] ? false : true;

export {};
