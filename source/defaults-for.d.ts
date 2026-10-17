import type {OptionalKeysOf} from './optional-keys-of.d.ts';

/**
Create the type of a defaults object for the given options type, with only its optional keys, made required.

Use-case: You keep the default options in an object and merge it with the user's options. This type makes it a type error to add an option without adding its default, to misspell a key, or to give a default for an option that the user must always pass.

`undefined` is removed from the type of each default, even with `exactOptionalPropertyTypes` disabled or an option typed as `Type | undefined`, because an `undefined` default is the same as having none. Use `Except` to leave out the options that have no default.

@example
```
import type {DefaultsFor, Except} from 'type-fest';

type Options = {
	url: string;
	retries?: number;
	timeout?: number;
	signal?: AbortSignal;
};

// `signal` has no default, so leave it out with `Except`.
type Defaults = DefaultsFor<Except<Options, 'signal'>>;
//=> {retries: number; timeout: number}

const defaults = {
	retries: 2,
	timeout: 10_000,
} satisfies Defaults;

function request(options: Options) {
	// The merged options always have a value for the options with a default.
	const {retries} = {...defaults, ...options};
	//=> number
}

// A missing default is a type error.
// @ts-expect-error
const missingDefault = {retries: 2} satisfies Defaults;

// A default for an option that the user must always pass is a type error.
// @ts-expect-error
const requiredOptionDefault = {url: 'https://example.com', retries: 2, timeout: 10_000} satisfies Defaults;

// A union of options gives a union of defaults.
type SourceDefaults = DefaultsFor<{type: 'file'; encoding?: string} | {type: 'url'; timeout?: number}>;
//=> {encoding: string} | {timeout: number}
```

Known limitations:
- A misspelled key and a default for a required key are only rejected by the excess property check, so they are rejected in an object literal, as with `satisfies`, but not when you assign an object from a variable.

@category Object
*/
export type DefaultsFor<Options extends object> =
	Options extends unknown // To get the defaults of each member of a union separately.
		? {[Key in keyof Options as Key extends OptionalKeysOf<Options> ? Key : never]-?: Exclude<Options[Key], undefined>}
		: never;

export {};
