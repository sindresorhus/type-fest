/**
Create a type that requires exactly one of the given properties and disallows more. The remaining properties are kept as is.

Use-cases:
- Creating interfaces for components that only need one of the properties to display properly.
- Declaring generic properties in a single place for a single use-case that gets narrowed down via `RequireExactlyOne`.

The caveat with `RequireExactlyOne` is that TypeScript doesn't always know at compile time every property that will exist at runtime. Therefore `RequireExactlyOne` can't do anything to prevent extra properties it doesn't know about.

@example
```
import {RequireExactlyOne} from 'type-fest';

type Responder = {
	text: () => string;
	json: () => string;
	secure: boolean;
};

const responder: RequireExactlyOne<Responder, 'text' | 'json'> = {
	// Adding a `text` property here would cause a compile error.

	json: () => '{"message": "ok"}',
	secure: true
};
```
*/
export type RequireExactlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> =
	{[Key in KeysType]: (
		Required<Pick<ObjectType, Key>> &
		Partial<Record<Exclude<KeysType, Key>, never>>
	)}[KeysType] & Omit<ObjectType, KeysType>;
