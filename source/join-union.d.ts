import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {Join, JoinableItem} from './join.d.ts';

/**
Join a union of strings and/or numbers ({@link JoinableItem `JoinableItems`}) using the given string as a delimiter.

Delimiter defaults to `,`.

@example
```
import type {JoinUnion} from 'type-fest';

type T1 = JoinUnion<'a' | 'b' | 'c'>;
//=> 'a, b, c'

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
