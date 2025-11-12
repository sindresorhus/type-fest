import type {LiteralToPrimitive} from './literal-to-primitive.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';

/**
Like `LiteralToPrimitive` except it converts literal types inside an object or array deeply.

For example, given a constant object, it returns a new object type with the same keys but with all the values converted to primitives.

@see {@link LiteralToPrimitive}

Use-case: Deal with data that is imported from a JSON file.

@example
```
import type {LiteralToPrimitiveDeep} from 'type-fest';

const config = {
	appName: 'MyApp',
	version: '1.0.0',
	maxRetries: 3,
	enableLogging: true,
	apiUrl: 'https://api.myapp.com/v1',
} as const;

declare function updateConfig(newConfig: typeof config): void;

updateConfig({
	// @ts-expect-error
	appName: 'MyUpdatedApp',
	// Error: Type '"MyUpdatedApp"' is not assignable to type '"MyApp"'.

	// @ts-expect-error
	version: '2.0.0',
	// Error: Type '"2.0.0"' is not assignable to type '"1.0.0"'.

	// @ts-expect-error
	maxRetries: 1,
	// Error: Type '1' is not assignable to type '3'.

	// @ts-expect-error
	enableLogging: false,
	// Error: Type 'false' is not assignable to type 'true'.

	// @ts-expect-error
	apiUrl: 'https://api.myapp.com/v2',
	// Error: Type '"https://api.myapp.com/v2"' is not assignable to type '"https://api.myapp.com/v1"'.
});

declare function updateConfigFixed(newConfig: LiteralToPrimitiveDeep<typeof config>): void;

updateConfigFixed({
	appName: 'MyUpdatedApp',
	version: '2.0.0',
	maxRetries: 1,
	enableLogging: false,
	apiUrl: 'https://api.myapp.com/v2',
});
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gGWDFUCGANgCoQAKUoOwAbigCIopgC+cAZlBCHAORKoAtOxQBnGLwDcAKGkBjCADtxcBYvbAA5nAC8GaQEh8YMADl8IFAC4+AWUQBBE7wA0hulFHAlN3gEYAOgAGYNdDEHwADwAlFBhKMRsAZjcDFEV8ACNCFEwITU1gRU0beIBXFFTjYABVKEJfAAsYGDBRKwB6DuqAkERjMACFEA6aPzC2fFFVJXEZaQATFDlCfCg0djLFORhvRTgysAX8XABhJQ1NAApFFAB3c-UtUuQUCHYZp80AShsaCGAC3mh2OZwuWiu6EMXTgAAEYKJBChIqgdkioFwoIYBuZLL57DUjicUAsnGAwgYYQBRDHQGzEV58ABEBKJuFJJiZvDgwGmigg8CmXk0GWyaBgEAQjN4LMcnN4AVklI6cIRSJRyxg6Mx7jwXh8fAATMFQqlqbSoPTpUzjSEglyeXyBXAhVpRTkEJKBGgZYE7VzFdCVfDEcjUVq8DqDBEYnEEu04H4zSqaZirag+ONHXB+YLRML3eKvdKkgqlTCQ+rw9roIZ0lkcnkCkUShwiKJKkG4Km6XAGRneOx2yhubyc87XSKG0WpQPyiPA8rVaGNWjI7WjGBavUmi02p1ulvev0TENuKNDRTzWm+9bmq12l0en0BmeRjRDQ6x7mXfm3dPPVnH0mXvfcnyPF9T2GUY-ADaQWG+eYlhWNYNi2HY9gONkUEeS4ADFgEiEkbnuXDnjgbBcAIEhyEoEBqDoRhmAAHm9d5PkuAA+X44H+QFgWwsjNAIoiFkhbETFxaw7EQQlQRJMkKQ8fVFF8W1TXCKJYniYBEkTVJ6zFJtCmKGwh0IDsqi3OoGj4UDH0PYBj1faCPwmRCgA)

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

export {};
