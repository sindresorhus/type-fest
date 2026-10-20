import type {Truthy} from './truthy.d.ts'; // For `@link`

/**
Matches any [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value.

`NaN` and `document.all` are also falsy, but they are not included. TypeScript types them as `number` and `HTMLAllCollection`, and these types also include truthy values.

Use-cases:
- Write a type guard for falsy values. Unlike a guard for truthy values, it also narrows the `else` branch correctly.
- Type the falsy values that a function ignores, like `isActive && 'active'` in a function that joins class names.

@example
```
import type {Falsy} from 'type-fest';

function isFalsy(value: unknown): value is Falsy {
	return !value;
}

declare const nickname: string | undefined;

if (isFalsy(nickname)) {
	const missingNickname = nickname;
	//=> '' | undefined
} else {
	const presentNickname = nickname;
	//=> string
}
```

Use {@link Truthy `Truthy`} to remove the falsy types from a type.

@category Utilities
*/
export type Falsy = false | 0 | 0n | '' | null | undefined;

export {};
