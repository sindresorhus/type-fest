import type {RequiredKeysOf} from './required-keys-of.d.ts';

/**
Remove all optional keys from an object type.

This is useful when you want to create a type that only contains required properties, stripping away any optional ones.

@example
```
import type {OmitOptional} from 'type-fest';

type User = {
	name: string;
	surname: string;
	luckyNumber?: number;
};

type MinimalUser = OmitOptional<User>;
// {name: string; surname: string}
```

@category Utilities
@category Object
*/
export type OmitOptional<ObjectType extends object> = {
	[Key in RequiredKeysOf<ObjectType>]: ObjectType[Key];
};
