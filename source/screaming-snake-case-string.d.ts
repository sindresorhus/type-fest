import type {CamelCaseString} from './camel-case-string.d.ts'; // For `@link`
import type {CasedString} from './internal/index.d.ts';
import type {KebabCaseString} from './kebab-case-string.d.ts'; // For `@link`
import type {PascalCaseString} from './pascal-case-string.d.ts'; // For `@link`
import type {ScreamingSnakeCase} from './screaming-snake-case.d.ts';
import type {SnakeCaseString} from './snake-case-string.d.ts'; // For `@link`
import type {WordsOptions} from './words.d.ts';

/**
A `string` that is in screaming snake case, like `'FOO_BAR'`.

Returns the string when {@link ScreamingSnakeCase} leaves it unchanged, and `never` otherwise. The string must be a non-empty literal with no ASCII punctuation other than `_`. Every member of a union must be valid.

Put this type on a generic parameter, as in the last example. A plain property typed `ScreamingSnakeCase<string>` accepts any uppercase string, like `'FOO-BAR'`.

Use-cases:
- Require an environment variable name or a constant to be in screaming snake case.
- Check a hand-written setting name in a config file.

@example
```
import type {ScreamingSnakeCaseString} from 'type-fest';

type A = ScreamingSnakeCaseString<'FOO_BAR'>;
//=> 'FOO_BAR'

type B = ScreamingSnakeCaseString<'foo_bar'>;
//=> never

type C = ScreamingSnakeCaseString<string>;
//=> never
```

@example
```
import type {ScreamingSnakeCaseString} from 'type-fest';

declare function defineVariable<Name extends string>(variable: {name: ScreamingSnakeCaseString<Name>; value: string}): Name;

defineVariable({name: 'LOG_LEVEL', value: 'debug'});

// @ts-expect-error
defineVariable({name: 'logLevel', value: 'debug'});
// Error: Type 'string' is not assignable to type 'never'.
```

@see {@link ScreamingSnakeCase}
@see {@link CamelCaseString}
@see {@link KebabCaseString}
@see {@link PascalCaseString}
@see {@link SnakeCaseString}

@category Change case
@category Template literal
*/
export type ScreamingSnakeCaseString<
	Value extends string,
	Options extends WordsOptions = {},
> = CasedString<Value, ScreamingSnakeCase<Value, Options>, '_'>;

export {};
