import {expectNever, expectType} from 'tsd';
import type {NonEmptyObject, RequireAtLeastOne} from '../index.d.ts';

type TestType1 = {
	a: string;
	b: boolean;
};

type TestType2 = {
	a?: string;
	b?: boolean;
};

type TestType3 = {
	a: string;
	b?: boolean;
};

type TestType4 = {};

declare const test1: NonEmptyObject<TestType1>;
declare const test2: NonEmptyObject<TestType2>;
declare const test3: NonEmptyObject<TestType3>;
declare const test4: NonEmptyObject<TestType4>;

expectType<TestType1>(test1);
expectType<RequireAtLeastOne<TestType2>>(test2);
expectType<TestType3>(test3);
expectNever(test4);

// Issue #821, behavior 1: a pure string index signature resolves to `never`.
type StringIndexOnly = {[key: string]: string | number | undefined};
declare const stringIndexOnly: NonEmptyObject<StringIndexOnly>;
expectNever(stringIndexOnly);

// Issue #821, behavior 2: a pure number index signature resolves to `never`.
type NumberIndexOnly = {[key: number]: unknown};
declare const numberIndexOnly: NonEmptyObject<NumberIndexOnly>;
expectNever(numberIndexOnly);

// Issue #821, behavior 3: the exact repro from the issue — assigning `{foo: {}}`
// to an index-signature-only `NonEmptyObject` is rejected.
type CommonArguments = {
	[filter: string]: NonEmptyObject<{[argument: string]: string | number | undefined}>;
};
// @ts-expect-error — `{}` is not assignable because the inner type resolves to `never`.
const _commonArguments: CommonArguments = {foo: {}};

// Issue #821, behavior 4: an index signature combined with a required explicit
// key still resolves to the original type — the explicit required key anchors
// non-emptiness.
type MixedRequired = {[key: string]: string; a: string};
declare const mixedRequired: NonEmptyObject<MixedRequired>;
expectType<MixedRequired>(mixedRequired);

// Issue #821, behavior 5: an index signature combined with only optional
// explicit keys requires at least one of those explicit optional keys (rather
// than silently degenerating to the input type).
type MixedOptional = {[key: string]: string | undefined; a?: string};
declare const mixedOptional: NonEmptyObject<MixedOptional>;
expectType<RequireAtLeastOne<MixedOptional, 'a'>>(mixedOptional);
