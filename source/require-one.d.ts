/**
Create a type that requires only one of the given properties, but not more. The remaining properties are kept as is.

Use cases:
- Creating interfaces for components that only need one of the properties to display properly.
- Declaring generic properties in a single place for a single use case that get narrowed down via `RequireOne`.

The caveat with `RequireOne` is that TypeScript doesn't always know at compile time every property that will exist at runtime. Therefore `RequireOne` can't do anything to prevent extra properties it doesn't know about.

@example
```
import {RequireOne} from 'type-fest';

type Responder = {
	text: () => string;
	json: () => string;
	secure: boolean;
};

const responder: RequireOne<Responder, 'text' | 'json'> = {
	json: () => '{"message": "ok"}',
	secure: true
};
```
*/
export type RequireOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> =
	{[Key in KeysType]: (
		Required<Pick<ObjectType, Key>> &
		Partial<Record<Exclude<KeysType, Key>, never>>
	)}[KeysType] & Omit<ObjectType, KeysType>;
