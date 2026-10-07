import {expectType} from 'tsd';
import type {Tagged, UnwrapTagged, GetTagMetadata, Opaque} from '../index.d.ts';

// Unwrapping a single tag returns the underlying type.
type Url = Tagged<string, 'URL'>;
expectType<string>(null as unknown as UnwrapTagged<Url>);

// Unwrapping multiple individually-applied tags returns the underlying type.
type SpecialCacheKey = Tagged<Url, 'SpecialCacheKey'>;
expectType<string>(null as unknown as UnwrapTagged<SpecialCacheKey>);

// Unwrapping a tag applied as a union of tag names (a single multi-key tag layer) must also return the underlying type, not `any`.
type SpecialCacheKey2 = Tagged<string, 'URL' | 'SpecialCacheKey'>;
expectType<string>(null as unknown as UnwrapTagged<SpecialCacheKey2>);

// A union tag combined with an individually-applied inner tag.
type Mixed = Tagged<Url, 'SpecialCacheKey' | 'Cache'>;
expectType<string>(null as unknown as UnwrapTagged<Mixed>);

// Three individual tags.
type Triple = Tagged<Tagged<Url, 'A'>, 'B'>;
expectType<string>(null as unknown as UnwrapTagged<Triple>);

// Union of tagged types unwraps to a union of the underlying types.
expectType<string | number>(null as unknown as UnwrapTagged<Tagged<string, 'A'> | Tagged<number, 'B'>>);

// Metadata is still readable and defaults to `never`.
expectType<never>(null as unknown as GetTagMetadata<Url, 'URL'>);
expectType<number>(null as unknown as GetTagMetadata<Tagged<string, 'JSON', number>, 'JSON'>);

// `UnwrapTagged` is the documented replacement for the deprecated `UnwrapOpaque`, so it must also unwrap the deprecated `Opaque` form, which tags with a bare token instead of a keyed object.
expectType<number>(null as unknown as UnwrapTagged<Opaque<number, 'tok'>>);
expectType<number>(null as unknown as UnwrapTagged<Opaque<number>>);

// Removing tags must preserve the base object's modifiers and an unrelated brand.
type BrandedRecord = {readonly id: string; optional?: number} & {readonly __brand: 'Record'};
expectType<BrandedRecord>(null as unknown as UnwrapTagged<Tagged<Tagged<BrandedRecord, 'A', {version: 1}>, 'B' | 'C', Date>>);

// Tag names are property keys, including numbers and symbols, and metadata can differ between layers.
declare const symbolTag: unique symbol;
type MixedPropertyKeyTags = Tagged<Tagged<Tagged<'value', 42, number>, typeof symbolTag, string>, 'Final', boolean>;
expectType<'value'>(null as unknown as UnwrapTagged<MixedPropertyKeyTags>);
expectType<string>(null as unknown as GetTagMetadata<MixedPropertyKeyTags, typeof symbolTag>);

// Repeated use must remain practical as a value passes through many independently tagged stages.
type ManyTags = Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<string, 'A'>, 'B'>, 'C'>, 'D'>, 'E'>, 'F'>, 'G'>, 'H'>, 'I'>, 'J'>, 'K'>, 'L'>;
expectType<string>(null as unknown as UnwrapTagged<ManyTags>);
