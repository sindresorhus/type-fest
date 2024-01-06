import type {Join} from './join';
import type {ArraySlice} from './array-slice';
import type {StringToArray} from './internal';

/**
Returns a string slice of a given range(with negative index support), just like `String.slice` in js.

@see {ArraySlice}

@example
```
StringSlice<'abcde', 0, 2>
//=> 'ab'

StringSlice<'abcde', 1>
//=> 'bcde'

StringSlice<'abcde', 0, -1>
//=> 'abcd'

StringSlice<'abcde', -2, -1>
//=> 'd'
```

@category String
 */
export type StringSlice<
	S extends string,
	Start extends number = 0,
	End extends number = StringToArray<S>['length'],
> = string extends S
	? string[]
	: Join<ArraySlice<StringToArray<S>, Start, End>, ''>;
