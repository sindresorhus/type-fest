import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {DelimiterCasedProperties} from './delimiter-cased-properties.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert object properties to kebab case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link KebabCase}
@see {@link KebabCasedPropertiesDeep}

@example
```
import type {KebabCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom',
};

const splitOnNumbers: KebabCasedProperties<{line1: string}, {splitOnNumbers: true}> = {
	'line-1': 'string',
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gaRQIwIY4DCeAzigCYAKUEqswKJAvnAGY0hwDkSqAtK0YwuAbgBQY4ADsYKKKzwBjNAFUyUDGICQAV3UBJcgC44UnSBxzxu9QDk8IFCZIwo0gObimExRCku4KEYdABsYE2x8IlIKalo5GAYSAB41OQA+OABeTS0uPTk+YHIuEwBGABptfPU+KQcUUu4AFQgQLiqmcTFff3gSMBDgGAB5KVtzSygSCNwCYjIqGjpExmT0IakUMudXDyYKjAGh0fHJuRmEKB0UJkyc9GrNlD4ypq4XNyl3DrEuoA)

@category Change case
@category Template literal
@category Object
*/
export type KebabCasedProperties<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCasedProperties<Value, '-', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};
