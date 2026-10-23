import type {CamelCaseString} from './camel-case-string.d.ts'; // For `@link`
import type {CasedString} from './internal/index.d.ts';
import type {KebabCaseString} from './kebab-case-string.d.ts'; // For `@link`
import type {PascalCaseString} from './pascal-case-string.d.ts'; // For `@link`
import type {ScreamingSnakeCaseString} from './screaming-snake-case-string.d.ts'; // For `@link`
import type {SnakeCase} from './snake-case.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
A `string` that is in snake case, like `'foo_bar'`.

Returns the string when {@link SnakeCase} leaves it unchanged, and `never` otherwise. The string must be a non-empty literal with no ASCII punctuation other than `_`. Every member of a union must be valid.

Put this type on a generic parameter, as in the last example. A plain property typed `SnakeCase<string>` accepts any string.

Use-cases:
- Require a database column name or a query parameter to be in snake case.
- Check a hand-written field name in a config file.

@example
```
import type {SnakeCaseString} from 'type-fest';

type A = SnakeCaseString<'foo_bar'>;
//=> 'foo_bar'

type B = SnakeCaseString<'fooBar'>;
//=> never

type C = SnakeCaseString<string>;
//=> never
```

@example
```
import type {SnakeCaseString} from 'type-fest';

declare function defineColumn<Name extends string>(column: {name: SnakeCaseString<Name>; type: 'text' | 'integer'}): Name;

defineColumn({name: 'full_name', type: 'text'});

// @ts-expect-error
defineColumn({name: 'fullName', type: 'text'});
// Error: Type 'string' is not assignable to type 'never'.
```

@see {@link SnakeCase}
@see {@link CamelCaseString}
@see {@link KebabCaseString}
@see {@link PascalCaseString}
@see {@link ScreamingSnakeCaseString}

@category Change case
@category Template literal
*/
export type SnakeCaseString<
	Value extends string,
	Options extends WordsOptions = {},
> = CasedString<Value, SnakeCase<Value, Options>, '_'>;

export {};
