import {expectType} from 'tsd';
import type {LiteralOf, LiteralUnion, IsEqual, Tagged} from '../index.js';

// For Strings:

type Events = LiteralUnion<'hover' | 'click' | `click-${number}`, string>;
//   ^?
type EventsLiteralStrict = LiteralOf<Events>;
//   ^?
type EventsLiteralNonStrict = LiteralOf<Events, false>;
//   ^?

expectType<IsEqual<'hover' | 'click' | `click-${number}`, EventsLiteralNonStrict>>(true);
expectType<IsEqual<'hover' | 'click', EventsLiteralStrict>>(true);

expectType<IsEqual<'hover' | 'click' | `click-${number}`, EventsLiteralStrict>>(false);
expectType<IsEqual<'hover' | 'click', EventsLiteralNonStrict>>(false);

// For Numbers:

type Nums = LiteralUnion<0 | 1 | 2, number>;
//   ^?
type NumsLiteral = LiteralOf<Nums>;
//   ^?

expectType<IsEqual<0 | 1 | 2, NumsLiteral>>(true);
expectType<IsEqual<0 | 1 | 2, Nums>>(false);

// For Symbols:

declare const symbol1: unique symbol;
declare const symbol2: unique symbol;

type Symbol1 = typeof symbol1;
type Symbol2 = typeof symbol2;

type Symbols = LiteralUnion<Symbol1 | Symbol2, symbol>;
//   ^?
type SymbolsLiteral = LiteralOf<Symbols>;
//   ^?

expectType<IsEqual<Symbol1 | Symbol2, SymbolsLiteral>>(true);
expectType<IsEqual<Symbol1 | Symbol2, Symbols>>(false);

// For Bigints:

type Big = LiteralUnion<1n | 2n, bigint>;
//   ^?
type BigLiteral = LiteralOf<Big>;
//   ^?

expectType<IsEqual<1n | 2n, BigLiteral>>(true);
expectType<IsEqual<1n | 2n, Big>>(false);

// For Tagged types:

type Animals = Tagged<'dog' | 'cat' | `${string}Dog`, 'alimals'>;
type AnimalsStrict = Exclude<Animals, `${string}Dog`>;

type TaggedUnion = LiteralUnion<Animals, string>;
//   ^?
type TaggedStrict = LiteralOf<TaggedUnion>;
//   ^?
type TaggedNonStrict = LiteralOf<TaggedUnion, false>;
//   ^?

expectType<IsEqual<Animals, TaggedNonStrict>>(true);
expectType<IsEqual<AnimalsStrict, TaggedStrict>>(true);

expectType<IsEqual<Animals, TaggedUnion>>(false);
expectType<IsEqual<AnimalsStrict, TaggedUnion>>(false);
