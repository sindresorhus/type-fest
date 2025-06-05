import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
A stricter, non-distributive version of `extends` for checking whether one type is assignable to another.

Unlike the built-in `extends` keyword, `ExtendsStrict`:

1. Prevents distribution over union types by wrapping both types in tuples. For example, `ExtendsStrict<string | number, number>` returns `false`, whereas `string | number extends number` would result in `boolean`.

2. Treats `never` as a special case: returns `true` if both `Left` and `Right` are `never`.

@example
```
import type {ExtendsStrict} from 'type-fest';

type T1 = ExtendsStrict<number | string, string>;
//=> false

type T2 = ExtendsStrict<string, number | string>;
//=> true

type T3 = ExtendsStrict<string, string>;
//=> true

type T4 = ExtendsStrict<never, never>;
//=> true

type T5 = ExtendsStrict<never, number>;
//=> false
```

@category Improved Built-in
*/
export type ExtendsStrict<Left, Right> =
	IsAny<Left | Right> extends true
		? true
		: IsNever<Left> extends true
			? IsNever<Right>
			: [Left] extends [Right]
				? true
				: false;
