import type {RequireExactlyOne} from './require-exactly-one.d.ts';
import type {IfNotAnyOrNever, RequireNone} from './internal/index.d.ts';
import type {If} from './if.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Create a type that requires exactly one of the given keys and disallows more, or none of the given keys. The remaining keys are kept as is.

@example
```
import type {RequireOneOrNone} from 'type-fest';

type Responder = RequireOneOrNone<{
	text: () => string;
	json: () => string;
	secure: boolean;
}, 'text' | 'json'>;

const responder1: Responder = {
	secure: true
};

const responder2: Responder = {
	text: () => '{"message": "hi"}',
	secure: true
};

const responder3: Responder = {
	json: () => '{"message": "ok"}',
	secure: true
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gJRQRwK7BQoDyAdiVAHITkC+cAZlBCHAORKoC0DKAzjDYBuAFAjOabH0ikAJiihwAvHGz5CJcsSo0UAHnQiAkDBQAPGAC44ACgCUygHxwBUYKQDmoowCs+Na3snFxg3T28+FABjPCJrACMICAAbFABDUlFaABp2Uws2OAAfdj8aNkdRESiaATgiaRp5KABGaykZZuUMY0iYuIQoPBQRWiqa0jqGzoUAJnb+GcUVQxNzK1sHJWc2dAAiEH4+NI8UPes9gAtgPdo2bN7o2JRrUOHR8dr4aaaFAGYFo05ApuqsyqRAlsdvtDnxjqdznA9hAANa3e6PfovQbvMZAA)

@category Object
*/
export type RequireOneOrNone<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> =
	IfNotAnyOrNever<ObjectType,
		If<IsNever<KeysType>,
			ObjectType,
			_RequireOneOrNone<ObjectType, If<IsAny<KeysType>, keyof ObjectType, KeysType>>
		>>;

type _RequireOneOrNone<ObjectType, KeysType extends keyof ObjectType> = (
	| RequireExactlyOne<ObjectType, KeysType>
	| RequireNone<KeysType>
) & Omit<ObjectType, KeysType>; // Ignore unspecified keys.

export {};
