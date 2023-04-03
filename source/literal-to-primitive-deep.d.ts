import type {LiteralToPrimitive} from './literal-to-primitive';
import type {OmitIndexSignature} from './omit-index-signature';

/**
Like `LiteralToPrimitive`, but it converts literal types inside an object or array deeply.
i.e. Given a constant object, return a new object type with the same keys but with all the values converted to primitives.
@see LiteralToPrimitive

Use-case: Deal with data that is imported from a JSON file.

@example
```
import type {LiteralToPrimitiveDeep, TsConfigJson} from 'type-fest';
import tsconfig from 'path/to/tsconfig.json';

function doSomethingWithTSConfig(config: LiteralToPrimitiveDeep<TsConfigJson>) { ... }

// No casting is needed to pass the type check
doSomethingWithTSConfig(tsconfig);

// If LiteralToPrimitiveDeep is not used, you need to cast the imported data like this:
doSomethingWithTSConfig(tsconfig as TsConfigJson);
```

@category Type
@category Object
*/
export type LiteralToPrimitiveDeep<T> = T extends object
	? T extends Array<infer U>
		? Array<LiteralToPrimitiveDeep<U>>
		: {
			[K in keyof OmitIndexSignature<T>]: LiteralToPrimitiveDeep<T[K]>;
		}
	: LiteralToPrimitive<T>;
