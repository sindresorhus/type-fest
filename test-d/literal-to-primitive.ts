import {expectTypeOf} from 'nz';
import type {LiteralToPrimitive, Opaque, Tagged} from '../index.d.ts';

// Simple usage
declare const numberPrimitive: LiteralToPrimitive<123>;
expectTypeOf(numberPrimitive).toBe<number>();

const symbol = Symbol('foo');

// Union
declare const kitchenSink: LiteralToPrimitive<123 | 123n | 'hello' | true | undefined | typeof symbol | null | {key: string}>;
expectTypeOf(kitchenSink).toBe<number | bigint | string | boolean | undefined | symbol | null>();

// `any` is not a literal, and the conditional distributes over `any`, which made each branch of the chain contribute and left the union of every primitive in the library. `LiteralToPrimitiveDeep` answers `any`, and its documentation says it is this type except that it converts inside an object or an array, so the two have to agree here.
declare const topType: LiteralToPrimitive<any>;
expectTypeOf(topType).toBe<any>();

declare const bottomType: LiteralToPrimitive<never>;
expectTypeOf(bottomType).toBe<never>();

// A branded or tagged literal is still a literal of its primitive, which is the case `Opaque` exists for.
declare const brandedNumber: LiteralToPrimitive<Opaque<123, 'Token'>>;
expectTypeOf(brandedNumber).toBe<number>();

declare const brandedString: LiteralToPrimitive<Tagged<'hello', 'Token'>>;
expectTypeOf(brandedString).toBe<string>();
