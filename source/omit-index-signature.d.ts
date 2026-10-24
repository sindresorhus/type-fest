import type {PickIndexSignature} from './pick-index-signature.d.ts'; // For `@link`

/**
Omit any index signatures from the given object type, leaving only explicitly defined properties.

This is the counterpart of `PickIndexSignature`.

Use-cases:
- Remove overly permissive signatures from third-party types.

This type was taken from this [StackOverflow answer](https://stackoverflow.com/a/68261113/420747).

It relies on the fact that an empty object (`{}`) is assignable to an object with just an index signature, like `Record<string, never>`, but not to an object with explicitly defined keys, like `Record<'foo' | 'bar', never>`.

The `never` value type prevents inherited `Object.prototype` members, such as `toString`, from satisfying an explicitly defined key.

```
const indexed: Record<string, never> = {}; // Allowed

// @ts-expect-error
const keyed: Record<'foo' | 'bar', never> = {}; // Error
// TS2739: Type '{}' is missing the following properties from type 'Record<"foo" | "bar", never>': foo, bar
```

Instead of causing a type error like the above, you can also use a [conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) to test whether a type is assignable to another:

```
type Indexed = {} extends Record<string, never>
	? '✅ `{}` is assignable to `Record<string, never>`'
	: '❌ `{}` is NOT assignable to `Record<string, never>`';

type IndexedResult = Indexed;
//=> '✅ `{}` is assignable to `Record<string, never>`'

type Keyed = {} extends Record<'foo' | 'bar', never>
	? '✅ `{}` is assignable to `Record<\'foo\' | \'bar\', never>`'
	: '❌ `{}` is NOT assignable to `Record<\'foo\' | \'bar\', never>`';

type KeyedResult = Keyed;
//=> '❌ `{}` is NOT assignable to `Record<\'foo\' | \'bar\', never>`'
```

Using a [mapped type](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#further-exploration), you can then check for each `KeyType` of `ObjectType`...

```
type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType // Map each key of `ObjectType`...
	]: ObjectType[KeyType]; // ...to its original value, i.e. `OmitIndexSignature<Foo> == Foo`.
};
```

...whether an empty object (`{}`) would be assignable to an object with that `KeyType` (`Record<KeyType, never>`)...

```
type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType
	// Is `{}` assignable to `Record<KeyType, never>`?
	as {} extends Record<KeyType, never>
		? never // ✅ `{}` is assignable to `Record<KeyType, never>`
		: KeyType // ❌ `{}` is NOT assignable to `Record<KeyType, never>`
	]: ObjectType[KeyType];
};
```

If `{}` is assignable, it means that `KeyType` is an index signature and we want to remove it. If it is not assignable, `KeyType` is a "real" key and we want to keep it.

@example
```
import type {OmitIndexSignature} from 'type-fest';

type Example = {
	// These index signatures will be removed.
	[x: string]: any;
	[x: number]: any;
	[x: symbol]: any;
	[x: `head-${string}`]: string;
	[x: `${string}-tail`]: string;
	[x: `head-${string}-tail`]: string;
	[x: `${bigint}`]: string;
	[x: `embedded-${number}`]: string;

	// These explicitly defined keys will remain.
	foo: 'bar';
	qux?: 'baz';
};

type ExampleWithoutIndexSignatures = OmitIndexSignature<Example>;
//=> {foo: 'bar'; qux?: 'baz'}
```

@see {@link PickIndexSignature}
@category Object
*/
export type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, never>
		? never
		: KeyType]: ObjectType[KeyType];
};

export {};
