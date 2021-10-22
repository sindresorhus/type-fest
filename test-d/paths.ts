import {expectType} from 'tsd';
import {Paths} from '../index';

declare const test0: Paths<{foo: 0; bar: 0}>;
expectType<'foo' | 'bar'>(test0);

declare const test1: Paths<Array<{foo: 0; bar: 0}>>;
expectType<`${number}` | `${number}.foo` | `${number}.bar`>(test1);

declare const test2: Paths<{foo: 0; bar?: {baz: 0}}>;
expectType<'foo' | 'bar' | 'bar.baz'>(test2);

declare const test4: Paths<{foo: Array<{bar: 0}>; baz: {qux: 0}}>;
expectType<'foo' | `foo.${number}` | `foo.${number}.bar` | 'baz' | 'baz.qux'>(test4);

declare const test5: Paths<{foo?: Array<{bar?: 0 | null} | null> | null; baz?: {qux?: 0 | null} | null}>;
expectType<'foo' | `foo.${number}` | `foo.${number}.bar` | 'baz' | 'baz.qux'>(test5);

declare const test6: Paths<{foo: 0; bar: 0} | Array<{foo: 0; bar: 0}>>;
expectType<'foo' | 'bar' | `${number}` | `${number}.foo` | `${number}.bar`>(test6);

declare const test7: Paths<Record<string, 0>>;
expectType<string>(test7);

declare const test8: Paths<Array<Record<string, 0>>>;
expectType<`${number}` | `${number}.${string}`>(test8);

declare const test9: Paths<{0: 0; 1: 0; foo: 0}>;
expectType<'0' | '1' | 'foo'>(test9);
