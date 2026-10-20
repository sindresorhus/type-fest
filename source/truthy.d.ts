import type {Falsy} from './falsy.d.ts';
import type {LiteralUnion} from './literal-union.d.ts'; // For `@link`

/**
Remove the falsy types from the given type, like `if (value)` does.

Use-cases:
- Type the result of filtering out falsy values, which TypeScript does not do for `array.filter(Boolean)`.
- Type a function that removes falsy values, like `compact()`.

@example
```
import type {Truthy} from 'type-fest';

type A = Truthy<'a' | '' | 0 | 1 | null | undefined>;
//=> 'a' | 1

type B = Truthy<boolean | undefined>;
//=> true

function compact<Value>(array: readonly Value[]): Array<Truthy<Value>> {
	return array.filter((value): value is Truthy<Value> => Boolean(value));
}

const values = compact(['a', '', undefined]);
//=> string[]
```

Note: TypeScript has no type for a non-zero number or a non-empty string, so the falsy values of a wide type cannot be removed. For example, `Truthy<number>` is `number` and `Truthy<string>` is `string`.

Note: In a type guard like `value is Truthy<Value>`, TypeScript also narrows the `else` branch, so `string | undefined` becomes `undefined` there, even though the value can be `''`. TypeScript has no [one-sided type guards](https://github.com/microsoft/TypeScript/issues/15048) that only narrow the `true` branch. `array.filter()` only uses the `true` branch, so it is not affected. Use a guard for {@link Falsy `Falsy`} to also narrow the `else` branch correctly.

Note: Like `NonNullable`, it turns `'a' | (string & {})` into `string`. Use {@link LiteralUnion `LiteralUnion`} instead of `string & {}` to keep the literals.

It works like `Exclude<Type, Falsy>`, but it also removes `void` and turns `unknown` into `{}`, like `if (value)` does. This also makes a generic `Truthy<Value>` assignable to `{}`.

@category Utilities
*/
export type Truthy<Type> = NonNullable<Exclude<Type, Falsy | void>>;

export {};
