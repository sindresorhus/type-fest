import {expectTypeOf} from 'nz';
import type {Tag, Tagged, UnwrapTagged, GetTagMetadata, Opaque} from '../index.d.ts';

// Unwrapping a single tag returns the underlying type.
type Url = Tagged<string, 'URL'>;
expectTypeOf(null as unknown as UnwrapTagged<Url>).toBe<string>();

// Unwrapping multiple individually-applied tags returns the underlying type.
type SpecialCacheKey = Tagged<Url, 'SpecialCacheKey'>;
expectTypeOf(null as unknown as UnwrapTagged<SpecialCacheKey>).toBe<string>();

// Unwrapping a tag applied as a union of tag names (a single multi-key tag layer) must also return the underlying type, not `any`.
type SpecialCacheKey2 = Tagged<string, 'URL' | 'SpecialCacheKey'>;
expectTypeOf(null as unknown as UnwrapTagged<SpecialCacheKey2>).toBe<string>();

// A union tag combined with an individually-applied inner tag.
type Mixed = Tagged<Url, 'SpecialCacheKey' | 'Cache'>;
expectTypeOf(null as unknown as UnwrapTagged<Mixed>).toBe<string>();

// Three individual tags.
type Triple = Tagged<Tagged<Url, 'A'>, 'B'>;
expectTypeOf(null as unknown as UnwrapTagged<Triple>).toBe<string>();

// Union of tagged types unwraps to a union of the underlying types.
expectTypeOf(null as unknown as UnwrapTagged<Tagged<string, 'A'> | Tagged<number, 'B'>>).toBe<string | number>();

// Metadata is still readable and defaults to `never`.
expectTypeOf(null as unknown as GetTagMetadata<Url, 'URL'>).toBe<never>();
expectTypeOf(null as unknown as GetTagMetadata<Tagged<string, 'JSON', number>, 'JSON'>).toBe<number>();

// `UnwrapTagged` is the documented replacement for the deprecated `UnwrapOpaque`, so it must also unwrap the deprecated `Opaque` form, which tags with a bare token instead of a keyed object.
expectTypeOf(null as unknown as UnwrapTagged<Opaque<number, 'tok'>>).toBe<number>();
expectTypeOf(null as unknown as UnwrapTagged<Opaque<number>>).toBe<number>();

// Removing tags must preserve the base object's modifiers and an unrelated brand.
type BrandedRecord = {readonly id: string; optional?: number} & {readonly __brand: 'Record'};
expectTypeOf(null as unknown as UnwrapTagged<Tagged<Tagged<BrandedRecord, 'A', {version: 1}>, 'B' | 'C', Date>>).toBe<BrandedRecord>();

// Tag names are property keys, including numbers and symbols, and metadata can differ between layers.
declare const symbolTag: unique symbol;
type MixedPropertyKeyTags = Tagged<Tagged<Tagged<'value', 42, number>, typeof symbolTag, string>, 'Final', boolean>;
expectTypeOf(null as unknown as UnwrapTagged<MixedPropertyKeyTags>).toBe<'value'>();
expectTypeOf(null as unknown as GetTagMetadata<MixedPropertyKeyTags, typeof symbolTag>).toBe<string>();

// Repeated use must remain practical as a value passes through many independently tagged stages.
type ManyTags = Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<string, 'A'>, 'B'>, 'C'>, 'D'>, 'E'>, 'F'>, 'G'>, 'H'>, 'I'>, 'J'>, 'K'>, 'L'>;
expectTypeOf(null as unknown as UnwrapTagged<ManyTags>).toBe<string>();

// `Tagged` is the underlying type intersected with `Tag`, which is how TypeScript can show a reduced tagged type, for example in emitted declaration files.
expectTypeOf(null as unknown as Tagged<string, 'URL'>).toBe<string & Tag<'URL', never>>();
expectTypeOf(null as unknown as Tagged<Url, 'SpecialCacheKey'>).toBe<string & Tag<'URL', never> & Tag<'SpecialCacheKey', never>>();

// `Tag` matches any type that has the tag, whatever its underlying type and metadata.
expectTypeOf<Url>().toBeAssignableTo<Tag<'URL', unknown>>();
expectTypeOf<SpecialCacheKey>().toBeAssignableTo<Tag<'URL', unknown>>();
expectTypeOf<Tagged<string, 'URL' | 'Other'>>().toBeAssignableTo<Tag<'URL', unknown>>();
expectTypeOf<Tagged<number, 'URL', {secure: true}>>().toBeAssignableTo<Tag<'URL', unknown>>();
expectTypeOf<Tagged<string, 'JSON', number>>().not.toBeAssignableTo<Tag<'JSON', string>>();
expectTypeOf<string>().not.toBeAssignableTo<Tag<'URL', unknown>>();
expectTypeOf<Tagged<string, 'Other'>>().not.toBeAssignableTo<Tag<'URL', unknown>>();
