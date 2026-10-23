import type {CamelCase, CamelCaseOptions} from './camel-case.d.ts';
import type {CasedString} from './internal/index.d.ts';
import type {KebabCaseString} from './kebab-case-string.d.ts'; // For `@link`
import type {PascalCaseString} from './pascal-case-string.d.ts'; // For `@link`
import type {ScreamingSnakeCaseString} from './screaming-snake-case-string.d.ts'; // For `@link`
import type {SnakeCaseString} from './snake-case-string.d.ts'; // For `@link`

/**
A `string` that is in camel case, like `'fooBar'`.

Returns the string when {@link CamelCase} leaves it unchanged, and `never` otherwise. The string must be a non-empty literal with no ASCII punctuation, except leading underscores kept by the `preserveLeadingUnderscores` option. Every member of a union must be valid.

Put this type on a generic parameter, as in the last example. A plain property typed `CamelCase<string>` accepts any string.

Use-cases:
- Require a JavaScript identifier or a JSON key to be in camel case.
- Check a hand-written field name in a config file.

@example
```
import type {CamelCaseString} from 'type-fest';

type A = CamelCaseString<'fooBar'>;
//=> 'fooBar'

type B = CamelCaseString<'foo-bar'>;
//=> never

type C = CamelCaseString<string>;
//=> never
```

@example
```
import type {CamelCaseString} from 'type-fest';

declare function defineHandler<Name extends string>(handler: {name: CamelCaseString<Name>}): Name;

defineHandler({name: 'onSubmit'});

// @ts-expect-error
defineHandler({name: 'on-submit'});
// Error: Type 'string' is not assignable to type 'never'.
```

@see {@link CamelCase}
@see {@link KebabCaseString}
@see {@link PascalCaseString}
@see {@link SnakeCaseString}
@see {@link ScreamingSnakeCaseString}

@category Change case
@category Template literal
*/
export type CamelCaseString<
	Value extends string,
	Options extends CamelCaseOptions = {},
> = CasedString<Value, CamelCase<Value, Options>, '_'>;

export {};
