import type {ToString, UnwrapPathBrand} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {RequiredNonNullable} from './required-non-nullable.d.ts'; // For `@link`
import type {SetNonNullable} from './set-non-nullable.d.ts'; // For `@link`
import type {SetRequired} from './set-required.d.ts'; // For `@link`
import type {Simplify} from './simplify.d.ts'; // For `@link`

/**
Create a type that makes the given keys required and non-nullable, while keeping the remaining keys as is.

This is {@link SetRequired} and {@link SetNonNullable} in one step. It removes the optional modifier from each given key, and it removes `null` and `undefined` from the value type of each given key.

Note: To make every key required and non-nullable, use {@link RequiredNonNullable} instead. It returns one flat type, and it also changes every element of an array or a tuple.

Use-cases:
- Give a reusable type guard a return type that tells its callers what it checked. TypeScript cannot narrow a key of a generic object type on its own.
- Give an optional key its type after you have checked that it is present, such as a field of an options object or of an untrusted JSON value.

@example
```
import type {SetRequiredNonNullable} from 'type-fest';

type PackageJson = {
	name?: string | null;
	version?: string;
};

// The guard narrows to this type, so a caller gets the exact type of the key it checked.
const hasOwnNonNullish = <ObjectType extends object, Key extends keyof ObjectType>(
	value: ObjectType | null | undefined,
	key: Key,
): value is SetRequiredNonNullable<ObjectType, Key> =>
	value !== null
	&& value !== undefined
	&& Object.hasOwn(value, key)
	&& value[key] !== null
	&& value[key] !== undefined;

declare const packageJson: PackageJson | null | undefined;

if (hasOwnNonNullish(packageJson, 'name')) {
	const {name} = packageJson;
	//=> string

	// A key that the guard did not check is kept as is.
	const {version} = packageJson;
	//=> string | undefined
}
```

@example
```
import type {SetRequiredNonNullable} from 'type-fest';

type Options = {
	name?: string | null;
	retries?: number;
	verbose: boolean;
};

type NamedOptions = SetRequiredNonNullable<Options, 'name'>;

// A missing or nullish value is a type error.
// @ts-expect-error
const missingName: NamedOptions = {verbose: true};

// @ts-expect-error
const nullName: NamedOptions = {name: null, verbose: true};

const options: NamedOptions = {
	name: 'unicorn',
	retries: 2,
	verbose: true,
};

const {name} = options;
//=> string

// The other keys keep their type.
const {retries} = options;
//=> number | undefined
```

The result is an intersection of the given type and an object type that has the given keys, not a single flat object type. The intersection is on purpose: a type predicate's type must be assignable to the type of its parameter, and TypeScript cannot prove that a mapped type built from a generic type is assignable to that type. So `SetRequired<SetNonNullable<ObjectType, Key>, Key>` is rejected in a `value is` clause, and the same combination also fails the `KeysOfUnion` constraint of `SetRequired` in a generic type alias. An intersection is always assignable to the given type. Wrap the result in {@link Simplify} to get one flat object type, which is also easier to read in an editor.

@example
```
import type {SetRequiredNonNullable, Simplify} from 'type-fest';

type Options = {
	name?: string | null;
	verbose: boolean;
};

type NamedOptions = Simplify<SetRequiredNonNullable<Options, 'name'>>;
//=> {name: string; verbose: boolean}
```

Note: `Keys` as `any` selects every key, the same as with {@link SetRequired}.

Known limitations:
- `Keys` must be a key of every member of a union, unlike {@link SetRequired} and {@link SetNonNullable}, which also accept a key that only some members have. The mapped type needs `BaseType[Key]`, which is only valid when every member has the key, so a key that only some members have is a type error instead of being ignored on the members that do not have it.
- A `number` key on an array makes the element reads non-nullable, but the array methods keep the original element type, so `push` still accepts a nullable element. Use {@link SetNonNullable} when the element type itself must change.
- A `number` key does not change the element reads of a tuple, because TypeScript reads a tuple element through its own index and not through the `number` index signature of the intersection: `SetRequiredNonNullable<[string | null], number>` still reads index `0` as `string | null`, although a value that has `null` there is rejected. Use a literal index key instead, such as `0 | 1`. That also works when an optional element comes before it, which `SetRequired` ignores.

@see {@link SetRequired}
@see {@link SetNonNullable}

@category Object
*/
export type SetRequiredNonNullable<BaseType, Keys extends keyof BaseType> =
	SetRequiredNonNullableImplementation<BaseType, (UnwrapPathBrand<Keys> | Extract<Exclude<keyof BaseType, UnwrapPathBrand<Keys>>, ToString<UnwrapPathBrand<Keys> & string>>) & keyof BaseType>;

// A constrained selector parameter retains the readonly modifiers when mapping its properties.
type SetRequiredNonNullableImplementation<BaseType, Keys extends keyof BaseType> =
	BaseType extends unknown // To distribute `BaseType` when it's a union type.
		? IsAny<Keys> extends true // `any` selects every key, the same as with `SetRequired`.
			? BaseType & {[Key in keyof BaseType]-?: NonNullable<BaseType[Key]>}
			: BaseType & {[Key in Keys]-?: NonNullable<BaseType[Key]>}
		: never;

export {};
