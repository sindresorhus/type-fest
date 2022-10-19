import {expectTypeOf} from 'expect-type';
import type {LiteralToPrimitive} from '../index';

// Simple usage
declare const numberPrimitive: LiteralToPrimitive<123>;
expectTypeOf(numberPrimitive).toEqualTypeOf<number>();

const symbol = Symbol('foo');

// Union
declare const kitchenSink: LiteralToPrimitive<123 | 123n | 'hello' | true | undefined | typeof symbol | null | {key: string}>;
expectTypeOf(kitchenSink).toEqualTypeOf<number | bigint | string | boolean | undefined | symbol | null>();
