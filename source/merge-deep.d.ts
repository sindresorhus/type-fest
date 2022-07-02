import {AnyArray, AnyRecord} from './internal';

// Private types

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

// Merge logics

type MergeRecord<Destination, Source> = {d: Destination; s: Source};
type MergeArray<Destination, Source> = [Destination, Source];

// Public types

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
}

/**
Merge two types recursively into a new type.

By default arrays are not supported, you have to explicitly enable it with the `recurseIntoArrays` option if you want it.

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
> = Options['recurseIntoArrays'] extends true
  // Branch: recurseIntoArrays = true
  ? isBothArray<Destination, Source> extends true
    ? MergeArray<Destination, Source>
    : isOneArray<Destination, Source> extends true
    ? never // Only one array is forbidden
    : isBothRecord<Destination, Source> extends true
    ? MergeRecord<Destination, Source>
    : never // The two base types are not identical
  // Branch: recurseIntoArrays = false
  : isOneArray<Destination, Source> extends true
  ? never // Array are forbidden
  : isBothRecord<Destination, Source> extends true
  ? MergeRecord<Destination, Source>
  : never; // The two base types are not identical
