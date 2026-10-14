import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {Join} from './join.d.ts';
import type {JoinableItem} from './internal/string.d.ts';

/**
Join a union of strings and/or numbers using the given string as a delimiter.

The delimiter defaults to `,`, like `Array#join()`.

Use-case: Showing the members of a union in a readable way, like in an error message.

Note: The order of the members is not guaranteed.

@example
```
import type {JoinUnion} from 'type-fest';

type T1 = JoinUnion<'a' | 'b' | 'c'>;
//=> 'a,b,c'

type T2 = JoinUnion<1 | 2 | 3, ' | '>;
//=> '1 | 2 | 3'

type T3 = JoinUnion<'foo'>;
//=> 'foo'

type T4 = JoinUnion<never>;
//=> ''
```

@see {@link Join}
@category Union
@category Template literal
*/
export type JoinUnion<
	Items extends JoinableItem,
	Delimiter extends string = ',',
> = UnionToTuple<Items> extends infer Tuple extends JoinableItem[]
	? Join<Tuple, Delimiter>
	: '';

export {};
