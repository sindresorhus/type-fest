import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {Except} from './except.d.ts';
import type {CallSignatureOf, HomomorphicPick} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
Create a type that makes the given keys readonly, while keeping the remaining keys as is.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are readonly.

@example
```
import type {SetReadonly} from 'type-fest';

type Foo = {
	a: number;
	readonly b: string;
	c: boolean;
};

type SomeReadonly = SetReadonly<Foo, 'b' | 'c'>;
//=> {a: number; readonly b: string; readonly c: boolean}
```

@category Object
*/
export type SetReadonly<BaseType, Keys extends KeysOfUnion<BaseType>> =
	// The call signature is rebuilt per member, so a union of callables does not mix their signatures.
	BaseType extends unknown
		? CallSignatureOf<BaseType> & _SetReadonly<BaseType, Keys>
		: never;

export type _SetReadonly<BaseType, Keys> =
	BaseType extends unknown // To distribute `BaseType` when it's a union type.
		? BaseType extends UnknownArray
			// `readonly` applies to a whole tuple, not to individual elements, so the tuple becomes readonly when any key is given.
			// `any` takes both branches of the array check, so its array branch is dropped to leave just the object branch.
			? IsAny<BaseType> extends true
				? never
				: IsNever<Keys & keyof BaseType> extends true
					? BaseType
					: Readonly<BaseType>
			: Simplify<
				Except<BaseType, Keys & keyof BaseType>
				& Readonly<HomomorphicPick<BaseType, Keys & keyof BaseType>>
			>
		: never;

export {};
