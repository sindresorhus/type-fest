import {expectType} from 'tsd';
import type {Every} from '../../source/internal/array.d.ts';

expectType<Every<[], number>>(true);
expectType<Every<[1, 2, 3], number>>(true);
expectType<Every<[1, 2, 3], number | bigint>>(true);
expectType<Every<[true, false, true, false, boolean], boolean>>(true);
expectType<Every<[string, '1', '2', `${number}`], string>>(true);

expectType<Every<[1, 2, '3'], number>>(false);
expectType<Every<['1', 2, 3], number>>(false);
expectType<Every<['1', '2', '3', 4, '5'], string>>(false);

// Union type elements
expectType<Every<[string, string | number], string>>({} as boolean);
expectType<Every<[true, true, true, boolean], true>>({} as boolean);
expectType<Every<[false, false, boolean, false], false>>({} as boolean);
expectType<Every<['1', '2', number | bigint, '3'], string>>(false);
expectType<Every<[1, 2, number | bigint, 3], number | bigint>>(true);

// Readonly arrays
expectType<Every<readonly [], number>>(true);
expectType<Every<readonly [1, 2, 3], number>>(true);
expectType<Every<readonly [1, 2, '3'], number>>(false);

// Unions
expectType<Every<[1, 2, 3] | [4, 5, 6], number>>(true); // Both `true`
expectType<Every<[1, 2, '3'] | [4, 5, '6'], number>>(false); // Both `false`
expectType<Every<[1, 2, 3] | ['1', '2', 3], number>>({} as boolean); // One `true`, one `false`
expectType<Every<[true, true] | [true, boolean], true>>({} as boolean); // One `true`, one `boolean`
expectType<Every<[true, false] | [true, boolean], true>>({} as boolean); // One `false`, one `boolean`

// Boundary cases
expectType<Every<[], any>>(true);
expectType<Every<[], never>>(true);
expectType<Every<[1, 2, '3', true, false, string[], never], any>>(true);
expectType<Every<[any, any], any>>(true);
expectType<Every<[never, never], any>>(true);
expectType<Every<[1, 2], never>>(false);
expectType<Every<[never, never], never>>(true);
expectType<Every<[never, never, number], never>>(false);
expectType<Every<[number, never, never], never>>(false);
expectType<Every<[never, number, never, any, never], never>>(false);
expectType<Every<[never, any, never, any], never>>({} as boolean);
expectType<Every<[1, 2, any], number>>({} as boolean);
expectType<Every<[1, 2, never], number>>(false);
