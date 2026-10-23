import type {NonNullableDeep} from './non-nullable-deep.d.ts'; // For `@link`
import type {RequiredDeep} from './required-deep.d.ts'; // For `@link`
import type {RequiredKeepUndefined} from './required-keep-undefined.d.ts'; // For `@link`
import type {SetNonNullable} from './set-non-nullable.d.ts'; // For `@link`
import type {SetRequiredNonNullable} from './set-required-non-nullable.d.ts'; // For `@link`

/**
Create a type that makes all keys required and non-nullable, including the elements of an array or tuple.

It removes the optional modifier from every key, and `null` and `undefined` from every value type.

Use-case: Describe a value after a runtime check has confirmed that every key is present and not nullish, such as options after defaults are applied or input that a validator has approved. TypeScript cannot narrow an object or tuple type to that on its own.

@example
```
import type {RequiredNonNullable} from 'type-fest';

type Point = [x: number | null, y?: number];

type CompletePoint = RequiredNonNullable<Point>;
//=> [x: number, y: number]

declare function draw(point: CompletePoint): void;

// A `null` element and a missing element are both type errors.
// @ts-expect-error
draw([null, 1]);

// @ts-expect-error
draw([1]);

draw([1, 2]);
```

@example
```
import type {RequiredNonNullable} from 'type-fest';

type Options = {
	name?: string | null;
	verbose?: boolean;
};

const parseOptions = (options: Options): RequiredNonNullable<Options> => {
	if (options.name === undefined || options.name === null) {
		throw new TypeError('The `name` option is required.');
	}

	return {name: options.name, verbose: options.verbose ?? false};
};

const {name} = parseOptions({name: 'unicorn'});
//=> string
```

Note: Unlike {@link SetNonNullable}, it also removes the optional modifier. Without that, an optional key still reads as possibly `undefined`, so `SetNonNullable<[string, number?]>[1]` is still `number | undefined`, although `NonNullable` removed `undefined` from the value type. See [this comment on the TypeScript issue tracker](https://github.com/microsoft/TypeScript/issues/50753#issuecomment-1251431487), where this type comes from.

Known limitations:
- Only the top-level keys change, so a nested value keeps `null`, `undefined`, and its optional keys. For nested values, combine {@link NonNullableDeep} with {@link RequiredDeep}, like `RequiredDeep<NonNullableDeep<Type>>`.
- Like the built-in `Required`, it leaves out the `private` and `protected` members of a class, so the result is not assignable to the class. Use `ClassType & RequiredNonNullable<ClassType>` to keep them.
- An array or tuple with extra members, such as a `Tagged` tuple, becomes an object type, so its methods, like `push`, keep the original element type.

@see {@link RequiredKeepUndefined}
@see {@link SetNonNullable}
@see {@link SetRequiredNonNullable}

@category Object
@category Array
*/
export type RequiredNonNullable<Type> = {[Key in keyof Type]-?: NonNullable<Type[Key]>};

export {};
