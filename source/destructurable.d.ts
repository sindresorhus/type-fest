import {type Simplify} from './simplify';
import {type UnionToIntersection} from './union-to-intersection';

/**
Convert a union type of objects to a destructurable type.

@example
```
import type {Destructurable} from 'type-fest';

type Success = {
	type: 'success';
	value: number;
};

type Failure = {
	type: 'failure';
	error: Error;
};

type Result = Destructurable<Success | Failure>;

function divide(x: number, y: number): Result {
	return y === 0
		? {type: 'success', value: x / y}
		: {type: 'failure', error: new Error('Division by zero')};
}

// The `result` can be destructured directly.
const {type, value, error} = divide(4, 2);

// Narrowing also works.
if (type === 'success') {
	value - 1; // `value` is a number
} else {
	error.message;
}
```

@category Utilities
*/
type Destructurable<UnionType> = Simplify<
UnionToIntersection<{
	[KeyType in keyof UnionType]?: undefined;
}> extends infer ObjectWithAllKeys // Create an object that has all keys of UnionTypes with undefined, and assign it to ObjectWithAllKeys.
	? UnionType extends infer EachType // For each types in UnionTypes.
		? EachType & Omit<ObjectWithAllKeys, keyof EachType> // Create a new type that is the intersection of EachType and the object that has all keys of UnionTypes with undefined, but omit the keys that are already in EachType.
		: never
	: never
>;
