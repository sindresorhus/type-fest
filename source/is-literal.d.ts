import type {Primitive} from './primitive.d.ts';
import type {_Numeric} from './numeric.d.ts';
import type {CollapseLiterals, IfNotAnyOrNever, IsNotFalse, IsPrimitive} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {TagContainer, UnwrapTagged} from './tagged.d.ts';

/**
Returns a boolean for whether the given type `T` is the specified `LiteralType`.

@link https://stackoverflow.com/a/52806744/10292952

@example
```
LiteralCheck<1, number>
//=> true

LiteralCheck<number, number>
//=> false

LiteralCheck<1, string>
//=> false
```
*/
type LiteralCheck<T, LiteralType extends Primitive> = (
	IsNever<T> extends false // Must be wider than `never`
		? [T] extends [LiteralType & infer U] // Remove any branding
			? [U] extends [LiteralType] // Must be narrower than `LiteralType`
				? [LiteralType] extends [U] // Cannot be wider than `LiteralType`
					? false
					: true
				: false
			: false
		: false
);

/**
Returns a boolean for whether the given type `T` is one of the specified literal types in `LiteralUnionType`.

@example
```
LiteralChecks<1, Numeric>
//=> true

LiteralChecks<1n, Numeric>
//=> true

LiteralChecks<bigint, Numeric>
//=> false
```
*/
type LiteralChecks<T, LiteralUnionType> = (
	// Conditional type to force union distribution.
	// If `T` is none of the literal types in the union `LiteralUnionType`, then `LiteralCheck<T, LiteralType>` will evaluate to `false` for the whole union.
	// If `T` is one of the literal types in the union, it will evaluate to `boolean` (i.e. `true | false`)
	IsNotFalse<LiteralUnionType extends Primitive
		? LiteralCheck<T, LiteralUnionType>
		: never
	>
);

/**
Returns a boolean for whether the given type is a `string` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed string manipulation functions
	- constraining strings to be a string literal
	- type utilities, such as when constructing parsers and ASTs

The implementation of this type is inspired by the trick mentioned in this [StackOverflow answer](https://stackoverflow.com/a/68261113/420747).

@example
```
import type {IsStringLiteral} from 'type-fest';

type CapitalizedString<T extends string> = IsStringLiteral<T> extends true ? Capitalize<T> : string;

// https://github.com/yankeeinlondon/native-dash/blob/master/src/capitalize.ts
function capitalize<T extends Readonly<string>>(input: T): CapitalizedString<T> {
	return (input.slice(0, 1).toUpperCase() + input.slice(1)) as CapitalizedString<T>;
}

const output = capitalize('hello, world!');
//=> 'Hello, world!'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4GUZTAB2A5gDLAwpQCGANgL5wBmUEIcA5EqgLTMpsMTgG4AUGJ5oAwjTCV6wAF4oAJvkKkAPABU4KAB5Uiq7HCGaSAPjgBeODg3FylavV03Dx0wigBXNAB+OFl5GEUVDzgALnMCZ3ExAHokuAALGBgwbGiUkko0vwAjADoAY3YkxBoiAGsUFGI6CBMWpKIaGGAANxReVRpsNKSi5qKkkEGqKCTsKDKksrkFOmUUEphsMWY-IjKulrglsIiUXX0jFBMzACUUGlUWukQtC2crKwAKYjA-GFidABKWKhFZrdTxbQ6GzoMQASCgKBgfigRDg3yIvxgJWwqzKKE+AAYADRwACMgI2EAAqmBUFBZNgCYC4ABqOA-P44vEEikswYhZbhVYqCGWDziBgSCpEIRwCB-LF2I5C06fThpFB0ZqkgDu0DoqgAhJxAeIUrYbJwABJanVwfVQQ0moA)

@example
```
// String types with infinite set of possible values return `false`.

import type {IsStringLiteral} from 'type-fest';

type AllUppercaseStrings = IsStringLiteral<Uppercase<string>>;
//=> false

type StringsStartingWithOn = IsStringLiteral<`on${string}`>;
//=> false

// This behaviour is particularly useful in string manipulation utilities, as infinite string types often require separate handling.

type Length<S extends string, Counter extends never[] = []> =
	IsStringLiteral<S> extends false
		? number // return `number` for infinite string types
		: S extends `${string}${infer Tail}`
			? Length<Tail, [...Counter, never]>
			: Counter['length'];

type L1 = Length<Lowercase<string>>;
//=> number

type L2 = Length<`${number}`>;
//=> number
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/PTAEGUBcCcEsDsDmpIE8AOBTAzqA7rJABagIBmChmo2mkoA9maOg9trAEYA21AbgENuAVxyhodYdHigABmSG1ZAOgBQq2AFtW0emiygA3gElsUOEgAyVaEIC+oMtAabQAcn2YAtGRyQ3ANzqnqAAgtzcAKroWNAAxgK05giIuAC8oKbJVjZCADzRsQm0edgwKQB8FUEgaRWOipjBGNTZqVACuikA6oREAPIyGVnlOZCYttx5sgzwACSGZRaIdrLVqrX1Cty06iCgACpEsLicmEQCfLAMUqS46J2QsHHC3J3cqKDCtGSvpDJLFKgTQCeCwdCvARPWZfJ7cQiwHAAGlAiX+FDB4xoo2QnlwTHGMgkAEdhLAJDRMA9bFiLvAACbwpBqVQhSyYJDEPLgUCYAAehPpuEBSBRAGEbvBxtBeQKOULQPBMHwJgBtAC6oAyGvqaVUAEgRstrNL8uB6vzBbhtrt9fqAPyK4SaM4y-YSSBSGSyeDO12yRwMGXkShYkW4lrYA36gBcEFlVrkC3DdgW5AmhwEsG4q2jDtA7M5RDyByz3BRquUVYlwilExRSpV0HVFTzcZrdegqrcvCLbnVQVZLQLAEYtQWOYguZYGHgJsVMKUcVUasA6k6XRNmgZLAAmceFqfF2QLX2b6CrdabDeuoA)

@category Type Guard
@category Utilities
*/
export type IsStringLiteral<S> = IfNotAnyOrNever<S,
	_IsStringLiteral<CollapseLiterals<S extends TagContainer<any> ? UnwrapTagged<S> : S>>,
	false, false>;

export type _IsStringLiteral<S> =
// If `T` is an infinite string type (e.g., `on${string}`), `Record<T, never>` produces an index signature,
// and since `{}` extends index signatures, the result becomes `false`.
S extends string
	? {} extends Record<S, never>
		? false
		: true
	: false;

/**
Returns a boolean for whether the given type is a `number` or `bigint` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsNumericLiteral, IsStringLiteral} from 'type-fest';

// https://github.com/inocan-group/inferred-types/blob/master/modules/types/src/boolean-logic/operators/EndsWith.ts
type EndsWith<TValue, TEndsWith extends string> =
	TValue extends string
		? IsStringLiteral<TEndsWith> extends true
			? IsStringLiteral<TValue> extends true
				? TValue extends `${string}${TEndsWith}`
					? true
					: false
				: boolean
			: boolean
		: TValue extends number
			? IsNumericLiteral<TValue> extends true
				? EndsWith<`${TValue}`, TEndsWith>
				: false
			: false;

function endsWith<Input extends string | number, End extends string>(input: Input, end: End) {
	return `${input}`.endsWith(end) as EndsWith<Input, End>;
}

endsWith('abc', 'c');
//=> true

endsWith(123456, '456');
//=> true

const end = '123' as string;

endsWith('abc123', end);
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4DkCuIKUwAxgDLAzECGANgDRw4DKMJAdgOaXVT0BfOADMoEEHADkSVAFphKbDEkBuAFBqA9JrgALGDDDYAXNq5Vd+AEYA6UuM3AOEUjQ6yuY-GEccFUKBQAE1kZRU0rOggrTRAaJWJYiCD8OnCw7E1sKFIIiAg0t1ko81yIVH4YaEyAUQ4g7AB1CxsYbDUwuDqG5phdAB4AFQA1enwUJkHupos4FAAPanrsOCVOLgA+OABeNQBIEbG0BaWG1fYnLn29gH5mbDZ13lo6Iene3S2TlGWEKHHrrd7o9Ls9+K9DnRxl9Fj8zuwAXskUDIeM5rDfgADAAk6DWlwEuKmyw+AkxgKRdwRKApe2MIno2BpyLpcCs+UKHEB9PZBRQbmu9NRxwxZw4hCsxEBdxwBCIJAoVBeQ1GUJQMNOK2pFLu7ws-Rx6GFZMmer6Gwp9OEjOZSKtNvUamE+A4pBgwAgHDmJP1mA4YHw8G+v3x3DgAB84OKQJKoExuujNed1hsABROAMwel+zNMOH07oASgw+0CMHwUC9hozgbJNjhMz6qbhxfiXR9fX6OcD8fqG3UAg0DY+qckNCspEkTEkk8L6m02y22rUw4sqYAjAAmADMABYAKwANmnB8PkjnWk0i7+ALU9g4Sm9QR2Ui328kcDboa4jtXTbHE5vlOT4XguWy8pyQA)

@category Type Guard
@category Utilities
*/
export type IsNumericLiteral<T> = LiteralChecks<T, _Numeric>;

/**
Returns a boolean for whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsBooleanLiteral} from 'type-fest';

const id = 123;

type GetId<AsString extends boolean> =
	IsBooleanLiteral<AsString> extends true
		? AsString extends true
			? `${typeof id}`
			: typeof id
		: number | string;

function getId<AsString extends boolean = false>(options?: {asString: AsString}) {
	return (options?.asString ? `${id}` : id) as GetId<AsString>;
}

const numberId = getId();
//=> 123

const stringId = getId({asString: true});
//=> '123'

declare const runtimeBoolean: boolean;
const eitherId = getId({asString: runtimeBoolean});
//=> number | string
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4CEIQA2KAhgHYAywMKUJhAvnAGZQQhwDkSqAtMymwxOAbgBQYgMYQyQuMAAmcALxwAjACYAzOLE80AcRQxMCgDwBBbAGUYUYGQDmcFAA8aZBdjgAjAsXIAPhUxAEgcfCJSSmpaeksbOwdHYLcPLwQoAFcUMNCAfjgrW3snF3cUT287HLyCuAADABJ0fQhmeQUGBrqALgRkFHbOvP6yLJAfWjgAHzghUsddZiyySRhgGThHY1MEkuTy9O8-KPIVFnpsFECACggwDZlsfP70EkTF-uKkpwYASgwYSgxiyUDIcHuj02snyADoPgcyoVmuhFN04P1FICPnAjCZzD9FoFxAwJNJZPBxpNaKYLjsCbd-uIAPQs5TBTRacnPeALZJ01QM0y3d6fZL9GooAGs9nBThczgSBQoSSEEgguAUuTZMgbEAoSIBMj9U7G8Ta+AoagAC1pSiFuwUosRv0c-V1+sN-miMrEbI5cGpUygs3mbqAA)

@category Type Guard
@category Utilities
*/
export type IsBooleanLiteral<T> = LiteralCheck<T, boolean>;

/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsSymbolLiteral} from 'type-fest';

type Get<Obj extends Record<symbol, number>, Key extends keyof Obj> =
	IsSymbolLiteral<Key> extends true
		? Obj[Key]
		: number;

function get<Obj extends Record<symbol, number>, Key extends keyof Obj>(o: Obj, key: Key) {
	return o[key] as Get<Obj, Key>;
}

const symbolLiteral = Symbol('literal');
const symbolValue: symbol = Symbol('value');

get({[symbolLiteral]: 1} as const, symbolLiteral);
//=> 1

get({[symbolValue]: 1} as const, symbolValue);
//=> number
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4GVEgBGEANgDLAwpQCGJAvnAGZQQhwDkSqAtEythgcA3AChR3NAHEUMADwB5QgCs4KAB5UAdgBNscAEooAxtB1zsBYiQA0cLQFci1AHx2A0ikRrNKXfoBrLwgmOCVlFzgAXlEASBx8IlIKKloSOU9ESI1tPQQoBxQ42IB+MJUAbUyAXWKALnsnQmoxUSYHLWMYYAgtOABzWUUVH1z9I1Moc0sk20bnKDc4TNG-PKDEEPKIgAoIBvC7DYbMgEoMOKhZByg+iAqN6rgafRl5Q+WvFzF6cVMtQRwGbWFLUOjROCJaw7DgkShgkgcU5if6A4GkABqdEKDXRJAhUNIMIAbtiUEjWoMYDt0BU8aC0tUGgBGRgvOComB2enwtLI0QAegFUUizPEVJpdKsmLJTLgrOe+k53OlJCxJEK-KFIvmzSgQA)

@category Type Guard
@category Utilities
*/
export type IsSymbolLiteral<T> = LiteralCheck<T, symbol>;

/** Helper type for `IsLiteral`. */
type IsLiteralUnion<T> =
	| IsStringLiteral<T>
	| IsNumericLiteral<T>
	| IsBooleanLiteral<T>
	| IsSymbolLiteral<T>;

/**
Returns a boolean for whether the given type is a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsLiteral} from 'type-fest';

type A = IsLiteral<1>;
//=> true

type B = IsLiteral<number>;
//=> false

type C = IsLiteral<1n>;
//=> true

type D = IsLiteral<bigint>;
//=> false

type E = IsLiteral<'type-fest'>;
//=> true

type F = IsLiteral<string>;
//=> false

type G = IsLiteral<`on${string}`>;
//=> false

declare const symbolLiteral: unique symbol;
type H = IsLiteral<typeof symbolLiteral>;
//=> true

type I = IsLiteral<symbol>;
//=> false

type J = IsLiteral<true>;
//=> true

type K = IsLiteral<boolean>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4BlgwpQCGANgL5wBmUEIcA5EqgLRUrYwMDcAUL8zQBBOAF44OfIRKkAPAEYAfHwD0K0YoRQArin6C4AITES8BImVkA7bSABGRZbzUbqZbHoHI0AYROTzGQUrJxdNGB1PAwARfzNpSztgAHNgKxhQ9U0qdyjvOABROKkLOSZvNg4uTNcI3X18gDFiwMtOKDTkmuzchtQ4AHEWhLkAAwgrABJ0ds7yUe63Ug9+ABMUAGNSYig0DYnOOGxEewhSEpkALjhtK2AAR10jk7szvgMACWHS2UEIKmep3OrVIizqeX6mG+QWOQMWOWWELQACloZZwWDIn00ABpNFyV5nFDEEKqLJLDxAA)

@category Type Guard
@category Utilities
*/
export type IsLiteral<T> =
	IsPrimitive<T> extends true
		? IsNotFalse<IsLiteralUnion<T>>
		: false;

export {};
