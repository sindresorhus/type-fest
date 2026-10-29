import type {UnionToTuple} from './union-to-tuple.d.ts'; // For `@link`

/**
Convert a tuple/array into a union type of its elements.

This can be useful when you have a fixed set of allowed values and want a type defining only the allowed values, but do not want to repeat yourself.

@example
```
import type {TupleToUnion} from 'type-fest';

const destinations = ['a', 'b', 'c'] as const;

type Destination = TupleToUnion<typeof destinations>;
//=> 'a' | 'b' | 'c'

function verifyDestination(destination: unknown): destination is Destination {
	return destinations.includes(destination as any);
}

type RequestBody = {
	deliverTo: Destination;
};

function verifyRequestBody(body: unknown): body is RequestBody {
	return typeof body === 'object' && body !== null && 'deliverTo' in body && verifyDestination(body.deliverTo);
}
```

Alternatively, you may use `typeof destinations[number]`. If `destinations` is a tuple or array, there is no difference. If `destinations` is a string, indexing it with `number` gives `string`. Other types of `destinations` may result in a compile error. In comparison, `TupleToUnion` returns `never` for inputs that are not tuples or arrays.

@example
```
const destinations = ['a', 'b', 'c'] as const;

type Destination = typeof destinations[number];
//=> 'a' | 'b' | 'c'

const erroringType = new Set(['a', 'b', 'c']);

// @ts-expect-error
type ErroringType = typeof erroringType[number];
// Error: Type 'Set<string>' has no matching index signature for type 'number'. ts(2537)

const numberBool: {[n: number]: boolean} = {1: true};

type NumberBool = typeof numberBool[number];
//=> boolean
```

@see {@link UnionToTuple}

@category Array
*/
export type TupleToUnion<ArrayType> = ArrayType extends readonly unknown[] ? ArrayType[number] : never;

export {};
