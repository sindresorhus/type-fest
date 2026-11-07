import type {ApplyDefaultOptions, CallSignatureOf, HasMultipleCallSignatures, IsArrayOfUnknownLength, NonRecursiveLeaf} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
@see {@link RequiredDeep}
*/
export type RequiredDeepOptions = {
	/**
	The types to keep as is, instead of making deeply required.

	A kept type is left untouched at every depth, including everything inside it. Matching uses assignability.

	@default never

	@example
	```
	import type {RequiredDeep} from 'type-fest';

	type Color = {red?: number};
	type Settings = {name?: string; color?: Color};
	type RequiredSettings = RequiredDeep<Settings, {keep: Color}>;
	//=> {name: string; color: Color}
	```
	*/
	readonly keep?: unknown;
};

/**
Create a deeply required version of another type.

Use-cases:
- Creating optional configuration interfaces where the underlying implementation still requires all options to be fully specified.
- Modeling the resulting type after a deep merge with a set of defaults.

Use [`Required<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype) if you only need one level deep.

@example
```
import type {RequiredDeep} from 'type-fest';

type Settings = {
	textEditor?: {
		fontSize?: number;
		fontColor?: string;
		fontWeight?: number | undefined;
	};
	autocomplete?: boolean;
	autosave?: boolean | undefined;
};

type RequiredSettings = RequiredDeep<Settings>;
//=> {
// 	textEditor: {
// 		fontSize: number;
// 		fontColor: string;
// 		fontWeight: number | undefined;
// 	};
// 	autocomplete: boolean;
// 	autosave: boolean | undefined;
// }
```

Pass the types to keep as is through the `keep` option to leave matching types untouched at every depth, like a class instance whose properties and methods should not be made required. Matching uses assignability, so a plain object type that structurally matches a kept type is kept too, and a wide type, like `object`, keeps every object:

@example
```
import type {RequiredDeep} from 'type-fest';

class Color {
	r?: number;
	g?: number;
}

type Settings = {
	name?: string;
	color?: Color;
};

type RequiredKeptSettings = RequiredDeep<Settings, {keep: Color}>;
// {
// 	name: string;
// 	color: Color;
// }
```

Note that types containing overloaded functions are not made deeply required due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

Note that an `Error` is walked like any other object, because a plain object with `name` and `message` is structurally an `Error` too. So `RequiredDeep<Error>` makes `stack` required, and a real `Error` is not assignable to it. Pass `{keep: Error}` as the second type argument to keep it as is.

@see {@link RequiredDeepOptions}

@category Utilities
@category Object
@category Array
@category Set
@category Map
*/
export type RequiredDeep<Value, Options extends RequiredDeepOptions = {}> =
	_RequiredDeep<Value, ApplyDefaultOptions<RequiredDeepOptions, {keep: never}, Options>['keep']>;

/**
Internal helper for {@link RequiredDeep}.
*/
type _RequiredDeep<Value, Keep> =
	// A kept type is returned as is, including everything inside it. It is matched before everything else, so a kept `Map` or `Set` is not rebuilt either.
	Value extends Keep
		? Value
		: Value extends NonRecursiveLeaf
			? Value
			: Value extends Map<infer KeyType, infer ValueType>
				? Map<_RequiredDeep<KeyType, Keep>, _RequiredDeep<ValueType, Keep>>
				: Value extends Set<infer ItemType>
					? Set<_RequiredDeep<ItemType, Keep>>
					: Value extends ReadonlyMap<infer KeyType, infer ValueType>
						? ReadonlyMap<_RequiredDeep<KeyType, Keep>, _RequiredDeep<ValueType, Keep>>
						: Value extends ReadonlySet<infer ItemType>
							? ReadonlySet<_RequiredDeep<ItemType, Keep>>
							: Value extends WeakMap<infer KeyType, infer ValueType>
								? WeakMap<_RequiredDeep<KeyType, Keep>, _RequiredDeep<ValueType, Keep>>
								: Value extends WeakSet<infer ItemType>
									? WeakSet<_RequiredDeep<ItemType, Keep>>
									: Value extends Promise<infer ValueType>
										? Promise<_RequiredDeep<ValueType, Keep>>
										: Value extends (...arguments_: any[]) => unknown
											? IsNever<keyof Value> extends true
												? Value
												: HasMultipleCallSignatures<Value> extends true
													? Value
													: CallSignatureOf<Value> & RequiredObjectDeep<Value, Keep>
											// The `Function` interface has no call signature, so the branch above misses it, and mapping it would produce an uncallable record of its own methods.
											: Value extends Function
												? Value
												: Value extends readonly unknown[]
													? IsArrayOfUnknownLength<Value> extends true
														// Rebuild arrays directly to keep recursive elements lazy, and read through `Required<Value>` to preserve its treatment of `undefined`. The element is matched against `Keep` before `Required<Value>`, so a kept element union is not stripped by it.
														? Value extends unknown[]
															? Array<_RequiredDeep<Value[number] extends Keep ? Value[number] : Required<Value>[number], Keep>>
															: ReadonlyArray<_RequiredDeep<Value[number] extends Keep ? Value[number] : Required<Value>[number], Keep>>
														: RequiredObjectDeep<Value, Keep>
													: Value extends object
														? RequiredObjectDeep<Value, Keep> // The terminal intersection expands the object without a second mapping.
														: unknown;

type RequiredObjectDeep<ObjectType extends object, Keep> = {
	[KeyType in keyof ObjectType]-?: _RequiredDeep<ObjectType[KeyType], Keep>
} & {};

export {};
