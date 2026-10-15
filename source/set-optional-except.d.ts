import type {KeysExcept} from './internal/index.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {SetOptional} from './set-optional.d.ts';

/**
Create a type that makes all keys optional except the given keys, which are kept as is.

Use-case: You want a type where almost every key is optional, such as an update payload where only the ID is required.

For an object, this is the same as `SetOptional<BaseType, Exclude<keyof BaseType, Keys>>`, but the given keys are checked against the type, so a typo is a type error instead of making every key optional.

@example
```
import type {SetOptionalExcept} from 'type-fest';

type User = {
	id: string;
	name: string;
	email: string;
};

type UserUpdate = SetOptionalExcept<User, 'id'>;
//=> {id: string; name?: string; email?: string}

// On a tuple, the keys are indices.
type TupleExample = SetOptionalExcept<[number, number, number], 0>;
//=> [number, number?, number?]
```

Known limitations:
- A given key that a string or number index signature also covers is made optional too, because a key type cannot leave one key out of an index signature. `SetOptionalExcept<{[key: string]: number; a: number}, 'a'>` makes `a` optional.
- Tuples follow the same rules and limitations as {@link SetOptional}. An element with a required element after it stays required and gains `| undefined`, because TypeScript rejects a required element after an optional one. Arrays with extra members, such as a `Tagged` tuple, are not supported.

@category Object
*/
export type SetOptionalExcept<BaseType, Keys extends KeysOfUnion<BaseType>> =
	BaseType extends unknown // To get the remaining keys of each member of a union separately, so that the keys of an object member do not turn a tuple member into an object.
		? SetOptional<BaseType, KeysExcept<BaseType, Keys>>
		: never;

export {};
