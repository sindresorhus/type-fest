import type {UnwrapBrand} from './internal/object.d.ts';
import type {Tagged} from './tagged.d.ts'; // For `@link`
import type {StringToNumber} from './string-to-number.d.ts'; // For `@link`

/**
Converts a boolean string to a boolean literal.

Use-cases:
- Type a value that arrives as a string, such as an environment variable or a URL parameter, but is known to hold `'true'` or `'false'`.

@example
```
import type {StringToBoolean} from 'type-fest';

type A = StringToBoolean<'true'>;
//=> true

type B = StringToBoolean<'false'>;
//=> false

type C = StringToBoolean<'true' | 'maybe'>;
//=> true
```

Note: A string that does not exactly spell a boolean literal, like `'True'` or `'1'`, produces `never`. A non-literal `string`, `${boolean}`, or `any` produces `boolean`, since the exact literal is unknown.

@example
```
import type {StringToBoolean} from 'type-fest';

type D = StringToBoolean<'True'>;
//=> never

type E = StringToBoolean<'1'>;
//=> never

type F = StringToBoolean<string>;
//=> boolean
```

A branded string is unwrapped first, so a {@link Tagged} `'true'` parses to the plain `true`, like {@link StringToNumber}.

@see {@link StringToNumber}

@category String
@category Template literal
*/
// The `string` branch widens `string` and `any` to `boolean`, and `never` distributes to `never`.
export type StringToBoolean<S extends string> = _StringToBoolean<S extends object ? UnwrapBrand<S> : S>;

type _StringToBoolean<S extends string> =
	S extends `${infer Value extends boolean}`
		? Value
		: string extends S
			? boolean
			: never;

export {};
