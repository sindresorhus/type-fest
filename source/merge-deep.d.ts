type MergeDeepOptions = {
	strict?: boolean;
};

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
			: never
		: never;

type Keyof<Destination, Source> = keyof Destination | keyof Source;

type GetValue<
	Destination,
	Source,
	Key extends Keyof<Destination, Source>,
	Options,
> = Key extends keyof Source
	? Source[Key] extends UnknownRecord
		? MergeValue<Destination, Source, Key, Options>
		: Source[Key]
	: Key extends keyof Destination
	? Destination[Key] | null
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

/**
Merge two types recursively into a new type.

Properties set to `undefined` value are skipped when strict is true (true by default).

@example
```
type Foo = {foo: string; bar: {id: string; label: string}};
type Bar = {foo: number; bar: {id: number; nop: undefined}};

Type FooBar = MergeDeep<Foo, Bar>;

// {
// 	foo: number;
// 	bar: {
// 		id: number;
// 		label: string;
// 	}
// }

Type FooBarLazy = MergeDeep<Foo, Bar, {strict:false}>;

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
