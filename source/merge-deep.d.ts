import {ConditionalExcept} from './conditional-except';
import {ArrayHead, ArrayTail} from './internal';

/**
MergeDeep options.

@param strict Properties set to `undefined` value are skipped when set to `true` (default).

@see MergeDeep
*/
export interface MergeDeepOptions {
  strict?: boolean;
}

/**
Represents an unknown record.
*/
type UnknownRecord = Record<string, unknown>;

/**
`Unwrap` is like `Simplify` it flatten the type output to improve type hints shown in editors.
Unfortunately Simplify does not support the case where the type cannot be flattened.

@see Simplify
*/
type Unwrap<Type> = Type extends UnknownRecord
  ? {[Key in keyof Type]: Type[Key]}
  : Type;

/**
Determines the value to be returned according to the type of the `Source` and `Destination`.

If both are records, returns the result of the merge.
Otherwise returns the `Source` if present or the `Destination` if nothing matches.
*/
type MergeDeepRecord<Destination, Source, Key, Options> =
  Key extends keyof Destination
    ? Key extends keyof Source
      ? Destination[Key] extends UnknownRecord
        ? MergeDeep<Destination[Key], Source[Key], Options>
        : Source[Key]
      : Destination[Key]
    : Key extends keyof Source
      ? Source[Key]
      : never;

/**
Determines the value to be returned according to the type of the `Source` and `Destination`.

If both are array, returns the result of the merge, otherwise returns the `Source`.
*/
type MergeDeepArray<Destination, Source, Options> =
  Destination extends UnknownArray
    ? Source extends UnknownArray
      ? ArrayMergeDeep<Destination, Source, Options>
      : Source
    : Source;

/**
Returns the union of the keys of both types.
*/
type Keyof<Destination, Source> = keyof Destination | keyof Source;

/**
Determines the value to be returned according to the type of the `Source` and `Destination`.

If both are mergeable types, returns the result of the merge.
Otherwise returns the `Source` if present or the `Destination` if nothing matches.
*/
type MergeDeepValue<
  Destination,
  Source,
  Key extends Keyof<Destination, Source>,
  Options,
> = Key extends keyof Source
  ? Source[Key] extends UnknownRecord
    ? MergeDeepRecord<Destination, Source, Key, Options>
    : Source[Key] extends UnknownArray
			? Key extends keyof Destination
				? MergeDeepArray<Destination[Key], Source[Key], Options>
				: Source[Key]
			: Source[Key]
  : Key extends keyof Destination
  ? Destination[Key]
  : never;

/**
Represents an unknown array.
*/
type UnknownArray = readonly unknown[];

/**
Determines the value to be returned according to the type of the `Source` and `Destination`.

If both are mergeable records, returns the result of the merge, otherwise returns the `Source`.
*/
type ArrayMergeDeepValue<Destination, Source, Options> =
  Destination extends UnknownRecord
    ? Source extends UnknownRecord
      ? Unwrap<MergeDeep<Destination, Source, Options>>
      : Source
    : Source;

/**
Merge two array recursively into a new array.
*/
type ArrayMergeDeep<
  Destination extends UnknownArray,
  Source extends UnknownArray,
  Options extends MergeDeepOptions = {strict: true},
> = Destination extends []
  ? Source
  : Source extends []
  ? Destination
  : [
      ArrayMergeDeepValue<ArrayHead<Destination>, ArrayHead<Source>, Options>,
      ...ArrayMergeDeep<ArrayTail<Destination>, ArrayTail<Source>>,
    ];

/**
Merge two types recursively into a new type.

Properties set to `undefined` value are **preserved**.
*/
type MergeDeepLazy<Destination, Source, Options> = {
  [Key in Keyof<Destination, Source>]: Unwrap<
    MergeDeepValue<Destination, Source, Key, Options>
  >;
};

/**
Merge two types recursively into a new type.

Properties set to `undefined` value are **skipped**.
*/
type MergeDeepStrict<Destination, Source, Options> = ConditionalExcept<
  MergeDeepLazy<Destination, Source, Options>,
  undefined
>;

/**
Merge two types recursively into a new type.

Properties set to `undefined` value are skipped
when `strict` option is set to `true` (default).

@example
```
type Foo = {foo: string; bar: {id: string; label: string}};
type Bar = {foo: number; bar: {id: number; nop: undefined}};

type FooBar = MergeDeep<Foo, Bar>;

// {
// 	foo: number;
// 	bar: {
// 		id: number;
// 		label: string;
// 	}
// }

type FooBarLazy = MergeDeep<Foo, Bar, {strict:false}>;

// {
// 	foo: number;
// 	bar: {
// 		id: number;
// 		label: string;
//		nop: undefined;
// 	}
// }
```

@category Object
*/
export type MergeDeep<
  Destination,
  Source,
  Options extends MergeDeepOptions = {strict: true},
> = Options['strict'] extends true
  ? MergeDeepStrict<Destination, Source, Options>
  : MergeDeepLazy<Destination, Source, Options>;
