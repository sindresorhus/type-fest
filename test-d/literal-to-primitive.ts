import {expectType} from 'tsd';
import type {LiteralToPrimitive, Opaque, Tagged} from '../index.d.ts';

// Simple usage
declare const numberPrimitive: LiteralToPrimitive<123>;
expectType<number>(numberPrimitive);

const symbol = Symbol('foo');

// Union
declare const kitchenSink: LiteralToPrimitive<123 | 123n | 'hello' | true | undefined | typeof symbol | null | {key: string}>;
expectType<number | bigint | string | boolean | undefined | symbol | null>(kitchenSink);

// `any` is not a literal, and the conditional distributes over `any`, which made each branch of the chain contribute and left the union of every primitive in the library. `LiteralToPrimitiveDeep` answers `any`, and its documentation says it is this type except that it converts inside an object or an array, so the two have to agree here.
declare const topType: LiteralToPrimitive<any>;
expectType<any>(topType);

declare const bottomType: LiteralToPrimitive<never>;
expectType<never>(bottomType);

// A branded or tagged literal is still a literal of its primitive, which is the case `Opaque` exists for.
declare const brandedNumber: LiteralToPrimitive<Opaque<123, 'Token'>>;
expectType<number>(brandedNumber);

declare const brandedString: LiteralToPrimitive<Tagged<'hello', 'Token'>>;
expectType<string>(brandedString);
