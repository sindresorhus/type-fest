import type {Except} from './except.d.ts';
import type {ConditionalKeys, ConditionalKeysOptions, _DefaultConditionalKeysOptions} from './conditional-keys.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {Extends} from './internal/type.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {ExtendsStrict} from './extends-strict.d.ts';

/**
Exclude keys from a shape that matches the given `Condition`.

This is useful when you want to create a new type with a specific set of keys from a shape. For example, you might want to exclude all the primitive properties from a class and form a new shape containing everything but the primitive properties.

@example
```
import type {Primitive, ConditionalExcept} from 'type-fest';

class Awesome {
	constructor(public name: string, public successes: number, public failures: bigint) {}

	run() {
		// do something
	}
}

type ExceptPrimitivesFromAwesome = ConditionalExcept<Awesome, Primitive>;
//=> {run: () => void}
```

@example
```
import type {ConditionalExcept} from 'type-fest';

type Example = {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
};

type NonStringKeysOnly = ConditionalExcept<Example, string>;
//=> {b: string | number; c: () => void; d: {}}
```

Set the `strict` option to `false` to exclude a key when any member of its value type extends the condition:

@example
```
import type {ConditionalExcept} from 'type-fest';

type ExceptOptionalDate = ConditionalExcept<{date?: Date; name: string}, Date, {strict: false}>;
//=> {name: string}
```

@category Object
*/
export type ConditionalExcept<Base, Condition, Options extends ConditionalKeysOptions = {}> =
	ApplyDefaultOptions<ConditionalKeysOptions, _DefaultConditionalKeysOptions, Options> extends infer ResolvedOptions extends Required<ConditionalKeysOptions>
		? Base extends unknown // For distributing `Base`, so each member contributes the keys that do not match the condition, like `ConditionalPick` does
			? ConditionalKeys<Base, Condition, ResolvedOptions> extends infer Keys
				? IsNever<Keys> extends true
					? Base
					// Preserve the primitive/any property view, and check each object value before a matching index signature can swallow its named fields.
					: ExtendsStrict<Base, object, {strictAny: true}> extends true
						? {[Key in keyof Base as Key extends Keys
							? Extends<Base[Key], Condition, ResolvedOptions['strict'] extends false ? false : true> extends true ? never : Key
							: Key]: Base[Key]}
						: Except<Base, Keys & keyof Base>
				: never
			: never // Should never happen
		: never; // Should never happen

export {};
