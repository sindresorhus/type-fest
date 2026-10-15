import type {KeysExcept} from './internal/index.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {SetRequired} from './set-required.d.ts';

/**
Create a type that makes all keys required except the given keys, which are kept as is.

Use-case: You want a type where almost every key is required, such as options after defaults are applied, where some options have no default.

For an object, this is the same as `SetRequired<BaseType, Exclude<keyof BaseType, Keys>>`, but the given keys are checked against the type, so a typo is a type error instead of making every key required.

Note: Like `SetRequired`, this only removes the optional modifier. It does not remove `undefined` from the value type. Use `SetNonNullable` for that.

@example
```
import type {SetRequiredExcept} from 'type-fest';

type Options = {
	timeout?: number;
	retries?: number;
	cwd?: string;
};

type ResolvedOptions = SetRequiredExcept<Options, 'cwd'>;
//=> {cwd?: string; timeout: number; retries: number}

// On a tuple, the keys are indices.
type TupleExample = SetRequiredExcept<[number?, number?, number?], 2>;
//=> [number, number, number?]
```

Known limitations:
- A given key that a string or number index signature also covers is made required too, because a key type cannot leave one key out of an index signature. `SetRequiredExcept<{[key: string]: number; a?: number}, 'a'>` makes `a` required.
- Tuples follow the same rules and limitations as {@link SetRequired}. A key that lands after an optional element that is not made required is ignored, because TypeScript rejects a required element after an optional one. Arrays with extra members, such as a `Tagged` tuple, are not supported.

@category Object
*/
export type SetRequiredExcept<BaseType, Keys extends KeysOfUnion<BaseType>> =
	BaseType extends unknown // To get the remaining keys of each member of a union separately, so that the keys of an object member do not turn a tuple member into an object.
		? SetRequired<BaseType, KeysExcept<BaseType, Keys>>
		: never;

export {};
