import {JsonPrimitive} from './basic';

// Note: The return value has to be `any` and not `unknown` so it can match `void`.
type NotJsonable = ((...args: any[]) => any) | undefined;

/**
Transform a type to one that is assignable to the `JsonValue` type.

@remarks

An interface cannot be structurally compared to `JsonValue` because an interface can be re-opened to add properties that may not be satisfy `JsonValue`.

@example
```
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

@link https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-710744173

@category Utilities
*/
type Jsonify<T> =
	// Check if there are any non-JSONable types represented in the union.
	// Note: The use of tuples in this first condition side-steps distributive conditional types
	// (see https://github.com/microsoft/TypeScript/issues/29368#issuecomment-453529532)
	[Extract<T, NotJsonable>] extends [never]
		? T extends JsonPrimitive
			? T // Primitive is acceptable
			: T extends Array<infer U>
				? Array<Jsonify<U>> // It's an array: recursive call for its children
				: T extends object
					? {[P in keyof T]: Jsonify<T[P]>} // It's an object: recursive call for its children
					: never // Otherwise any other non-object is removed
		: never; // Otherwise non-JSONable type union was found not empty
