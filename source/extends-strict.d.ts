import type {IsNever} from './is-never.d.ts';

/**
A stricter version of `extends` that Checks Stricily if one type extends another without distribution.

Note: this is not quite the same as `Left extends Right` because:

1. Types are wrapped in a 1-tuple so that union types are not distributed - instead we consider `string | number` to _not_ extend `number`. If we used `Left extends Right` directly you would get `Extends<string | number, number>` => `false | true` => `boolean`. So it's return `true` if `[Left] extends [Right]`.

2. Return's `true` if `Left` and `Right` are both `never`.

@example
```
type T = ExtendsStrict<number | string, string>
//=> false

type T = ExtendsStrict<string, number | string>
//=> true

type T = ExtendsStrict<string, string>
//=> true

type T = ExtendsStrict<never, never>
//=> true
```

@category Improved Built-in
*/
export type ExtendsStrict<Left, Right> =
	IsNever<Left> extends true
		? IsNever<Right>
		: [Left] extends [Right]
			? true
			: false;
