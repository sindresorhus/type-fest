import type {ExcludeExactly} from './exclude-exactly.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {UnionMember} from './union-member.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Returns the length of a union type.

@example
```
import type {UnionLength} from 'type-fest';

type T1 = UnionLength<'foo' | 'bar' | 'baz'>;
//=> 3

type T2 = UnionLength<[string, string] | {x: string; y: string}>;
//=> 2

type T3 = UnionLength<any>;
//=> 1

type T4 = UnionLength<never>;
//=> 0
```

@category Type
*/
export type UnionLength<T> = _UnionLength<T>;

type _UnionLength<T, Accumulator extends UnknownArray = []> =
	IsNever<T> extends true
		? Accumulator['length']
		: UnionMember<T> extends infer Member
			? _UnionLength<ExcludeExactly<T, Member>, [...Accumulator, Member]>
			: never;

export {};
