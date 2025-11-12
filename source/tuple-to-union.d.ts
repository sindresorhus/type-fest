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
	const deliverTo = (body as any).deliverTo;
	return typeof body === 'object' && body !== null && verifyDestination(deliverTo);
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQK5gDYqYQCqAdsBKQL5wBmUEIcA5EqgLS0oDOMzA3AChBAY0q84AEx4xgpAIazxcALxwA2s3nMANCwBGuliOYBdOPO5wxpXkMFs0AERlzFFUqrg58hEuUoAHkcIWilXBSVbAD4hAHo4lWiWbTgAHwNmdONmYVpsUhEouAA3FChgWkQXXjcogAppWsiPAC44AoBrUggAd1IASnam2RbKOGArGtH3cfRBAEgoFBhsKE8Ruo9uADo5ETxsJsaI2c9LC1JEAaEqYUc4ACUUAEdsGQAhCElEL3mF6R4YBlKBEdrTLaUW72fKFYogyqIZ5vT7fRD1fRo9pdHr9IZwTE-CZWZHvXhfIn-GwSQHA8pELwYtEWKzyK4DHa0kFEIRLFZrTwhMKE34qMUsCD6ABWKCKWQAZPKCcyAITi0jYPB4OCK0rlREQsakE5A7kQG6CKhAA)

Alternatively, you may use `typeof destinations[number]`. If `destinations` is a tuple, there is no difference. However if `destinations` is a string, the resulting type will the union of the characters in the string. Other types of `destinations` may result in a compile error. In comparison, TupleToUnion will return `never` if a tuple is not provided.

@example
```
const destinations = ['a', 'b', 'c'] as const;

type Destination = typeof destinations[number];
//=> 'a' | 'b' | 'c'

const erroringType = new Set(['a', 'b', 'c']);

// @ts-expect-error
type ErroringType = typeof erroringType[number];
//=> Type 'Set<string>' has no matching index signature for type 'number'. ts(2537)

const numberBool: { [n: number]: boolean } = { 1: true };

type NumberBool = typeof numberBool[number];
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/MYewdgzgLgBAJgU2gSzAQys8EYF4YDaA5GkQDQxEBG5lwRAujGjqJFANwBQXUAngAcEMACJJM6TODwx+QkADN441BiyQCYAK4BbKggBODbgHoTuAHyVSMAD6UadukR5toMQwZAHUAcwAqgsL4YAgA7jAAyghQABTEpBTUtET0DACU3FxmMAACUBAAtAgAHkLAUMUGXga8QTAAotXefoFCMnIIih7NPmABQZq6+kam5lZtwkTRUAA80H2+FkQwABYsMGAgMDoYwKt+MKiIJTAQyL6SWgbCCt6y9UTaeoZEAHSyELEATACsAMwAdnSrmwsGeIwAQiAQAAbABcMAA3oQwIiIYYGIiqDDYQg0GAYABfGQogCMiKgBi0wiJWU6MAAcsNDNC4R0gt0MQY2bChi9RtlxjAcXD8WAgA)

@category Array
*/
export type TupleToUnion<ArrayType> = ArrayType extends readonly unknown[] ? ArrayType[number] : never;

export {};
