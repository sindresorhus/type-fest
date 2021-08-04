import {JsonPrimitive} from './basic';

type NotJsonable = ((...args: any[]) => unknown) | undefined;

/**
Transform a type to a type that is assignable to the `JsonValue` type.

@remarks

An interface cannot be structurally compared to `JsonValue` because an interface can be re-opened to add properties that may not be satisfy `JsonValue`.

Example:

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

Credit: Jsonify<T> comes from discussion in link below.
@link https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-710744173

@category Utilities
*/
export type Jsonify<T> =
	// Check if there are any non-jsonable types represented in the union
	// Note: use of tuples in this first condition side-steps distributive conditional types
	// (see https://github.com/microsoft/TypeScript/issues/29368#issuecomment-453529532)
	[Extract<T, NotJsonable>] extends [never]
	// Non-jsonable type union was found empty
	? T extends JsonPrimitive
	// Primitive is acceptable
	? T
	// Otherwise check if array
	: T extends Array<infer U>
	// Arrays are special; just check array element type
	? Array<Jsonify<U>>
	// Otherwise check if object
	: T extends object
	// It's an object
	? {
		// Iterate over keys in object case
		[P in keyof T]:
		// Recursive call for children
		Jsonify<T[P]>
	}
	// Otherwise any other non-object is not allowed
	: never
	// Otherwise non-jsonable type union was found not empty
	: never;
