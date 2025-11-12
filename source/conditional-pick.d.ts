import type {ConditionalKeys} from './conditional-keys.d.ts';

/**
Pick keys from the shape that matches the given `Condition`.

This is useful when you want to create a new type from a specific subset of an existing type. For example, you might want to pick all the primitive properties from a class and form a new automatically derived type.

@example
```
import type {Primitive, ConditionalPick} from 'type-fest';

class Awesome {
	constructor(public name: string, public successes: number, public failures: bigint) {}

	run() {}
}

type PickPrimitivesFromAwesome = ConditionalPick<Awesome, Primitive>;
//=> {name: string; successes: number; failures: bigint}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gBSqYNgBuKANHAMIQB2AJnsFQIYA2mwAxgNYC+cAZlBBBwA5ElQBaXigDOMYQG4AUIrZMG06XACCAdxmC06RQEg2VWVACubGNAAUYSwCMm7OJQYgUALjgXglADmpI4ubtLWbDLSMr6UliBOKFAhzq5sfAzATJZQsXBOwIEBMACUGFzKxlaUduXolZWKYmisnNi4+ETSAGICILr6XnAAvORUtPiMLOwcADyD0gakHSB0RAB8SgD02yMbGB5evv5B8n6R0fnxicnnvFk5edK+hcWUMFxAA)

@example
```
import type {ConditionalPick} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}

type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgArADGA1gL5wBmUEIcA5EqgLRMoBnGBwDcAKDHAcMFFCYlqaAKIAPEuDJp0YgJAkAXHCFQpAc3E6ARoeNm4AHzg4AriEuyL1QwAoAlHABeAD44ADcIYDwLPEN0enF6CW40AGUYExxTAGkURAEAeRwyREC4bHxCYhxyKjoAHlV1ME0AGiN0syDxAHpu4IwDdozTeiA)

@category Object
*/
export type ConditionalPick<Base, Condition> = Pick<
	Base,
	ConditionalKeys<Base, Condition>
>;

export {};
