/**
Join an array of strings and/or numbers using the given string as delimiter.

Use-case: Defining key paths in a nested object. For example, for dot-notation fields in MongoDB queries.

@example
```
import {Join} from 'type-fest';

const path: Join<['foo', '0', 'baz'], '.'> = ['foo', '0', 'baz'].join('.');
```

@category Template Literals
*/
export type Join<
	Strings extends (string | number)[],
	Delimiter extends string,
> = Strings extends [] ? '' :
	Strings extends [string | number] ? `${Strings[0]}` :
	// @ts-expect-error `Rest` is inferred as `unknown` here: https://github.com/microsoft/TypeScript/issues/45281
	Strings extends [string | number, ...infer Rest] ? `${Strings[0]}${Delimiter}${Join<Rest, Delimiter>}` :
	string | number;
