import {ConditionalKeys} from './conditional-keys';

/**
Pick all keys from them shape which match the provided `Condition`.

This is useful when you want to create a new type from a specific subset from an already created type. For example you might want to pick all the primitive properties from a class and form a new automatically derived type.

@example
```
import {Primitive, ConditionalPick} from 'type-fest';

class Awesome {
	name: string;
	successes: number;
	failures: bigint;

	run() {}
}

type PickPrimitivesFromAwesome = ConditionalPick<Awesome, Primitive>;
// => { name: string; successes: number; failures: bigint; }
```

A simpler and more contrived example is below.

@example
```
import {ConditionalPick} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {}
}

type StringKeysOnly = ConditionalPick<Example, string>;
// => { a: string; }
```
*/
export type ConditionalPick<Base, Condition> = Pick<
	Base,
	ConditionalKeys<Base, Condition>
>;
