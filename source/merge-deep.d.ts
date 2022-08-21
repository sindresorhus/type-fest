import {Merge} from './merge';
import {Spread} from './spread';
import {Simplify} from './simplify';
import {ConditionalExcept} from './conditional-except';

type UnknownRecord = Record<PropertyKey, unknown>;
type UnknownArrayOrTuple = readonly [...unknown[]];

export type MergeDeepArrayMode = 'spread' | 'replace' | 'union';
export type MergeDeepRecordMode = 'merge-or-replace' | 'merge-or-union' | 'replace' | 'union';

export interface MergeDeepOptions {
  stripUndefinedValues?: boolean;
  arrayMergeMode?: MergeDeepArrayMode;
  recordMergeMode?: MergeDeepRecordMode;
}

interface MergeDeepDefaultOptions extends MergeDeepOptions {
  stripUndefinedValues: false;
  recordMergeMode: 'merge-or-replace';
  arrayMergeMode: 'spread';
}

type MergeDeepArray<
  Destination extends UnknownArrayOrTuple,
  Source extends UnknownArrayOrTuple,
  Options extends MergeDeepOptions,
> = Options['arrayMergeMode'] extends 'spread'
  ? Spread<Destination, Source>
  : Options['arrayMergeMode'] extends 'union'
  ? Destination | Source
  : // Assume arrayMergeMode = 'replace'
    Source;

type DoMergeRecord<Destination, Source, Options extends MergeDeepOptions> = {
  [Key in keyof Destination | keyof Source]: Key extends keyof Source
    ? // Source found, check for destination
      Key extends keyof Destination
      ? // Both source and destination exists
        Options['recordMergeMode'] extends 'merge-or-replace'
        ? MergeDeepOrReturn<Source[Key], Destination[Key], Source[Key], Options>
        : Options['recordMergeMode'] extends 'merge-or-union'
        ? MergeDeepOrReturn<Destination[Key] | Source[Key], Destination[Key], Source[Key], Options>
        : Options['recordMergeMode'] extends 'union'
        ? Destination[Key] | Source[Key]
        : // Assume recordMergeMode = 'replace'
          Source[Key]
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
    ? Simplify<MergeDeepArray<Destination, Source, Merge<MergeDeepDefaultOptions, Options>>>
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
