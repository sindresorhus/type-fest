import type {Simplify} from './simplify.d.ts';
import type {UnionToIntersection} from './union-to-intersection.d.ts';

/**
Convert a union of object types into a type whose members can be destructured directly.

When a function returns different object shapes and you let TypeScript infer the return type, the compiler describes each member with the keys of the *other* members added as optional `undefined` properties. That inferred shape is what lets you destructure the result in a single statement. As soon as you annotate the return type with a plain union (`Success | Failure`), that convenience is lost: destructuring a key that only exists on some members fails to compile, even though the value is present at runtime.

`Destructurable` reconstructs the inferred shape from an explicit union, so the union stays destructurable. The original members are preserved, so narrowing on a discriminant property continues to work exactly as before.

Use-cases:
- Destructure the result of a function that returns a discriminated union in one statement, without narrowing first.
- Keep a hand-written return type union destructurable, matching what TypeScript would have inferred.

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
		? {type: 'failure', error: new Error('Division by zero')}
		: {type: 'success', value: x / y};
}

// The result can be destructured directly.
const {type, value, error} = divide(4, 2);

// Narrowing on the discriminant still works.
if (type === 'success') {
	console.log('value:', value); // `value` is `number`
} else {
	console.log('error:', error.message);
}
```

It works by first collecting every key of every member into a single object (`UnionToIntersection` merges the per-member key sets), then intersecting each member with the keys it is missing, typed as optional `undefined`.

@category Utilities
*/
export type Destructurable<UnionType> = Simplify<
	UnionToIntersection<{
		[Key in keyof UnionType]?: undefined;
	}> extends infer AllKeys
		? UnionType extends unknown
			? UnionType & Omit<AllKeys, keyof UnionType>
			: never
		: never
>;

export {};
