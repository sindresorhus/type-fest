import type {ConditionalKeys, ConditionalKeysOptions, _DefaultConditionalKeysOptions} from './conditional-keys.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {Extends} from './internal/type.d.ts';
import type {ExtendsStrict} from './extends-strict.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Pick keys from the shape that matches the given `Condition`.

This is useful when you want to create a new type from a specific subset of an existing type. For example, you might want to pick all the primitive properties from a class and form a new automatically derived type.

@example
```
import type {Primitive, ConditionalPick} from 'type-fest';

class Awesome {
	constructor(public name: string, public successes: number, public failures: bigint) {}

	run() {
		// do something
	}
}

type PickPrimitivesFromAwesome = ConditionalPick<Awesome, Primitive>;
//=> {name: string; successes: number; failures: bigint}
```

@example
```
import type {ConditionalPick} from 'type-fest';

type Example = {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
};

type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```

Set the `strict` option to `false` to pick a key when any member of its value type extends the condition:

@example
```
import type {ConditionalPick} from 'type-fest';

type OptionalDate = ConditionalPick<{date?: Date; name: string}, Date, {strict: false}>;
//=> {date?: Date}
```

@category Object
*/
// The result is `never` only when no member of a union has a matching key. Once some member has one, an object member without any is kept as `{}`, the same as `ConditionalExcept` keeps an object member it empties. A member that is not an object, like `undefined`, is dropped.
export type ConditionalPick<Base, Condition, Options extends ConditionalKeysOptions = {}> =
	ApplyDefaultOptions<ConditionalKeysOptions, _DefaultConditionalKeysOptions, Options> extends infer ResolvedOptions extends Required<ConditionalKeysOptions>
		? IsNever<Base extends unknown ? ConditionalKeys<Base, Condition, ResolvedOptions> : never> extends true
			? never
			: Base extends unknown // For distributing `Base`
				? _ConditionalPick<Base, Condition, ConditionalKeys<Base, Condition, ResolvedOptions>, ResolvedOptions['strict'] extends false ? false : true>
				: never // Should never happen
		: never; // Should never happen

type _ConditionalPick<Base, Condition, Keys, Strict extends boolean> =
	IsNever<Keys> extends true
		? Base extends object ? {} : never
		// Preserve Pick's existing property view for primitive and any inputs.
		: ExtendsStrict<Base, object, {strictAny: true}> extends true
			? {
				// ConditionalKeys excludes array methods; test each value because a matching signature can subsume a nonmatching declared key.
				[Key in keyof Base as Key extends Keys
					? Extends<Base[Key], Condition, Strict> extends true ? Key : never
					: never]: Base[Key]
			}
			: Pick<Base, Keys & keyof Base>;

export {};
