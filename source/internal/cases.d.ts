import type {DelimiterCasedProperties} from '../delimiter-cased-properties.d.ts';
import type {PascalCasedProperties} from '../pascal-cased-properties.d.ts';
import type {CamelCasedProperties} from '../camel-cased-properties.d.ts';
import type {KebabCasedProperties} from '../kebab-cased-properties.d.ts';
import type {SnakeCasedProperties} from '../snake-cased-properties.d.ts';
import type {CamelCase, CamelCaseOptions} from '../camel-case.d.ts';
import type {DelimiterCase} from '../delimiter-case.d.ts';
import type {UnionToTuple} from '../union-to-tuple.d.ts';
import type {PascalCase} from '../pascal-case.d.ts';
import type {KebabCase} from '../kebab-case.d.ts';
import type {SnakeCase} from '../snake-case.d.ts';
import type {WordsOptions} from '../words.d.ts';
import type {Simplify} from '../simplify.d.ts';

/**
Represents the merged and flattened configuration options used across different casing strategies.

It recursively combines the option types of all case transformation strategies defined in `Cases`.

This is useful for normalizing the structure of options passed to `Case` implementations.
*/
export type CaseOptions<T = UnionToTuple<Cases[CaseKeys]['Opts']>, Acc = {}> =
	T extends [infer H, ...infer R]
		? CaseOptions<R, Acc & H>
		: Acc;

/**
Infer a Value from an object if found, else return the specified default value
*/
type InferDefault<
	Options extends CaseOptions,
	Key extends keyof Options,
	Default extends Options[Key],
> = Options[Key] extends infer Value
	? undefined extends Value
		? Default
		: Value
	: never;

/**
Defines the transformation logic for various string casing strategies and property casing strategies.

Each key in the object corresponds to a different case transformation variant (e.g., Camel, Pascal, Snake).

It returns both the type of options (`Opts`) accepted and the transformed result (`Type`).

More `Cases` can be added in future by following the same pattern.
*/
type Cases<Value = never, Options extends CaseOptions = {}> = {
	Camel: {
		Opts: CamelCaseOptions;
		Type: CamelCase<Value, Options>;
	};
	CamelProp: {
		Opts: CamelCaseOptions;
		Type: CamelCasedProperties<Value, Options>;
	};
	Pascal: {
		Opts: CamelCaseOptions;
		Type: PascalCase<Value, Options>;
	};
	PascalProp: {
		Opts: CamelCaseOptions;
		Type: PascalCasedProperties<Value, Options>;
	};
	Kebab: {
		Opts: WordsOptions;
		Type: KebabCase<Value, Options>;
	};
	KebabProp: {
		Opts: WordsOptions;
		Type: KebabCasedProperties<Value, Options>;
	};
	Snake: {
		Opts: WordsOptions;
		Type: SnakeCase<Value, Options>;
	};
	SnakeProp: {
		Opts: WordsOptions;
		Type: SnakeCasedProperties<Value, Options>;
	};
	Delimiter: {
		Opts: WordsOptions & {delimiter?: string}; // More Options can be added
		Type: DelimiterCase<Value, InferDefault<Options, 'delimiter', '#'>, Options>;
	}; //								↑ And Can be infered using thes type
	DelimiterProp: {
		Opts: WordsOptions & {delimiter?: string};
		Type: DelimiterCasedProperties<Value, InferDefault<Options, 'delimiter', '#'>, Options>;
	};
};

/**
Represents all keys of the `Cases` object, including both string and property casing strategies.
*/
export type CaseKeys = Simplify<keyof Cases>;

/**
Extracts only the string-based casing strategy keys from `Cases`.
Used when transforming standalone string values.
*/
export type StringCaseKeys = Exclude<CaseKeys, `${string}Prop`>;

/**
Extracts only the property-based casing strategy keys from `Cases`.
Used when transforming the keys of object types.
*/
export type PropCaseKeys = Exclude<CaseKeys, StringCaseKeys>;

/**
Main utility type to apply a selected case transformation to a given string or object.

The type of transformation (`Type`) is chosen from `Cases`, and it automatically infers the correct
options structure depending on the strategy (e.g., `delimiter` is added for Delimiter cases).

@example
```
type Phrase = 'foo bar_baz-case';

type T1 = Case<'Camel', Phrase>;
//=> 'fooBarBazCase'

type T2 = Case<'Kebab', Phrase>
//=> 'foo-bar-baz-case';

type T3 = Case<'Delimiter', Phrase, {delimiter: '#'}>
//=> 'foo#bar#baz#case';
```

@example
```
type Template = {
	'foo bar': string,
	bar_baz: number,
	baz1: 'foo',
};

type T = Case<'KebabProp', Template, {splitOnNumbers: true}>
//=> {
//   'foo-bar': string;
//   'bar-baz': number;
//   'baz-1': 'foo';
// };
```

@author benzaria
@category Change case
@category Template literal
*/
export type Case<
	Type extends CaseKeys, Value,
	Options extends Cases[Type]['Opts'] = {},
> = Cases<Value, Options>[Type]['Type'];
