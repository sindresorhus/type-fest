import type {IsArrayOfUnknownLength, NonRecursiveType} from './internal/index.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {LiteralToPrimitive} from './literal-to-primitive.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {Primitive} from './primitive.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Like `LiteralToPrimitive` except it converts literal types inside an object or array deeply.

For example, given a constant object, it returns a new object type with the same keys but with all the values converted to primitives.

@see {@link LiteralToPrimitive}

Use-case: Deal with data that is imported from a JSON file.

Note: A type that recurses only through a tuple, such as `type List = null | readonly [string, List]`, hits the instantiation depth limit, because a tuple is converted element by element. Recursion through an object property or an array of unknown length, such as `JsonValue`, is fine.

@example
```
import type {LiteralToPrimitiveDeep} from 'type-fest';

const config = {
	appName: 'MyApp',
	version: '1.0.0',
	maxRetries: 3,
	enableLogging: true,
	apiUrl: 'https://api.myapp.com/v1',
} as const;

declare function updateConfig(newConfig: typeof config): void;

updateConfig({
	// @ts-expect-error
	appName: 'MyUpdatedApp',
	// Error: Type '"MyUpdatedApp"' is not assignable to type '"MyApp"'.

	// @ts-expect-error
	version: '2.0.0',
	// Error: Type '"2.0.0"' is not assignable to type '"1.0.0"'.

	// @ts-expect-error
	maxRetries: 1,
	// Error: Type '1' is not assignable to type '3'.

	// @ts-expect-error
	enableLogging: false,
	// Error: Type 'false' is not assignable to type 'true'.

	// @ts-expect-error
	apiUrl: 'https://api.myapp.com/v2',
	// Error: Type '"https://api.myapp.com/v2"' is not assignable to type '"https://api.myapp.com/v1"'.
});

declare function updateConfigFixed(newConfig: LiteralToPrimitiveDeep<typeof config>): void;

updateConfigFixed({
	appName: 'MyUpdatedApp',
	version: '2.0.0',
	maxRetries: 1,
	enableLogging: false,
	apiUrl: 'https://api.myapp.com/v2',
});
```

@category Type
@category Object
*/
export type LiteralToPrimitiveDeep<T> =
	// `undefined` and `null` are handed back as is rather than through `LiteralToPrimitive`. For an optional key, the `undefined` that its `?` contributes then stays the one TypeScript removes from the result, instead of becoming a new `undefined` that it keeps.
	T extends null | undefined
		? T
		// `unknown` and `any` are not literals, so there is nothing to convert. Checked per union member, because a union such as `'x' | {} | null | undefined` is as wide as `unknown` as a whole.
		: unknown extends T
			? T
			// A branded or tagged primitive is still a primitive, so it is collapsed before the object branches, which would otherwise map over the string methods.
			: T extends Primitive
				? LiteralToPrimitive<T>
				// `void`, functions, class constructors and the other single-value built-ins are kept as is.
				: T extends NonRecursiveType
					? T
					// `object` is not a literal either, and mapping over it would turn it into `{}`, which accepts a string.
					: IsEqual<T, object> extends true
						? T
						: T extends UnknownArray
							? IsArrayOfUnknownLength<T> extends false
								// A homomorphic mapped type keeps the length, the optional elements, the rest element and `readonly`, without a recursion step per element.
								? {[Key in keyof T]: LiteralToPrimitiveDeep<T[Key]>}
								// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
								: T extends unknown[]
									? Array<LiteralToPrimitiveDeep<T[number]>>
									: ReadonlyArray<LiteralToPrimitiveDeep<T[number]>>
							: T extends Map<infer KeyType, infer ValueType>
								? Map<LiteralToPrimitiveDeep<KeyType>, LiteralToPrimitiveDeep<ValueType>>
								: T extends ReadonlyMap<infer KeyType, infer ValueType>
									? ReadonlyMap<LiteralToPrimitiveDeep<KeyType>, LiteralToPrimitiveDeep<ValueType>>
									: T extends Set<infer ItemType>
										? Set<LiteralToPrimitiveDeep<ItemType>>
										: T extends ReadonlySet<infer ItemType>
											? ReadonlySet<LiteralToPrimitiveDeep<ItemType>>
											// A weak collection is kept as is, because its key must be a weak reference. It is matched after `Map` and `Set`, because a `Map` or `Set` of objects is assignable to it.
											: T extends WeakMap<WeakKey, unknown> | WeakSet<WeakKey>
												? T
												// The named keys and the index signature are mapped separately, because mapping `keyof T` in one go widens a named key to the signature's value type.
												: Simplify<
													{[Key in keyof OmitIndexSignature<T>]: LiteralToPrimitiveDeep<OmitIndexSignature<T>[Key]>}
													& {[Key in keyof PickIndexSignature<T>]: LiteralToPrimitiveDeep<PickIndexSignature<T>[Key]>}
												>;

export {};
