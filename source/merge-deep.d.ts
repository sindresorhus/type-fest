import {ConditionalExcept} from './conditional-except';
import {AnyArray, AnyRecord} from './internal';
import {Simplify} from './simplify';

/** Test if one of the two types extends the base type. */
type isOneExtend<BaseType, FirstType, SecondType> = FirstType extends BaseType
  ? true
  : SecondType extends BaseType
  ? true
  : false;

/** Test if both types extends the base type. */
type isBothExtend<BaseType, FirstType, SecondType> = FirstType extends BaseType
  ? SecondType extends BaseType
  ? true
  : false
  : false;

// Some helpers for readability
type isOneArray<Destination, Source> = isOneExtend<AnyArray, Destination, Source>;
type isBothArray<Destination, Source> = isBothExtend<AnyArray, Destination, Source>;
type isBothRecord<Destination, Source> = isBothExtend<AnyRecord, Destination, Source>;

/** Returns the union of the keys of both types. */
type Keyof<Destination, Source> = keyof Destination | keyof Source;

/** Concat two array. */
type ConcatArray<Destination, Source> = Destination extends AnyArray
  ? Source extends AnyArray
    ? Array<Destination[number] | Source[number]>
    : never
  : never;

/** Merge two arrays. */
type MergeArray<Destination, Source, Options extends MergeDeepOptions> =
  Destination extends []
  ? Source // Destination is an empty array, return the source
  : Source extends []
  ? Destination // Source is an empty array, return the destination
  : Options['recurseIntoArrays'] extends true
  ? ConcatArray<Destination, Source> // Concat the two array
  // Return the source
  : Source;

/**
Walk through the union of the keys of the two objects and test in which object the properties are defined.

- If the source does not contain the key, the value of the destination is returned.
- If the source contains the key and the destination does not contain the key, the value of the source is returned.
- If the source and destination contain the key, the two values are merged if possible, otherwise it is the value of the source that is returned.
*/
type DoMergeRecord<Destination, Source, Options extends MergeDeepOptions> = {
	[Key in Keyof<Destination, Source>]:
    Key extends keyof Source
    // Source found, check for destination
    ? Key extends keyof Destination
    // Both source and destination exists
    ? MergeDeepOrReturn<Source[Key], Destination[Key], Source[Key], Options>
    // Only the source exists
    : Source[Key]
    // No source, take the destination (this test is useless, but make TS happy, It can never be never)
    : Key extends keyof Destination ? Destination[Key] : never;
};

/** Wrapper around `DoMergeRecord` which defines whether or not to keep undefined values. */
type MergeRecord<Destination, Source, Options extends MergeDeepOptions> = Simplify<
  Options['stripUndefinedValues'] extends true
    ? ConditionalExcept<DoMergeRecord<Destination, Source, Options>, undefined>
    : DoMergeRecord<Destination, Source, Options>>;

/** Try to merge two types recursively into a new type or return the default value. */
export type MergeDeepOrReturn<
  DefaultValue,
  Destination,
  Source,
  Options extends MergeDeepOptions,
> = isBothArray<Destination, Source> extends true
    ? MergeArray<Destination, Source, Options>
    : isOneArray<Destination, Source> extends true
    ? DefaultValue // Only one array is forbidden
    : isBothRecord<Destination, Source> extends true
    ? MergeRecord<Destination, Source, Options>
    : DefaultValue; // The two base types are not identical

/**
MergeDeep options.

@see MergeDeep
*/
export interface MergeDeepOptions {
  /**
	Should recurse into arrays.

  - When set to `false` arrays are not supported as input and all properties that contain arrays will be replaced from source to destination.
  - When set to `true` all arrays are concatenated recursively.

  @default false

  @example
  ```
  type Merged = MergeDeep<[], []>;
  // never

  type Merged = MergeDeep<[], [], {recurseIntoArrays: true}>;
  // []

  type Merged = MergeDeep<{items: [1,2,3]}, {items: [4,5,6]}>;
  // {items: [4,5,6]}

  type Merged = MergeDeep<{items: [1,2,3]}, {items: [4,5,6]}, {recurseIntoArrays: true}>;
  // {items: [1,2,3,4,5,6]}
	```
  */
	recurseIntoArrays?: boolean;

  /**
  Should strip undefined values from the resulting type.

  @default false
  */
  stripUndefinedValues?: boolean;
}

/**
Merge two types recursively into a new type.

@see MergeDeepOptions

@example
```
MergeDeep<[], []>; // never
MergeDeep<[], [], {recurseIntoArrays: true}>; // []
```

@category Object
@category Array
*/
export type MergeDeep<
  Destination,
  Source,
  Options extends MergeDeepOptions = {},
> = MergeDeepOrReturn<never, Destination, Source, Options>;
