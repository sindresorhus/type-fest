import type {ScreamingSnakeCase} from './screaming-snake-case.d.ts';
import type {WordsOptions} from './words.d.ts';
import type {ScreamingSnakeCasedPropertiesDeep} from './screaming-snake-cased-properties-deep.d.ts'; // For `@link`

/**
Convert top-level object properties to screaming snake case.

This can be useful when, for example, converting a configuration type into environment variable names.

@see {@link ScreamingSnakeCase}
@see {@link ScreamingSnakeCasedPropertiesDeep}

@example
```
import type {ScreamingSnakeCasedProperties} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

const result: ScreamingSnakeCasedProperties<User> = {
	USER_ID: 1,
	USER_NAME: 'Tom',
};

const splitOnNumbers: ScreamingSnakeCasedProperties<{line1: string}, {splitOnNumbers: true}> = {
	LINE_1: 'string',
};

const splitOnPunctuation: ScreamingSnakeCasedProperties<{'foo::bar': string}, {splitOnPunctuation: true}> = {
	FOO_BAR: 'string',
};
```

@category Change case
@category Template literal
@category Object
*/
export type ScreamingSnakeCasedProperties<
	Value,
	Options extends WordsOptions = {},
> = Value extends Function
	? Value
	: Value extends readonly unknown[]
		// Arrays pass through unchanged, since they have no properties to re-case.
		? Value
		: {[K in keyof Value as ScreamingSnakeCase<K, Options>]: Value[K]};

export {};
