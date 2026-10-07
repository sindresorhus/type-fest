import type {Except} from './except.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {CallSignatureOf, HomomorphicPick, IsArrayReadonly} from './internal/index.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Create a type that makes the given keys optional, while keeping the remaining keys as is.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are optional.

@example
```
import type {SetOptional} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
	c: boolean;
};

type SomeOptional = SetOptional<Foo, 'b' | 'c'>;
//=> {a: number; b?: string; c?: boolean}
```

Known limitations:
- An element with a required element after it stays required and gains `| undefined`, because TypeScript rejects a required element after an optional one. `SetOptional<[1, 2, 3], 1>` is `[1, 2 | undefined, 3]`.
- A key that lands in a rest element is ignored, because a rest element has no optionality to add: its elements are always present. `SetOptional<[string, number?], 1>` is `[string, number?]` because there the `?` is real optionality.

@category Object
*/
export type SetOptional<BaseType, Keys extends KeysOfUnion<BaseType>> =
	// The call signature is rebuilt per member, so a union of callables does not mix their signatures.
	BaseType extends unknown
		? CallSignatureOf<BaseType> & _SetOptional<BaseType, Keys>
		: never;

type _SetOptional<BaseType, Keys> =
	BaseType extends unknown // To distribute `BaseType` when it's a union type.
		? BaseType extends UnknownArray
			// `any` takes both branches of the array check, so its array branch is dropped to leave just the object branch.
			? IsAny<BaseType> extends true
				? never
				: IsArrayReadonly<BaseType> extends true
					? Readonly<SetArrayOptional<BaseType, Keys>>
					: SetArrayOptional<BaseType, Keys>
			: Simplify<
				// Pick just the keys that are not made optional from the base type.
				Except<BaseType, Keys & keyof BaseType>
				// Pick the keys that should be optional from the base type and make them optional.
				& Partial<HomomorphicPick<BaseType, Keys & keyof BaseType>>
			>
		: never;

/**
Makes the tuple elements at the given indices optional, keeping the other elements as they are.
*/
type SetArrayOptional<
	TArray extends UnknownArray,
	Keys,
	Counter extends any[] = [],
	Accumulator extends UnknownArray = [],
> = TArray extends unknown // To distribute `TArray` when it's a union
	? '0' extends keyof TArray
		? TArray extends readonly [(infer First)?, ...infer Rest]
			// Unlike the other array loops, this one has no `any` guard above it, so the check is wrapped in tuples to stop `any` from matching both branches.
			? [TArray] extends [readonly [unknown, ...unknown[]]]
				? `${Counter['length']}` extends `${Keys & (string | number)}` // If the current index needs to be optional
					? SetArrayOptional<Rest, Keys, [...Counter, any], [...Accumulator, First?]>
					: SetArrayOptional<Rest, Keys, [...Counter, any], [...Accumulator, First]>
				: SetArrayOptional<Rest, Keys, [...Counter, any], [...Accumulator, First?]>
			: never // Should never happen, since `[(infer F)?, ...infer R]` is a top-type for arrays.
		// Exit if `TArray` is empty (e.g., []), or `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
		: [...Accumulator, ...TArray]
	: never; // Should never happen

export {};
