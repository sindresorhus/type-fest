import {Merge} from './merge';
import {Simplify} from './simplify';
import {ConditionalExcept} from './conditional-except';

type UnknownRecord = Record<PropertyKey, unknown>;
type UnknownArrayOrTuple = readonly [...unknown[]];

export type MergeDeepMode = 'replace' | 'union' | 'merge-or-replace' | 'merge-or-union';

export interface MergeDeepOptions {
  stripUndefinedValues?: boolean;
  recordMergeMode?: MergeDeepMode;
  arrayMergeMode?: MergeDeepMode;
}

interface MergeDeepDefaultOptions extends MergeDeepOptions {
  stripUndefinedValues: false;
  recordMergeMode: 'merge-or-replace';
  arrayMergeMode: 'replace';
}

type DoMergeRecord<Destination, Source, Options extends MergeDeepOptions> = {
  [Key in keyof Destination | keyof Source]: Key extends keyof Source
    ? // Source found, check for destination
      Key extends keyof Destination
      ? // Both source and destination exists
        Options['recordMergeMode'] extends 'union'
        ? Destination[Key] | Source[Key]
        : Options['recordMergeMode'] extends 'merge-or-replace'
        ? MergeDeepOrReturn<Source[Key], Destination[Key], Source[Key], Options>
        : Options['recordMergeMode'] extends 'merge-or-union'
        ? MergeDeepOrReturn<Destination[Key] | Source[Key], Destination[Key], Source[Key], Options>
        : Source[Key] // 'replace'
      : // Only the source exists
        Source[Key]
    : // No source, take the destination
    Key extends keyof Destination
    ? Destination[Key]
    : never; // (this test is useless, but make TS happy, It can never be never)
};

type MergeDeepRecord<
  Destination,
  Source,
  Options extends MergeDeepOptions,
> = Options['stripUndefinedValues'] extends true
  ? ConditionalExcept<DoMergeRecord<Destination, Source, Options>, undefined>
  : DoMergeRecord<Destination, Source, Options>;

type MergeDeepOrReturn<DefaultValue, Destination, Source, Options> = Destination extends UnknownArrayOrTuple
  ? Source extends UnknownArrayOrTuple
    ? [] // MergeDeepArray<Destination, Source, Merge<MergeDeepDefaultOptions, Options>>
    : DefaultValue
  : Destination extends UnknownRecord
  ? Source extends UnknownRecord
    ? Simplify<MergeDeepRecord<Destination, Source, Merge<MergeDeepDefaultOptions, Options>>>
    : DefaultValue
  : DefaultValue;

export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepOrReturn<
  never,
  Simplify<Destination>,
  Simplify<Source>,
  Merge<MergeDeepDefaultOptions, Options>
>;
