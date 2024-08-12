import type {NonRecursiveType} from './internal';
import type {Paths} from './paths';
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
	? never
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
		: Omit<BaseType, RootRequiredKeys<BaseType, KeyPaths>> &
		Required<
		Pick<
		BaseType,
		Extract<KeyPaths, RootRequiredKeys<BaseType, KeyPaths>>
		>
		> & Partial<{
			[K in RootRequiredKeys<
			BaseType,
			Exclude<KeyPaths, RootRequiredKeys<BaseType, KeyPaths>>
			>]: SetRequiredDeep<
			NonNullable<BaseType[K]>,
			KeyPaths extends `${K}.${infer Rest extends Paths<NonNullable<BaseType[K]>>}`
				? Rest
				: never
			>;
		}>
	>;

// Extract the BaseType root keys from the KeyPaths
type RootRequiredKeys<BaseType, KeyPaths extends Paths<BaseType>> = Extract<
keyof BaseType,
KeyPaths extends `${infer Root}.${string}` ? Root : KeyPaths
>;
