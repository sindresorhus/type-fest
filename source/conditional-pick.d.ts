import type {ConditionalKeys} from './conditional-keys.d.ts';
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

@category Object
*/
// The result is `never` only when no member of a union has a matching key. Once some member has one, an object member without any is kept as `{}`, the same as `ConditionalExcept` keeps an object member it empties. A member that is not an object, like `undefined`, is dropped.
export type ConditionalPick<Base, Condition> =
	IsNever<Base extends unknown ? ConditionalKeys<Base, Condition> : never> extends true
		? never
		: Base extends unknown // For distributing `Base`
			? IsNever<ConditionalKeys<Base, Condition>> extends true
				? Base extends object ? {} : never
				: Pick<Base, ConditionalKeys<Base, Condition> & keyof Base>
			: never; // Should never happen

export {};
