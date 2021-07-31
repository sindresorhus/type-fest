import {expectType} from 'tsd';
import {ExactMatch} from '..';

interface Foo {
  a: number;
  b: string;
}

interface Bar extends Foo {
  c: boolean;
}

interface Baz {
  a: number;
}

declare const exampleTypeWithMoreKeys: ExactMatch<Foo, Bar>;
expectType<false>(exampleTypeWithMoreKeys);

declare const exampleTypeWithMoreKeysReverse: ExactMatch<Bar, Foo>;
expectType<false>(exampleTypeWithMoreKeysReverse);

declare const exampleTypeWithFewerKeys: ExactMatch<Foo, Baz>;
expectType<false>(exampleTypeWithFewerKeys);

declare const exampleTypeWithFewerKeysReverse: ExactMatch<Baz, Foo>;
expectType<false>(exampleTypeWithFewerKeysReverse);

declare const exampleTypeExactMatch: ExactMatch<Foo & {c: boolean}, Bar>;
expectType<true>(exampleTypeExactMatch);

declare const exampleTypeExactMatchReverse: ExactMatch<Bar, Foo & { c: boolean }>;
expectType<true>(exampleTypeExactMatchReverse);

declare const exampleOmitKey: ExactMatch<Omit<Foo, 'b'>, Baz>;
expectType<true>(exampleOmitKey);

declare const exampleOmitKeyReverse: ExactMatch<Baz, Omit<Foo, 'b'>>;
expectType<true>(exampleOmitKeyReverse);
