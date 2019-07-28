/**
Create a type that requires only one of the given properties, but not more. The remaining properties are kept as is.

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
