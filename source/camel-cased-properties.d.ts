import type {CamelCase, CamelCaseOptions, _DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';

/**
Convert object properties to camel case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link CamelCasedPropertiesDeep}
@see {@link CamelCase}

@example
```
import type {CamelCasedProperties} from 'type-fest';

interface User {
	UserId: number;
	UserName: string;
}

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom',
};

const preserveConsecutiveUppercase: CamelCasedProperties<{fooBAR: string}, {preserveConsecutiveUppercase: true}> = {
	fooBAR: 'string',
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQIYhQGxwGcUATABSglVmBSIF84AzKkOAciVQFpn6YHANwAoEcAB2MFFGbYAxmgCqJKBhEBIFTICSpAFxwJAVxAAjGaK2qAcrhSGiMKJIDmohmPkQJTuFHpjfBhDHDxCbBIKKhoYOiIAHm0oAD44AF51DWNVPUMARgAaTRyZOzxDDgAVCBAOYoZREW9feDAA1QA3FEwfEnljOO6lMBp5SIc4MIJiMkpqGTj6BPRmCAgAIQBBACVHZzcGQox2+hlu3t8UAaGUEbGJw2djFAY0zPRNNc3dyqcXCSueoiRpAA)

@category Change case
@category Template literal
@category Object
*/
export type CamelCasedProperties<Value, Options extends CamelCaseOptions = {}> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Value
		: {
			[K in keyof Value as
			CamelCase<K, ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>>
			]: Value[K];
		};

export {};
