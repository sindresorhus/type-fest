/**
Allow any object type to be used in the `extends` clause of an interface or the `implements` clause of a class, which otherwise only accept a type name.

Types like `Config['server']`, `typeof defaultOptions`, and `{port: number}` are valid object types, but not type names, so TypeScript rejects them in these clauses.

Use-cases:
- Extend the type of a property, like `Config['server']` or `React.JSX.IntrinsicElements['a']`.
- Extend the type of a value, like `typeof defaultOptions`.
- Implement the type of a property or a value in a class.

Note: The type must still be an object type or an intersection of object types with statically known members. Unions, primitives, and types whose properties are not known until a type argument is given (like `AsExtendable<T>` or `AsExtendable<Partial<T>>` in a generic interface) are not accepted, just like when you use a type name.

@example
```
import type {AsExtendable} from 'type-fest';

type Config = {
	server: {
		host: string;
		port: number;
	};
};

// `interface ServerOptions extends Config['server'] {}` is an error: “An interface can only extend an identifier/qualified-name with optional type arguments.”
interface ServerOptions extends AsExtendable<Config['server']> {
	timeout: number;
}

const defaultOptions = {
	retries: 2,
	timeout: 1000,
};

// `interface ClientOptions extends typeof defaultOptions {}` is a syntax error.
interface ClientOptions extends AsExtendable<typeof defaultOptions> {
	signal?: AbortSignal;
}

class Client implements AsExtendable<typeof defaultOptions> {
	retries = 3;
	timeout = 5000;
}
```

You can do the same without this type by giving the type a name first: `type ServerConfig = Config['server'];` and then `interface ServerOptions extends ServerConfig {}`.

The type returns the given type as is. It works because `AsExtendable<…>` is a type name with a type argument, which these clauses accept.

@see https://github.com/microsoft/TypeScript/issues/31843

@category Type
*/
export type AsExtendable<Type> = Type;

export {};
