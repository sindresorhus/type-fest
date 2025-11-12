/**
Omit any index signatures from the given object type, leaving only explicitly defined properties.

This is the counterpart of `PickIndexSignature`.

Use-cases:
- Remove overly permissive signatures from third-party types.

This type was taken from this [StackOverflow answer](https://stackoverflow.com/a/68261113/420747).

It relies on the fact that an empty object (`{}`) is assignable to an object with just an index signature, like `Record<string, unknown>`, but not to an object with explicitly defined keys, like `Record<'foo' | 'bar', unknown>`.

(The actual value type, `unknown`, is irrelevant and could be any type. Only the key type matters.)

```
const indexed: Record<string, unknown> = {}; // Allowed

// @ts-expect-error
const keyed: Record<'foo', unknown> = {}; // Error
// => TS2739: Type '{}' is missing the following properties from type 'Record<"foo" | "bar", unknown>': foo, bar
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/MYewdgzgLgBAlmAJgUwB7MQLhgJWaAJ0QB5oCEBzAGhgFcwBrMEAdzAD4YBeGAbwF8A3DAD0ImAEEANlNYYAUPLEwAAlAgBaNAAd8ULQQIgC80JFgNkATwzY8hEgHIAZiBCOa9Jqw7c+Q0XEAUUNjJXEuTgAVAGUAJgB2AGYATmwoq10YRwFHeAgYAFs4CAhKGCgAC2QYVxlWcu0jXQIoOGQC5yNCisyax3tjEgAiVxBhmAAfGGGAIwBDAmHPRmY2dkdsMZoFgiA)

Instead of causing a type error like the above, you can also use a [conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) to test whether a type is assignable to another:

```
type Indexed = {} extends Record<string, unknown>
	? '✅ `{}` is assignable to `Record<string, unknown>`'
	: '❌ `{}` is NOT assignable to `Record<string, unknown>`';
// => '✅ `{}` is assignable to `Record<string, unknown>`'

type Keyed = {} extends Record<'foo' | 'bar', unknown>
	? "✅ `{}` is assignable to `Record<'foo' | 'bar', unknown>`"
	: "❌ `{}` is NOT assignable to `Record<'foo' | 'bar', unknown>`";
// => "❌ `{}` is NOT assignable to `Record<'foo' | 'bar', unknown>`"
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/C4TwDgpgBAkgdgEwgDwgqBeKBvAvlFYCRAZygCUIBjAewCcEAeE4OgSzgHMAaKAVzgBrODQDucAHwAoAJAB+KAHJAoORQABnjVQ2ZAIYkSbTnF0AjADbRgNdZVoNmrDj35CR4iWsWyAXEsAy5Oqa2mQAcgDyACpQ+obGZpZQ1rbU9Ews7Fy8AsJikl4A3FIA9MWYEkqqGrhaOjEGRiYWVjZqdmmOmS457vneUqCQUADSECBomDj4hMQIZO0OigBmNDSKUAA+Sqa6dIrZbnnS8lAARFXBdbGNCS0p9kzLq+tbijt7B7keaqe+Z4HVWphKL1OJNRLJNqpRYrNabba7fauL75U5FUrlf5BGohKARaLXeLNJKtBaPWEvBEfZG9TynIA)

Using a [mapped type](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#further-exploration), you can then check for each `KeyType` of `ObjectType`...

```
type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType // Map each key of `ObjectType`...
	]: ObjectType[KeyType]; // ...to its original value, i.e. `OmitIndexSignature<Foo> == Foo`.
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/C4TwDgpgBA8gtgS2ASQHYBMIA8DKCDmqAhsAK4BOEAPDAEYBWEAxsACrgQB8UAvFAN4AoAJABtANIQQ7SFASooAaykB7AGawGzNhygB6PVACyRMFAhEmACyVSo6qAAM6jFjIiOAdN5EBdAFyarjqQElLuvgDc+obensAqcsAAzvbkBPJEADZQAG7ZpBAANHKeEJ5O8EhomLgExGSUVABiKircPHytKl6CAL6RQA)

...whether an empty object (`{}`) would be assignable to an object with that `KeyType` (`Record<KeyType, unknown>`)...

```
type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType
		// Is `{}` assignable to `Record<KeyType, unknown>`?
		as {} extends Record<KeyType, unknown>
			? never // ✅ `{}` is assignable to `Record<KeyType, unknown>`
			: KeyType // ❌ `{}` is NOT assignable to `Record<KeyType, unknown>`
	]: ObjectType[KeyType];
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/C4TwDgpgBA8gtgS2ASQHYBMIA8DKCDmqAhsAK4BOEAPDAEYBWEAxsACrgQB8UAvFAN4AoAJABtANIQQ7SFASooAaykB7AGawGzNhxHCA9PqjIAzlAAG-AL7moREyYLFaAG2jAVFgErMV5dFSS0hwANFCkqIqoKgDuqJzmAPx69gJWUNjAEBhmPkx+AUEyEGERUbHxesKJUKgQAG4Q5FCGUICg5BbWtghm9o6ERK7unuZ5BYFSxaWR0XEJVQBcUEUcLUaAMuSdNnJmAHIwrHYOToNuUB7evv4TwZDT5XPmIgC6S3SMLMUSkxzPANyCKx-IA)

If `{}` is assignable, it means that `KeyType` is an index signature and we want to remove it. If it is not assignable, `KeyType` is a "real" key and we want to keep it.

@example
```
import type {OmitIndexSignature} from 'type-fest';

interface Example {
	// These index signatures will be removed.
	[x: string]: any
	[x: number]: any
	[x: symbol]: any
	[x: `head-${string}`]: string
	[x: `${string}-tail`]: string
	[x: `head-${string}-tail`]: string
	[x: `${bigint}`]: string
	[x: `embedded-${number}`]: string

	// These explicitly defined keys will remain.
	foo: 'bar';
	qux?: 'baz';
}

type ExampleWithoutIndexSignatures = OmitIndexSignature<Example>;
// => { foo: 'bar'; qux?: 'baz' | undefined; }
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3geRMGBJAOwBMUAPAZWAHMCBDGAVyhQF84AzKCEOAciVQBadigDOMXgG4AUNOAEYKKO1oBjNAFFStcABs06aQEgA9CbgAVABZi08kqTijqdRs1FwA7sF264AIzRmEAgANxQiADpjAG1SAC4nGCh5KgBdRNoCRFiEuAIGEECoDLgsnKM4xNFEIohdUvLcxIADG1oiQQASdHEUgioWFtK+1Oa4Fp7RgZZBGFofYerkscq8tpQO7t6VmbmF3SWk-qpxyfR-ankYIZHd07XWlCKIkk6egpeoW+WT2VNzNZbHAyGBdMBVLhdIg4CR2PIInAANYoRAeby+ODBBYEaJGdgQCCJXj+WhQKTGACODFIAH5iaSAF4UliyASabR6FAAdVwVggDHwxDIlBo9CYYjgAF44NhcIQHKLXBKADxaHRglAAPhkZmlWowHEJDLJUjg1LpJuZcAAPnAGML4QQIpI4CwgA)

@see {@link PickIndexSignature}
@category Object
*/
export type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
		? never
		: KeyType]: ObjectType[KeyType];
};

export {};
