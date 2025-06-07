import {expectAssignable, expectType} from 'tsd';
import type {JoinUnion} from '../index.d.ts';

expectAssignable<'a,b' | 'b,a'>({} as JoinUnion<'a' | 'b'>);
expectAssignable<'1 | 2' | '2 | 1'>({} as JoinUnion<1 | 2, ' | '>);
expectAssignable<'foo'>({} as JoinUnion<'foo'>);
expectAssignable<'42'>({} as JoinUnion<42>);

expectAssignable<''>({} as JoinUnion<null>);
expectAssignable<''>({} as JoinUnion<undefined>);
expectAssignable<','>({} as JoinUnion<undefined | null>);
expectAssignable<'2,'>({} as JoinUnion<undefined | 2>);
expectAssignable<string>({} as JoinUnion<'foo' | string>); // Intended `foo,${string}`
// TODO: For now `UnionToTuple` does not handle 'LiteralUnions'. Will be fixed after `ExtractLiterals` type get approved.

expectType<JoinUnion<never>>('');
expectType<JoinUnion<never, ' + '>>('');

expectAssignable<'a-b' | 'b-a'>({} as JoinUnion<'a' | 'b', '-'>);
expectAssignable<'x🔥y' | 'y🔥x'>({} as JoinUnion<'x' | 'y', '🔥'>);
expectAssignable<'12' | '21'>({} as JoinUnion<1 | 2, ''>);

expectAssignable<'true or false' | 'false or true'>({} as JoinUnion<boolean, ' or '>);
