import type {CamelCaseOptions, _DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {PascalCase} from './pascal-case.d.ts';

/**
Convert object properties to pascal case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link PascalCase}
@see {@link PascalCasedPropertiesDeep}

@example
```
import type {PascalCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom',
};

const preserveConsecutiveUppercase: PascalCasedProperties<{fooBAR: string}, {preserveConsecutiveUppercase: true}> = {
	FooBAR: 'string',
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gBQIYGcDG2ANgMJ4oAmmUEqswKuAvnAGY0hwDkSqAtK0YwuAbgBQY4ADsYKKK2z40AVVxyMYgJABXNVACSFAFxwp2kACM54nXoBy2EChO4YUaQHNxTCfghTXOChGbSIYExwCYjI1Kho6GAZcAB5VOQA+OABeDU00g2M4AEYAGi18hycTLgAVCBAuMqZxMT8A+DBgvQA3FBJ-NXxtRN7lMDpCNQi8QlJyONo5RMZk9FYICAAhAEEAJRc3TyYSjE7GOV7+gJQhkZQxifITN20UJkyc9C0AMQ2d-e4rncUg8jTEzSAA)

@category Change case
@category Template literal
@category Object
*/
export type PascalCasedProperties<Value, Options extends CamelCaseOptions = {}> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Value
		: {[K in keyof Value as PascalCase<K, ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>>]: Value[K]};

export {};
