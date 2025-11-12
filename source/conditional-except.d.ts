import type {Except} from './except.d.ts';
import type {ConditionalKeys} from './conditional-keys.d.ts';

/**
Exclude keys from a shape that matches the given `Condition`.

This is useful when you want to create a new type with a specific set of keys from a shape. For example, you might want to exclude all the primitive properties from a class and form a new shape containing everything but the primitive properties.

@example
```
import type {Primitive, ConditionalExcept} from 'type-fest';

class Awesome {
	constructor(public name: string, public successes: number, public failures: bigint) {}

	run() {}
}

type ExceptPrimitivesFromAwesome = ConditionalExcept<Awesome, Primitive>;
//=> {run: () => void}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gBSqYNgBuKANHAMIQB2AJnsFQIYA2AogB4DGKYMAvnADMoEEHADkSVAFoBKAM4wxAbgBQKjkwZy5cAIIB3eSLToVASA5UFUAK4cY0ABRgbAIybAOcSgxAoAXHDWwJQA5qQu7p5Bdlza8oGUNiCuKFARbh5eAgzATDZQCXCuwKEhMACUGLxqZraUjlXoNTUqkmjsXDzYuPhEcgBiwiAGRn5wALzkVLT4jKyc3DAAPKNyxqQ9IHREAHyqAPQHE7sY9YGNk6cEEMDUvEA)

@example
```
import type {ConditionalExcept} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}

type NonStringKeysOnly = ConditionalExcept<Example, string>;
//=> {b: string | number; c: () => void; d: {}}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgKIAeAximDAL5wBmUEIcA5EqgLQsUAZxhcA3ACgJwHDBRQWJOnGolwZNOgkBIEgC44IqDIDmk7QCMDR03AA+cHAFcQF+eZoGAFAEo4AXgA+OAA3CGA8czwDdEZJRileNAA5XABlGGMcEwBpFEQhAHkcMkQAuGx8QmIccmo6BgAeVXUUABpDTNNAyQB6XqCMK06sk3tHFzcoMThPOF8A4LCImeiMRkYgA)

@category Object
*/
export type ConditionalExcept<Base, Condition> = Except<
	Base,
	ConditionalKeys<Base, Condition>
>;

export {};
