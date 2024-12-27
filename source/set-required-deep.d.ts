import type {NonRecursiveType} from './internal';
import type {Paths} from './paths';
import type {PickDeep} from './pick-deep';
import type {SimplifyDeep} from './simplify-deep';

/**
Create a type that makes the given keys required. You can specify deeply nested key paths. The remaining keys are kept as is.

Use-case: You want to define as required only a some nested keys inside a model.

@example
```
import type {SetRequiredDeep} from 'type-fest';

type Foo = {
	a?: number;
	b?: string;
	c?: {
		d?: number
	}[]
}

type SomeRequiredDeep = SetRequiredDeep<Foo, 'a' | `c.${number}.d`>;
// type SomeRequiredDeep = {
// 	a: number; // Is now required
// 	b?: string;
// 	c: {
//    d: number // Is now required
//  }[]
// }
```

@category Object
*/
export type SetRequiredDeep<
	BaseType,
	KeyPaths extends Paths<BaseType>,
> = BaseType extends NonRecursiveType
	? BaseType
	: SimplifyDeep<
	BaseType extends Array<infer _>
		? Array<
		SetRequiredDeep<
		NonNullable<BaseType[number]>,
		KeyPaths extends `${number}.${infer Rest extends Paths<NonNullable<BaseType[number]>>}`
			? Rest
			: never
		>
		>
		: Omit<BaseType, RootKeys<BaseType, KeyPaths> | NonRootKeys<BaseType, KeyPaths>> &
		Required<
		Pick<
		BaseType,
		RootKeys<BaseType, KeyPaths>
		>
		> & {
			[K in keyof Pick<
			BaseType,
			NonRootKeys<
			BaseType,
			KeyPaths
			>
			>]: SetRequiredDeep<
			NonNullable<BaseType[K]>,
			Rest<BaseType, KeyPaths, K>
			>

		}
	>;

// Converts string paths to actual BaseType keys
type ExtractKeys<
	BaseType,
	KeyPaths extends Paths<BaseType>,
> = KeyPaths extends never
	? never
	: Extract<keyof BaseType, keyof PickDeep<BaseType, KeyPaths>>;

type RootKeys<BaseType, KeyPaths extends Paths<BaseType>> = ExtractKeys<
BaseType,
KeyPaths extends `${string}.${string}` ? never : KeyPaths
>;
type NonRootKeys<BaseType, KeyPaths extends Paths<BaseType>> = ExtractKeys<
BaseType,
KeyPaths extends `${string}.${string}` ? KeyPaths : never
>;

type KeyToString<K> = K extends
| string
| number
| bigint
| boolean
| null
| undefined
	? `${K}`
	: never;
type Rest<
	BaseType,
	KeyPaths extends Paths<BaseType>,
	Keys extends keyof BaseType,
> = KeyPaths extends `${KeyToString<Keys>}.${infer R extends Paths<NonNullable<BaseType[Keys]>>}`
	? R
	: never;
