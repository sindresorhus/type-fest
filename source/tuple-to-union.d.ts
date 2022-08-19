/**
Convert a tuple into a union type of its elements.

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
function verifyReqBody(body: unknown): body is RequestBody {
	const deliverTo = (body as any).deliverTo
	return typeof body === 'object' && body !== null && verifyDestination(deliverTo)
}
```

@category Array
*/
export type TupleToUnion<ArrayType> = ArrayType extends readonly [infer Head, ...(infer Rest)] ? Head | TupleToUnion<Rest> : never;
