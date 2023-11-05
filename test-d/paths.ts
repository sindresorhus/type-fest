import {expectType} from 'tsd';
import type {Paths} from '../index';

declare const normal: Paths<{foo: string}>;
expectType<'foo'>(normal);

declare const emptyObject: Paths<{}>;
expectType<''>(emptyObject);

declare const emptyArray: Paths<[]>;
expectType<''>(emptyArray);

declare const symbol: Paths<{[Symbol.iterator]: string}>;
expectType<''>(symbol);

declare const never: Paths<never>;
expectType<never>(never);

declare const date: Paths<{foo: Date}>;
expectType<'foo'>(date);

declare const mixed: Paths<{foo: boolean} | {bar: string}>;
expectType<'foo' | 'bar'>(mixed);

declare const deepObject: Paths<{foo: {bar: string}}>;
expectType<'foo' | 'foo.bar'>(deepObject);

declare const list: Paths<Array<{foo: string}>>;
expectType<`${number}` | `${number}.foo`>(list);

declare const tuple: Paths<[{foo: string}]>;
expectType<'0' | '0.foo'>(tuple);

declare const deeplist: Paths<{foo: Array<{bar: boolean[]}>}>;
expectType<'foo' | `foo.${number}` | `foo.${number}.bar` | `foo.${number}.bar.${number}`>(deeplist);

declare const readonly: Paths<{foo: Readonly<{bar: string}>}>;
expectType<'foo' | 'foo.bar'>(readonly);

declare const readonlyArray: Paths<{foo: readonly string[]}>;
expectType<'foo' | `foo.${number}`>(readonlyArray);

declare const optional: Paths<{foo?: {bar?: number}}>;
expectType<'foo' | 'foo.bar'>(optional);

declare const record: Paths<Record<'a', any>>;
expectType<'a'>(record);
