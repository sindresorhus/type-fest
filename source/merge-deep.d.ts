interface MergeDeepOptions {
  strict?: boolean;
}

type UnknownRecord = Record<string, unknown>;

type Unwrap<Type> = Type extends UnknownRecord
  ? {[Key in keyof Type]: Type[Key]}
  : Type;

type MergeValue<Destination, Source, Key, Options> =
  Key extends keyof Destination
    ? Key extends keyof Source
      ? Destination[Key] extends UnknownRecord
        ? MergeDeep<Destination[Key], Source[Key], Options>
        : Source[Key]
      : Destination[Key]
    : Source[Key];

type Keyof<Destination, Source> = keyof Destination | keyof Source;

type MergeArrayValue<Destination, Source, Options> =
  Destination extends UnknownArray
    ? Source extends UnknownArray
      ? ArrayMerge<Destination, Source, Options>
      : Source
    : Source;

type GetValue<
  Destination,
  Source,
  Key extends Keyof<Destination, Source>,
  Options,
> = Key extends keyof Source
  ? Source[Key] extends UnknownRecord
    ? MergeValue<Destination, Source, Key, Options>
    : Source[Key] extends UnknownArray
			? Key extends keyof Destination
				? MergeArrayValue<Destination[Key], Source[Key], Options>
				: Source[Key]
			: Source[Key]
  : Key extends keyof Destination
  ? Destination[Key]
  : never;

type ExtractType<TType, TUnion> = {
  [Key in keyof TType]-?: TUnion extends TType[Key] ? Key : never;
}[keyof TType];

type OmitType<TType, TUnion> = Omit<TType, ExtractType<TType, TUnion>>;

type MergeDeepLazy<Destination, Source, Options> = {
  [Key in Keyof<Destination, Source>]: Unwrap<
    GetValue<Destination, Source, Key, Options>
  >;
};

type MergeDeepStrict<Destination, Source, Options> = OmitType<
  MergeDeepLazy<Destination, Source, Options>,
  undefined
>;

type ArrayHead<TArray> = TArray extends readonly [infer THead, ...unknown[]]
  ? THead
  : never;

type ArrayTail<TArray> = TArray extends readonly [unknown, ...infer TTail]
  ? TTail
  : [];

type UnknownArray = readonly unknown[];

type ArrayMergeValue<Destination, Source, Options> =
  Destination extends UnknownRecord
    ? Source extends UnknownRecord
      ? Unwrap<MergeDeep<Destination, Source, Options>>
      : Source
    : Source;

type ArrayMerge<
  Destination extends UnknownArray,
  Source extends UnknownArray,
  Options extends MergeDeepOptions = {strict: true},
> = Destination extends []
  ? Source
  : Source extends []
  ? Destination
  : [
      ArrayMergeValue<ArrayHead<Destination>, ArrayHead<Source>, Options>,
      ...ArrayMerge<ArrayTail<Destination>, ArrayTail<Source>>,
    ];

/**
MergE two types recursively into a new type.

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
