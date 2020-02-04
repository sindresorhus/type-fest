import {Except} from './except';
import {ConditionalKeys} from './conditional-keys';

/**
Exclude the keys from any shape which matches the provided `Condition`.

This is useful when you want to create a new type with a specific set of keys from a shape. For example, you might want to exclude all the primitive properties from a class and form a new shape containing everything but the primitive properties.

@example
```
import {Primitive, ConditionalExcept} from 'type-fest';

class Awesome {
	name: string;
	successes: number;
	failures: bigint;

	run() {}
}

type ExceptPrimitivesFromAwesome = ConditionalExcept<Awesome, Primitive>;
// => { run: () => void; }
```

A simpler and more contrived example is below.

@example
```
import {ConditionalExcept} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {}
}

type NonStringKeysOnly = ConditionalExcept<Example, string>;
// => { b: string | number; c: () => void; d: {}; }
```
*/
export type ConditionalExcept<Base, Condition> = Except<
	Base,
	ConditionalKeys<Base, Condition>
>;
