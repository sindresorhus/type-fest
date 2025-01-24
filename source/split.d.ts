import type {IsBooleanLiteral, IsStringLiteral} from './is-literal';
import type {IsAssignableToTemplateLiteral} from './internal';

/**
Represents an array of strings split using a given character or character set.

`Delimiter` needs to be a string literal or its union.
If the source string `S` is a non-literal type like `string` or `Uppercase<string>`, the return type will be `string[]`.
If `S` contains [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) with non-literal types interpolated, this generics behaves in two ways:

- If `Options['strictLiteralChecks']` is **true**, the return type will be `string[]`.
- If `Options['strictLiteralChecks']` is **false**, the return type will be an array of strings split leaving the interpolated parts as they are.

`Options['strictLiteralChecks']` should be a boolean literal and its default value is **false**.

Use-case: Defining the return type of a method like `String.prototype.split`.

@example
```
import type {Split} from 'type-fest';

declare function split<S extends string, D extends string>(string: S, separator: D): Split<S, D>;

type Item = 'foo' | 'bar' | 'baz' | 'waldo';
const items = 'foo,bar,baz,waldo';
let array: Item[];

array = split(items, ',');
```

@category String
@category Template literal
*/
export type Split<
	S extends string,
	Delimiter extends string,
	Options extends {strictLiteralChecks: boolean} = {strictLiteralChecks: false},
> = IsBooleanLiteral<Options['strictLiteralChecks']> extends true
	? SplitHelper<S, Delimiter, Options>
	: never;

type SplitHelper<
	S extends string,
	_Delimiter extends string,
	Options extends {strictLiteralChecks: boolean},
	Accumulator extends string[] = [],
> = (
	Options['strictLiteralChecks'] extends true
		? IsStringLiteral<S>
		: IsAssignableToTemplateLiteral<S>
) extends true
	? IsStringLiteral<_Delimiter> extends true
		? _Delimiter extends infer Delimiter extends string
			? S extends `${infer Head}${Delimiter}${infer Tail}`
				? SplitHelper<Tail, Delimiter, Options, [...Accumulator, Head]>
				: Delimiter extends ''
					? Accumulator
					: [...Accumulator, S]
			: never
		: string[]
	: string[];
