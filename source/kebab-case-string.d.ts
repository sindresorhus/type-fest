import type {CamelCaseString} from './camel-case-string.d.ts'; // For `@link`
import type {CasedString} from './internal/index.d.ts';
import type {KebabCase} from './kebab-case.d.ts';
import type {PascalCaseString} from './pascal-case-string.d.ts'; // For `@link`
import type {ScreamingSnakeCaseString} from './screaming-snake-case-string.d.ts'; // For `@link`
import type {SnakeCaseString} from './snake-case-string.d.ts'; // For `@link`
import type {WordsOptions} from './words.d.ts';

/**
A `string` that is in kebab case, like `'foo-bar'`.

Returns the string when {@link KebabCase} leaves it unchanged, and `never` otherwise. The string must be a non-empty literal with no ASCII punctuation other than `-`. Every member of a union must be valid.

Put this type on a generic parameter, as in the last example. A plain property typed `KebabCase<string>` accepts any string.

Use-cases:
- Require a CSS class name, an HTML attribute, or a CLI flag to be in kebab case.
- Check a hand-written identifier in a config file.

@example
```
import type {KebabCaseString} from 'type-fest';

type A = KebabCaseString<'foo-bar'>;
//=> 'foo-bar'

type B = KebabCaseString<'fooBar'>;
//=> never

type C = KebabCaseString<string>;
//=> never
```

@example
```
import type {KebabCaseString} from 'type-fest';

declare function addClass<Name extends string>(name: KebabCaseString<Name>): Name;

addClass('my-class');

// @ts-expect-error
addClass('myClass');
// Error: Argument of type '"myClass"' is not assignable to parameter of type 'never'.
```

@see {@link KebabCase}
@see {@link CamelCaseString}
@see {@link PascalCaseString}
@see {@link SnakeCaseString}
@see {@link ScreamingSnakeCaseString}

@category Change case
@category Template literal
*/
export type KebabCaseString<
	Value extends string,
	Options extends WordsOptions = {},
> = CasedString<Value, KebabCase<Value, Options>, '-'>;

export {};
