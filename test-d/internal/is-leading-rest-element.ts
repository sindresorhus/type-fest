import {expectType} from 'tsd';
import type {IsLeadingRestElement} from '../../source/internal/array.d.ts';

// ✅ TRUE CASES (leading rest)

expectType<IsLeadingRestElement<[...string[], number]>>(true);
//     ^?

expectType<IsLeadingRestElement<[...any[], string, boolean]>>(true);
//     ^?

expectType<IsLeadingRestElement<[...unknown[], 'a']>>(true);
//     ^?

expectType<IsLeadingRestElement<[...readonly number[], 1, 2]>>(true);
//     ^?

expectType<IsLeadingRestElement<[...string[]]>>(true);
//     ^?

expectType<IsLeadingRestElement<[...any[]]>>(true);
//     ^?

expectType<IsLeadingRestElement<[...string[], ...[number]]>>(true);
//     ^?

// ❌ FALSE CASES (not leading rest)

expectType<IsLeadingRestElement<[...[string], ...number[]]>>(false);
//     ^?

expectType<IsLeadingRestElement<[string, number]>>(false);
//     ^?

expectType<IsLeadingRestElement<[]>>(false);
//     ^?

expectType<IsLeadingRestElement<[undefined, ...number[]]>>(false);
//     ^?

expectType<IsLeadingRestElement<[never, ...string[]]>>(false);
//     ^?

expectType<IsLeadingRestElement<[boolean]>>(false);
//     ^?

expectType<IsLeadingRestElement<[() => void]>>(false);
//     ^?

expectType<IsLeadingRestElement<[1, 2, 3]>>(false);
//     ^?

expectType<IsLeadingRestElement<['a', ...string[]]>>(false);
//     ^?

expectType<IsLeadingRestElement<[null, ...string[]]>>(false);
//     ^?

// Edge cases

expectType<IsLeadingRestElement<any>>(false);
//     ^?

expectType<IsLeadingRestElement<never>>(false);
//     ^?

expectType<IsLeadingRestElement<string[]>>(true);
//     ^?

expectType<IsLeadingRestElement<number[]>>(true);
//     ^?

expectType<IsLeadingRestElement<readonly []>>(false);
//     ^?

expectType<IsLeadingRestElement<[string?]>>(false);
//     ^?

expectType<IsLeadingRestElement<[...[], number]>>(false);
//     ^?

expectType<IsLeadingRestElement<[string, ...string[]]>>(false);
//     ^?

// ! Need Fix: `[...string[]] extends [string?, ...string[]]`
expectType<IsLeadingRestElement<[string?, ...string[]]>>(true);
//     ^?
