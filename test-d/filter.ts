import {expectTypeOf} from 'nz';
import type {Filter} from '../index.d.ts';

type Object1 = {a: number};
type Object2 = {b: string};
type Object3 = {x: string} | {y: number} | null;
class Class {}

// Array tests

// Loose filtering
expectTypeOf<Filter<[1, 2, 3 | 4, 3, 4], 3>>().toBe<[3 | 4, 3]>();
expectTypeOf<Filter<[1, '2', 3, 'foo', boolean], number>>().toBe<[1, 3]>();
expectTypeOf<Filter<[1, '2', 3 | 'bar', 'foo', false], string>>().toBe<['2', 3 | 'bar', 'foo']>();
expectTypeOf<Filter<[1, '2', 3, 'foo', false], string | number>>().toBe<[1, '2', 3, 'foo']>();
expectTypeOf<Filter<['foo', 'baz', 'foo', 'foo' | 'bar'], 'foo'>>().toBe<['foo', 'foo', 'foo' | 'bar']>();
expectTypeOf<Filter<['1', '2', 3, 4, 'foo'], `${number}`>>().toBe<['1', '2']>();
expectTypeOf<Filter<[true, false, boolean | 'bar', 0, 1], boolean>>().toBe<[true, false, boolean | 'bar']>();
expectTypeOf<Filter<[true, false, true, 0, 1], true>>().toBe<[true, true]>();

// Strict filtering
expectTypeOf<Filter<[1, 2, 3 | 4, 3, 4], 3, {strict: true}>>().toBe<[3]>();
expectTypeOf<Filter<[1, '2', 3, 'foo', boolean], number, {strict: true}>>().toBe<[1, 3]>();
expectTypeOf<Filter<[1, '2', 3 | 'bar', 'foo', false], string, {strict: true}>>().toBe<['2', 'foo']>();
expectTypeOf<Filter<[1, '2', 3, 'foo', false], string | number, {strict: true}>>().toBe<[1, '2', 3, 'foo']>();
expectTypeOf<Filter<['foo', 'baz', 'foo', 'foo' | 'bar'], 'foo', {strict: true}>>().toBe<['foo', 'foo']>();
expectTypeOf<Filter<['1', '2', 3, 4, 'foo'], `${number}`, {strict: true}>>().toBe<['1', '2']>();
expectTypeOf<Filter<[true, false, boolean | 'bar', 0, 1], boolean, {strict: true}>>().toBe<[true, false]>();
expectTypeOf<Filter<[true, false, true, 0, 1], true, {strict: true}>>().toBe<[true, true]>();

// Optional
expectTypeOf<Filter<[string, number?, boolean?], number>>().toBe<[number?]>();
expectTypeOf<Filter<[string, 'foo'?, true?], 'foo' | boolean>>().toBe<['foo'?, true?]>();

// Rest elements
expectTypeOf<Filter<['f', ...string[], 's'], string>>().toBe<['f', ...string[], 's']>();
expectTypeOf<Filter<['f', ...string[], 's'], 'f' | 's'>>().toBe<['f', 's']>();
expectTypeOf<Filter<[string, ...string[]], string>>().toBe<[string, ...string[]]>();
expectTypeOf<Filter<[string, ...string[], number], string>>().toBe<[string, ...string[]]>();

// Rest and Optional
expectTypeOf<Filter<[true, number?, ...string[]], string>>().toBe<string[]>();
expectTypeOf<Filter<[true, number?, ...string[]], number | string>>().toBe<[number?, ...string[]]>();
expectTypeOf<Filter<[string?, ...string[]], number | string>>().toBe<[string?, ...string[]]>();
expectTypeOf<Filter<[1, 5?, 'd'?, ...Array<'foo'>], number>>().toBe<[1, 5?]>();
expectTypeOf<Filter<[1, 5?, 'd'?, ...Array<'foo'>], 'd'>>().toBe<['d'?]>();

// Readonly array (verifies readonly modifiers are preserved)
expectTypeOf<Filter<readonly [1, 2, 3 | 4, 3, 4], 3>>().toBe<readonly [3 | 4, 3]>();
expectTypeOf<Filter<readonly [1, '2', 3, 'foo', boolean], number>>().toBe<readonly [1, 3]>();
expectTypeOf<Filter<readonly [1, '2', 3 | 'bar', 'foo', false], string>>().toBe<readonly ['2', 3 | 'bar', 'foo']>();
expectTypeOf<Filter<readonly [1, '2', 3, false] | ['1', 2, '3', true], number>>().toBe<readonly [1, 3] | [2]>();

// Filtering Boolean (keep truthy values)
expectTypeOf<Filter<[true, false, boolean, 0, 1], Boolean>>().toBe<[true, boolean, 1]>();
expectTypeOf<Filter<[true, false, boolean, 0, 1], Boolean, {strict: true}>>().toBe<[true, 1]>();
expectTypeOf<Filter<[0, '', false, null, undefined, 'ok', 42], Boolean>>().toBe<['ok', 42]>();
expectTypeOf<Filter<[true, false, 0, 1, '', 'text', null, undefined], Boolean>>().toBe<[true, 1, 'text']>();
expectTypeOf<Filter<[0 | 1, 0 | null, string, never], Boolean>>().toBe<[0 | 1, string]>();
expectTypeOf<Filter<[0 | 1, 0 | null, string, never], Boolean, {strict: true}>>().toBe<[string]>();
expectTypeOf<Filter<readonly boolean[], Boolean>>().toBe<readonly boolean[]>();
expectTypeOf<Filter<boolean[], Boolean, {strict: true}>>().toBe<[]>();
expectTypeOf<Filter<[Boolean, true], Boolean>>().toBe<[Boolean, true]>(); // `Boolean` as an element is truthy, not matched literally

// Filtering objects
expectTypeOf<Filter<[Object1, Object2, Object1 & Object2], Object1>>().toBe<[Object1, Object1 & Object2]>();
expectTypeOf<Filter<[Object1, Object2, Object1 & Object2], Object1, {strict: true}>>().toBe<[Object1, Object1 & Object2]>();

// Union
expectTypeOf<Filter<[1, '2', 3, false] | ['1', 2, '3', true], number>>().toBe<[1, 3] | [2]>();
expectTypeOf<Filter<[1, '2', 3, false] | ['1', 2, '3', true], string>>().toBe<['2'] | ['1', '3']>();
expectTypeOf<Filter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], string>>().toBe<string[] | Array<'foo'>>();
expectTypeOf<Filter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], number>>().toBe<[number?] | []>();

// Loose filtering by boolean or number
expectTypeOf<Filter<[true, 0, 1, false, 'no'], boolean | number>>().toBe<[true, 0, 1, false]>();

// Filtering array containing null | undefined | string
expectTypeOf<Filter<[null, undefined, 'foo', ''], string>>().toBe<['foo', '']>();

// Filtering with unknown type (should keep everything)
expectTypeOf<Filter<[1, 'a', true], unknown>>().toBe<[1, 'a', true]>();

// Filtering with any type (should keep everything)
expectTypeOf<Filter<[1, 'a', true], any>>().toBe<[1, 'a', true]>();

// Filtering with never type (should remove everything)
expectTypeOf<Filter<[1, 2, 3], never>>().toBe<[]>();

// Filtering array of arrays by array type
expectTypeOf<Filter<[[number], string[], number[]], number[]>>().toBe<[[number], number[]]>();

// Filtering by a union including literal and broader type
expectTypeOf<Filter<[1, 2, 3, 'foo', 'bar'], 1 | string>>().toBe<[1, 'foo', 'bar']>();

// Filtering complex nested union types
expectTypeOf<Filter<[ {x: 'a'}, {y: 2}, null, {z: true} ], Object3>>().toBe<[{x: 'a'}, {y: 2}, null]>();

// Filtering with boolean type but array has no boolean values
expectTypeOf<Filter<[1, 2, 3], Boolean>>().toBe<[1, 2, 3]>();

// Filtering with boolean type but array has falsy values
expectTypeOf<Filter<[0, '', false, null, undefined], Boolean>>().toBe<[]>();

// Filtering string literals with template literal union
expectTypeOf<Filter<['foo1', 'bar2', 'fooo', 'foo3'], `foo${number}`>>().toBe<['foo1', 'foo3']>();

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
expectTypeOf<Filter<[typeof Class, {}, null, undefined], Boolean>>().toBe<[typeof Class, {}]>();

// Filtering with strict = true and union including literals and primitives
expectTypeOf<Filter<[1, '1', 2, '2', true, false], number | `${number}`, {strict: true}>>().toBe<[1, '1', 2, '2']>();

// Filtering falsy values mixed with ({} | [] is truthy)
expectTypeOf<Filter<[false, 0, '', null, undefined, {}, []], Boolean>>().toBe<[{}, []]>();

// Filtering with `true` literal (strict) but array contains boolean and number
expectTypeOf<Filter<[true, false, 1, 0], true, {strict: true}>>().toBe<[true]>();

// Filtering empty string literal type with strict mode
expectTypeOf<Filter<['', 'non-empty'], '', {strict: true}>>().toBe<['']>();

// Filtering with loose mode for literal union type and matching subset
expectTypeOf<Filter<[1, 2, 3, 4, 5], 2 | 3>>().toBe<[2, 3]>();

// Edge cases
expectTypeOf<Filter<any, never>>().toBe<any>(); // `any` passes through
expectTypeOf<Filter<any[], never>>().toBe<any[]>();
expectTypeOf<Filter<never, any>>().toBe<never>();
expectTypeOf<Filter<never, never>>().toBe<never>();

expectTypeOf<Filter<[], number>>().toBe<[]>();
expectTypeOf<Filter<[never, never], number>>().toBe<[]>();
expectTypeOf<Filter<[never, never], never>>().toBe<[]>();
expectTypeOf<Filter<[never, never], never, {strict: true}>>().toBe<[never, never]>();

// Object tests

// Loose filtering
expectTypeOf<Filter<{a: 1; b: 2; c: 3 | 4; d: 3; e: 4}, 3>>().toBe<{c: 3 | 4; d: 3}>();
expectTypeOf<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: boolean}, number>>().toBe<{a: 1; c: 3}>();
expectTypeOf<Filter<{a: 1; b: '2'; c: 3 | 'bar'; d: 'foo'; e: false}, string>>().toBe<{b: '2'; c: 3 | 'bar'; d: 'foo'}>();
expectTypeOf<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number>>().toBe<{a: 1; b: '2'; c: 3; d: 'foo'}>();
expectTypeOf<Filter<{a: 'foo'; b: 'baz'; c: 'foo'; d: 'foo' | 'bar'}, 'foo'>>().toBe<{a: 'foo'; c: 'foo'; d: 'foo' | 'bar'}>();
expectTypeOf<Filter<{a: '1'; b: '2'; c: 3; d: 4; e: 'foo'}, `${number}`>>().toBe<{a: '1'; b: '2'}>();
expectTypeOf<Filter<{a: true; b: false; c: boolean | 'bar'; d: 0; e: 1}, boolean>>().toBe<{a: true; b: false; c: boolean | 'bar'}>();
expectTypeOf<Filter<{a: true; b: false; c: true; d: 0; e: 1}, true>>().toBe<{a: true; c: true}>();

// Strict filtering
expectTypeOf<Filter<{a: 1; b: 2; c: 3 | 4; d: 3; e: 4}, 3, {strict: true}>>().toBe<{d: 3}>();
expectTypeOf<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: boolean}, number, {strict: true}>>().toBe<{a: 1; c: 3}>();
expectTypeOf<Filter<{a: 1; b: '2'; c: 3 | 'bar'; d: 'foo'; e: false}, string, {strict: true}>>().toBe<{b: '2'; d: 'foo'}>();
expectTypeOf<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number, {strict: true}>>().toBe<{a: 1; b: '2'; c: 3; d: 'foo'}>();
expectTypeOf<Filter<{a: 'foo'; b: 'baz'; c: 'foo'; d: 'foo' | 'bar'}, 'foo', {strict: true}>>().toBe<{a: 'foo'; c: 'foo'}>();
expectTypeOf<Filter<{a: '1'; b: '2'; c: 3; d: 4; e: 'foo'}, `${number}`, {strict: true}>>().toBe<{a: '1'; b: '2'}>();
expectTypeOf<Filter<{a: true; b: false; c: boolean | 'bar'; d: 0; e: 1}, boolean, {strict: true}>>().toBe<{a: true; b: false}>();
expectTypeOf<Filter<{a: true; b: false; c: true; d: 0; e: 1}, true, {strict: true}>>().toBe<{a: true; c: true}>();

// Index signatures
expectTypeOf<Filter<{[a: string]: number | string; b: 1}, 1 | string>>().toBe<{[x: string]: string | number; b: 1}>();
expectTypeOf<Filter<{[a: string]: number | string; b: 1}, 1 | string, {strict: true}>>().toBe<{b: 1}>();
expectTypeOf<Filter<{[a: string]: number; [b: symbol]: string}, string>>().toBe<{[b: symbol]: string}>();
expectTypeOf<Filter<{[a: string]: number; [b: symbol]: string; c: 5}, number>>().toBe<{[a: string]: number; c: 5}>();

// Optional elements
expectTypeOf<Filter<{a?: 'f'; b: 's'; c: undefined}, undefined>>().toBe<{c: undefined}>();
expectTypeOf<Filter<{a?: 'f'; b: 's'; c: undefined}, undefined, {strict: true}>>().toBe<{c: undefined}>();
expectTypeOf<Filter<{a?: 'f'; b: 's'; c: 5}, string>>().toBe<{a?: 'f'; b: 's'}>();
expectTypeOf<Filter<{a?: 'f'; b: 's'; c: 5}, string, {strict: true}>>().toBe<{a?: 'f'; b: 's'}>();

// Readonly properties (verifies readonly modifiers are preserved)
expectTypeOf<Filter<{readonly a: 1; b: 2; readonly c: 3}, number>>().toBe<{readonly a: 1; b: 2; readonly c: 3}>();
expectTypeOf<Filter<{readonly a: string; b: number; readonly c: boolean}, string>>().toBe<{readonly a: string}>();
expectTypeOf<Filter<{readonly a?: string; b?: number; c: boolean}, string>>().toBe<{readonly a?: string}>();

// Filtering Boolean (keep truthy values)
expectTypeOf<Filter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean>>().toBe<{a: true; c: boolean; e: 1}>();
expectTypeOf<Filter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean, {strict: true}>>().toBe<{a: true; e: 1}>();
expectTypeOf<Filter<{a: 0; b: ''; c: false; d: null; e: undefined; f: 'ok'; g: 42}, Boolean>>().toBe<{f: 'ok'; g: 42}>();
expectTypeOf<Filter<{a: true; b: false; c: 0; d: 1; e: ''; f: 'text'; g: null; h: undefined}, Boolean>>().toBe<{a: true; d: 1; f: 'text'}>();

// Filtering objects
expectTypeOf<Filter<{a: Object1; b: Object2; c: Object1 & Object2}, Object1>>().toBe<{a: Object1; c: Object1 & Object2}>();
expectTypeOf<Filter<{a: Object1; b: Object2; c: Object1 & Object2}, Object1, {strict: true}>>().toBe<{a: Object1; c: Object1 & Object2}>();

// Union
expectTypeOf<Filter<{a: 1; b: '2'; c: 3; d: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, number>>().toBe<{a: 1; c: 3} | {b2: 2}>();
expectTypeOf<Filter<{a: 1; b: '2'; c: 3; d: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, string>>().toBe<{b: '2'} | {b1: '1'; b3: '3'}>();

// Loose filtering by boolean or number
expectTypeOf<Filter<{a: true; b: 0; c: 1; d: false; e: 'no'}, boolean | number>>().toBe<{a: true; b: 0; c: 1; d: false}>();

// Filtering object containing null | undefined | string
expectTypeOf<Filter<{a: null; b: undefined; c: 'foo'; d: ''}, string>>().toBe<{c: 'foo'; d: ''}>();

// Filtering with unknown type (should keep everything)
expectTypeOf<Filter<{a: 1; b: 'a'; c: true}, unknown>>().toBe<{a: 1; b: 'a'; c: true}>();

// Filtering with any type (should keep everything)
expectTypeOf<Filter<{a: 1; b: 'a'; c: true}, any>>().toBe<{a: 1; b: 'a'; c: true}>();

// Filtering with never type (should remove everything)
expectTypeOf<Filter<{a: 1; b: 2; c: 3}, never>>().toBe<{}>();

// Filtering object of arrays by array type
expectTypeOf<Filter<{a: number[]; b: string[]; c: number[]}, number[]>>().toBe<{a: number[]; c: number[]}>();

// Filtering by a union including literal and broader type
expectTypeOf<Filter<{a: 1; b: 2; c: 3; d: 'foo'; e: 'bar'}, 1 | string>>().toBe<{a: 1; d: 'foo'; e: 'bar'}>();

// Filtering complex nested union types
expectTypeOf<Filter<{a: {x: 'a'}; b: {y: 2}; c: null; d: {z: true}}, Object3>>().toBe<{a: {x: 'a'}; b: {y: 2}; c: null}>();

// Filtering with boolean type but object has no boolean values
expectTypeOf<Filter<{a: 1; b: 2; c: 3}, Boolean>>().toBe<{a: 1; b: 2; c: 3}>();

// Filtering with boolean type but object has falsy values
expectTypeOf<Filter<{a: 0; b: ''; c: false; d: null; e: undefined}, Boolean>>().toBe<{}>();

// Filtering string literals with template literal union
expectTypeOf<Filter<{a: 'foo1'; b: 'bar2'; c: 'fooo'; d: 'foo3'}, `foo${number}`>>().toBe<{a: 'foo1'; d: 'foo3'}>();

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
expectTypeOf<Filter<{a: typeof Class; b: {}; c: null; d: undefined}, Boolean>>().toBe<{a: typeof Class; b: {}}>();

// Filtering with strict = true and union including literals and primitives
expectTypeOf<Filter<{a: 1; b: '1'; c: 2; d: '2'; e: true; f: false}, number | `${number}`, {strict: true}>>().toBe<{a: 1; b: '1'; c: 2; d: '2'}>();

// Filtering falsy values mixed with truthy objects
expectTypeOf<Filter<{a: false; b: 0; c: ''; d: null; e: undefined; f: {}; g: []}, Boolean>>().toBe<{f: {}; g: []}>();

// Filtering with `true` literal (strict) but object contains boolean and number
expectTypeOf<Filter<{a: true; b: false; c: 1; d: 0}, true, {strict: true}>>().toBe<{a: true}>();

// Filtering empty string literal type with strict mode
expectTypeOf<Filter<{a: ''; b: 'non-empty'}, '', {strict: true}>>().toBe<{a: ''}>();

// Filtering with loose mode for literal union type and matching subset
expectTypeOf<Filter<{a: 1; b: 2; c: 3; d: 4; e: 5}, 2 | 3>>().toBe<{b: 2; c: 3}>();

// Edge cases
expectTypeOf<Filter<any, never>>().toBe<any>();
expectTypeOf<Filter<never, any>>().toBe<never>();
expectTypeOf<Filter<never, never>>().toBe<never>();

expectTypeOf<Filter<{}, number>>().toBe<{}>();
expectTypeOf<Filter<{a: never; b: never}, number>>().toBe<{}>();
expectTypeOf<Filter<{a: never; b: never}, never>>().toBe<{}>();
expectTypeOf<Filter<{a: never; b: never}, never, {strict: true}>>().toBe<{a: never; b: never}>();

// Filtering by `unknown`, `any`, or `{}` keeps falsy values (only `Boolean` filters by truthiness)
expectTypeOf<Filter<[0, '', false], unknown>>().toBe<[0, '', false]>();
expectTypeOf<Filter<[0, '', false], any>>().toBe<[0, '', false]>();
expectTypeOf<Filter<[0, '', false], {}>>().toBe<[0, '', false]>();
expectTypeOf<Filter<{a: 0; b: ''; c: false}, unknown>>().toBe<{a: 0; b: ''; c: false}>();
expectTypeOf<Filter<{a: 0; b: ''; c: false}, any>>().toBe<{a: 0; b: ''; c: false}>();

// Union members that become empty are kept
expectTypeOf<Filter<[1] | [2], 1>>().toBe<[1] | []>();
expectTypeOf<Filter<{a: 1} | {b: 2}, 1>>().toBe<{a: 1} | {}>();
expectTypeOf<Filter<[1] | {b: 2}, 1>>().toBe<[1] | {}>();

// Optional properties are checked without the `undefined` that optionality adds
expectTypeOf<Filter<{a: 1; b: 3 | 4; c?: 3}, 3, {strict: true}>>().toBe<{c?: 3}>();
expectTypeOf<Filter<{a?: 3 | undefined}, 3, {strict: true}>>().toBe<{}>();
expectTypeOf<Filter<{a?: 3 | undefined}, 3>>().toBe<{a?: 3 | undefined}>();

// Non-tuple arrays
expectTypeOf<Filter<readonly string[], string>>().toBe<readonly string[]>();
expectTypeOf<Filter<string[], number>>().toBe<[]>();
expectTypeOf<Filter<unknown[], string>>().toBe<[]>();
expectTypeOf<Filter<[1] | unknown[], 1>>().toBe<[1] | []>();

// Interfaces
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Interface {
	a: 1;
	b: 'b';
}
expectTypeOf<Filter<Interface, number>>().toBe<{a: 1}>();

// Invalid input
// @ts-expect-error
type Invalid = Filter<string, string>;
