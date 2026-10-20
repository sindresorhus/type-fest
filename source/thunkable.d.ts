import type {Arrayable} from './arrayable.d.ts'; // For `@link`
import type {Promisable} from './promisable.d.ts'; // For `@link`

/**
Create a type that represents either the value or a function that returns the value.

It works like {@link Arrayable `Arrayable`} and {@link Promisable `Promisable`}, but wraps the value in a function instead of an array or a promise.

Use-cases:
- Let the caller defer work that the callee may never need. For example, the `plugins` option of a build tool, where the consumer can postpone an expensive dynamic `import()` until the build runs.
- Type a lazy initializer, like the first argument of React's `useState`.

@example
```
import type {Promisable, Thunkable} from 'type-fest';

type Plugin = {name: string};

type Options = {
	readonly plugins: Thunkable<Promisable<readonly Plugin[]>>;
};

async function loadPlugins(options: Options): Promise<readonly Plugin[]> {
	const {plugins} = options;

	return typeof plugins === 'function' ? plugins() : plugins;
}

// The plugins are available immediately
await loadPlugins({plugins: [{name: 'minify'}]});

// The plugins are loaded later, when `loadPlugins()` runs
await loadPlugins({plugins: async () => [{name: 'minify'}]});
```

Note: The function form is `() => Value`, so a function that requires an argument, like `(input: string) => string`, is not part of `Thunkable<string>`. To accept such a function as the value, use `Thunkable<(input: string) => string>`.

Note: If `Value` is itself a function type, the function form and a value that is a function cannot be told apart. Like {@link Arrayable `Arrayable`} with arrays, the type is meant for values that are not functions.

Note: Inside a generic function, `typeof value === 'function'` narrows to `Value & Function | (() => Value)`, which TypeScript does not let you call. Narrow with a type guard that returns `value is () => Value` instead.

@category Function
*/
export type Thunkable<Value> = Value | (() => Value);

export {};
