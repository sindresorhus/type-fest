/**
Create an object type that disallows the given keys.

Intersect with another object type to reject deprecated options or make configuration branches mutually exclusive. This does not remove properties from the other type.

Uses optional `never` properties. With `exactOptionalPropertyTypes` enabled, named keys cannot be supplied, even as `undefined`.

@example
```
import type {RequireNone} from 'type-fest';

type DeprecatedOptions = RequireNone<'legacyMode' | 'callback'>;
//=> {legacyMode?: never; callback?: never}

type Options = {url: string} & DeprecatedOptions;

const options: Options = {url: 'https://example.com'};

// @ts-expect-error
const deprecated: Options = {url: 'https://example.com', legacyMode: true};
```

@example
```
import type {RequireNone} from 'type-fest';

type Config =
	| ({filePath: string} & RequireNone<'content'>)
	| ({content: string} & RequireNone<'filePath'>);

const config: Config = {filePath: './config.json'};

// @ts-expect-error
const mixed: Config = {filePath: './config.json', content: '{}'};
```

Note: `RequireNone<never>` produces `{}`, which does not enforce an empty object. Broad keys (`string`, `number`, `symbol`, or template literal patterns) produce index signatures that allow `undefined` values. Properties absent from a value's static type cannot be checked.

@category Object
*/
export type RequireNone<KeysType extends PropertyKey> = {[Key in KeysType]?: never};

export {};
