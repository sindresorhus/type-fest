import type {OmitDeep} from './omit-deep';
import type {Paths} from './paths';
import type {PickDeep} from './pick-deep';
import type {RequiredDeep} from './required-deep';
import type {SimplifyDeep} from './simplify-deep';

/**
Create a type that makes the given keys required. You can specifiy deeply nested key paths. The remaining keys are kept as is.

Use-case: You want to define as required only a some nested keys inside a model.

@example
```
import type {SetRequiredDeep} from 'type-fest';

type Foo = {
	a?: number;
	b?: string;
	array?: {
		c?: number
	}[]
}

type SomeRequiredDeep = SetRequiredDeep<Foo, 'a' | 'array.c'>;
// type SomeRequiredDeep = {
// 	a: number; // Is now required
// 	b?: string;
// 	array: {
//    c: number // Is now required
//  }[]
// }
```

@category Object
*/
export type SetRequiredDeep<BaseType, KeyPaths extends Paths<BaseType>> =
	// `extends unknown` is always going to be the case and is used to convert any union into a [distributive conditional type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
	BaseType extends unknown
		? SimplifyDeep<
		// Pick just the keys that are optional from the base type.
		OmitDeep<BaseType, KeyPaths> &
		// Pick the keys that should be required from the base type and make them required.
		RequiredDeep<PickDeep<BaseType, KeyPaths>>
		>
		: never;
