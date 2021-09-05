/**
Join an array of strings using the given string as delimiter.

Use-case: Defining key paths in a nested object. For example, for dot-notation fields in MongoDB queries.

@example
```
import {Join} from 'type-fest';

const path: Join<['foo', 'bar', 'baz'], '.'> = ['foo', 'bar', 'baz'].join('.');
```

@category Template Literals
*/
export type Join<
	Strings extends string[],
	Delimiter extends string,
> = Strings extends [] ? '' :
	Strings extends [string] ? `${Strings[0]}` :
	// @ts-expect-error `Rest` is inferred as `unknown` here: https://github.com/microsoft/TypeScript/issues/45281
	Strings extends [string, ...infer Rest] ? `${Strings[0]}${Delimiter}${Join<Rest, Delimiter>}` :
	string;
