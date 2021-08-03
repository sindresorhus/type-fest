import {JsonPrimitive} from './basic';
/**
Transforms a type to a type that is assignable to `JsonValue` type

@remarks

An interface cannot be structurally compared to `JsonValue` because an interface can be re-opened to add properties that may not be satisfy `JsonValue`.

Without intending to pick on @types/geojson, sometimes there are Json type definitions like GeoJson's [`Point` interface(https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/geojson/index.d.ts#L86-L89 that) that are clearly Json and won't be extended.  If a method requires a `JsonValue` argument as in `const someMethodOnJson = <T extends JsonValue>(data: T) => void`, and you pass a value of an interface type like `GeoJSON.Point`, then there will be a type error.  To solve this problem, you can assert the interface type is JSON like this `Jsonify<GeoJSON.Point>`.  `Jsonify<T>` also applies to types that have nested interface types too.

Credit: Jsonify<T> comes from discussion in link below.

@link: https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-710744173

@category Utilities
*/
type DefinitelyNotJsonable = ((...args: any[]) => any) | undefined;
export type Jsonify<T> =
	// Check if there are any non-jsonable types represented in the union
	// Note: use of tuples in this first condition side-steps distributive conditional types
	// (see https://github.com/microsoft/TypeScript/issues/29368#issuecomment-453529532)
	[Extract<T, DefinitelyNotJsonable>] extends [never]
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
	// Otherwise any other non-object no bueno
	: never
	// Otherwise non-jsonable type union was found not empty
	: never;
