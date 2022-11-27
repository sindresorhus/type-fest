import type {JsonPrimitive, JsonValue} from './basic';
import type {EmptyObject} from './empty-object';
import type {IsAny} from './internal';
import type {NegativeInfinity, PositiveInfinity} from './numeric';
import type {Simplify} from './simplify';
import type {TypedArray} from './typed-array';

// Note: The return value has to be `any` and not `unknown` so it can match `void`.
type NotJsonable = ((...args: any[]) => any) | undefined | symbol;

type JsonifyTuple<T extends [unknown, ...unknown[]]> = {
	[Key in keyof T]: T[Key] extends NotJsonable ? null : Jsonify<T[Key]>;
};

type FilterJsonableKeys<T extends object> = {
	[Key in keyof T]: T[Key] extends NotJsonable ? never : Key;
}[keyof T];

type JsonifyObject<T extends object> = {
	[Key in keyof Pick<T, FilterJsonableKeys<T>>]: Jsonify<T[Key]>;
};

// Returns never if the key or property is not jsonable without testing whether the property is required or optional otherwise return the key.
type BaseKeyFilter<Type, Key extends keyof Type> = Key extends symbol
	? never
	: Type[Key] extends symbol
		? never
		: [(...args: any[]) => any] extends [Type[Key]]
			? never
			: Key;

/**
Returns the required keys.
 */
type FilterDefinedKeys<T extends object> = Exclude<
{
	[Key in keyof T]: IsAny<T[Key]> extends true
		? Key
		: undefined extends T[Key]
			? never
			: T[Key] extends undefined
				? never
				: BaseKeyFilter<T, Key>;
}[keyof T],
undefined
>;

/**
Returns the optional keys.
*/
type FilterOptionalKeys<T extends object> = Exclude<
{
	[Key in keyof T]: IsAny<T[Key]> extends true
		? never
		: undefined extends T[Key]
			? T[Key] extends undefined
				? never
				: BaseKeyFilter<T, Key>
			: never;
}[keyof T],
undefined
>;

/**
For an object T, if it has any properties that are a union with `undefined`,
make those into optional properties instead.

@example
```
type User = {
	firstName: string;
	lastName: string | undefined;
}

type OptionalizedUser = UndefinedToOptional<User>
// => {
// 	firstName: string;
// 	lastName?: string;
// }
```
 */
type UndefinedToOptional<T extends object> = Simplify<
{
	// Property is not a union with `undefined`, keep as-is
	[Key in keyof Pick<T, FilterDefinedKeys<T>>]: T[Key];
} & {
	// Property _is_ a union with `defined`. Set as optional (via `?`) and remove `undefined` from the union
	[Key in keyof Pick<T, FilterOptionalKeys<T>>]?: Exclude<T[Key], undefined>;
}
>;

/**
Transform a type to one that is assignable to the `JsonValue` type.

This includes:
1. Transforming JSON `interface` to a `type` that is assignable to `JsonValue`.
2. Transforming non-JSON value that is *jsonable* to a type that is assignable to `JsonValue`, where *jsonable* means the non-JSON value implements the `.toJSON()` method that returns a value that is assignable to `JsonValue`.

@remarks

An interface cannot be structurally compared to `JsonValue` because an interface can be re-opened to add properties that may not be satisfy `JsonValue`.

@example
```
import type {Jsonify} from 'type-fest';

interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1]
};

const problemFn = (data: JsonValue) => {
	// Does something with data
};

problemFn(point); // Error: type Geometry is not assignable to parameter of type JsonValue because it is an interface

const fixedFn = <T>(data: Jsonify<T>) => {
	// Does something with data
};

fixedFn(point); // Good: point is assignable. Jsonify<T> transforms Geometry into value assignable to JsonValue
fixedFn(new Date()); // Error: As expected, Date is not assignable. Jsonify<T> cannot transforms Date into value assignable to JsonValue
```

Non-JSON values such as `Date` implement `.toJSON()`, so they can be transformed to a value assignable to `JsonValue`:

@example
```
import type {Jsonify} from 'type-fest';

const time = {
	timeValue: new Date()
};

// `Jsonify<typeof time>` is equivalent to `{timeValue: string}`
const timeJson = JSON.parse(JSON.stringify(time)) as Jsonify<typeof time>;
```

@link https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-710744173

@category JSON
*/
export type Jsonify<T> = IsAny<T> extends true
	? any
	: T extends PositiveInfinity | NegativeInfinity
		? null
		: T extends JsonPrimitive
			? T
			: // Instanced primitives are objects
			T extends Number
				? number
				: T extends String
					? string
					: T extends Boolean
						? boolean
						: T extends Map<any, any> | Set<any>
							? EmptyObject
							: T extends TypedArray
								? Record<string, number>
								: T extends NotJsonable
									? never // Non-JSONable type union was found not empty
									: // Any object with toJSON is special case
									T extends {toJSON(): infer J}
										? (() => J) extends () => JsonValue // Is J assignable to JsonValue?
											? J // Then T is Jsonable and its Jsonable value is J
											: Jsonify<J> // Maybe if we look a level deeper we'll find a JsonValue
										: T extends []
											? []
											: T extends [unknown, ...unknown[]]
												? JsonifyTuple<T>
												: T extends ReadonlyArray<infer U>
													? Array<U extends NotJsonable ? null : Jsonify<U>>
													: T extends object
														? JsonifyObject<UndefinedToOptional<T>> // JsonifyObject recursive call for its children
														: never; // Otherwise any other non-object is removed
