import type {CamelCaseOptions} from './camel-case.d.ts';
import type {CamelCaseString} from './camel-case-string.d.ts'; // For `@link`
import type {CasedString} from './internal/index.d.ts';
import type {KebabCaseString} from './kebab-case-string.d.ts'; // For `@link`
import type {PascalCase} from './pascal-case.d.ts';
import type {ScreamingSnakeCaseString} from './screaming-snake-case-string.d.ts'; // For `@link`
import type {SnakeCaseString} from './snake-case-string.d.ts'; // For `@link`

/**
A `string` that is in pascal case, like `'FooBar'`.

Returns the string when {@link PascalCase} leaves it unchanged, and `never` otherwise. The string must be a non-empty literal with no ASCII punctuation, except leading underscores kept by the `preserveLeadingUnderscores` option. Every member of a union must be valid.

Put this type on a generic parameter, as in the last example. A plain property typed `PascalCase<string>` accepts any string.

Use-cases:
- Require a component or type name to be in pascal case.
- Check a hand-written type name in a config file for a code generator.

@example
```
import type {PascalCaseString} from 'type-fest';

type A = PascalCaseString<'FooBar'>;
//=> 'FooBar'

type B = PascalCaseString<'fooBar'>;
//=> never

type C = PascalCaseString<string>;
//=> never
```

@example
```
import type {PascalCaseString} from 'type-fest';

declare function defineComponent<Name extends string>(component: {name: PascalCaseString<Name>}): Name;

defineComponent({name: 'SubmitButton'});

// @ts-expect-error
defineComponent({name: 'submitButton'});
// Error: Type 'string' is not assignable to type 'never'.
```

@see {@link PascalCase}
@see {@link CamelCaseString}
@see {@link KebabCaseString}
@see {@link SnakeCaseString}
@see {@link ScreamingSnakeCaseString}

@category Change case
@category Template literal
*/
export type PascalCaseString<
	Value extends string,
	Options extends CamelCaseOptions = {},
> = CasedString<Value, PascalCase<Value, Options>, '_'>;

export {};
