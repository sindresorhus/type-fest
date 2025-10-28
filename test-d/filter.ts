import {expectType} from 'tsd';
import type {Filter} from '../source/filter.d.ts';

type Object1 = {a: number};
type Object2 = {b: string};
type Object3 = {x: string} | {y: number} | null;
class Class {}

// Array tests

// Loose filtering
expectType<Filter<[1, 2, 3 | 4, 3, 4], 3>>({} as [3 | 4, 3]);
expectType<Filter<[1, '2', 3, 'foo', boolean], number>>([1, 3]);
expectType<Filter<[1, '2', 3 | 'bar', 'foo', false], string>>({} as ['2', 3 | 'bar', 'foo']);
expectType<Filter<[1, '2', 3, 'foo', false], string | number>>([1, '2', 3, 'foo']);
expectType<Filter<['foo', 'baz', 'foo', 'foo' | 'bar'], 'foo'>>({} as ['foo', 'foo', 'foo' | 'bar']);
expectType<Filter<['1', '2', 3, 4, 'foo'], `${number}`>>(['1', '2']);
expectType<Filter<[true, false, boolean | 'bar', 0, 1], boolean>>({} as [true, false, boolean | 'bar']);
expectType<Filter<[true, false, true, 0, 1], true>>([true, true]);

// Strict filtering
expectType<Filter<[1, 2, 3 | 4, 3, 4], 3, {strict: true}>>([3]);
expectType<Filter<[1, '2', 3, 'foo', boolean], number, {strict: true}>>([1, 3]);
expectType<Filter<[1, '2', 3 | 'bar', 'foo', false], string, {strict: true}>>(['2', 'foo']);
expectType<Filter<[1, '2', 3, 'foo', false], string | number, {strict: true}>>([1, '2', 3, 'foo']);
expectType<Filter<['foo', 'baz', 'foo', 'foo' | 'bar'], 'foo', {strict: true}>>({} as ['foo', 'foo']);
expectType<Filter<['1', '2', 3, 4, 'foo'], `${number}`, {strict: true}>>(['1', '2']);
expectType<Filter<[true, false, boolean | 'bar', 0, 1], boolean, {strict: true}>>({} as [true, false]);
expectType<Filter<[true, false, true, 0, 1], true, {strict: true}>>([true, true]);

// Optional
expectType<Filter<[string, number?, boolean?], number>>({} as [number?]);
expectType<Filter<[string, 'foo'?, true?], 'foo' | boolean>>({} as ['foo'?, true?]);

// Rest elements
expectType<Filter<['f', ...string[], 's'], string>>({} as ['f', ...string[], 's']);
expectType<Filter<['f', ...string[], 's'], 'f' | 's'>>({} as ['f', 's']);
expectType<Filter<[string, ...string[]], string>>({} as [string, ...string[]]);
expectType<Filter<[string, ...string[], number], string>>({} as [string, ...string[]]);

// Rest and Optional
expectType<Filter<[true, number?, ...string[]], string>>({} as string[]);
expectType<Filter<[true, number?, ...string[]], number | string>>({} as [number?, ...string[]]);
expectType<Filter<[string?, ...string[]], number | string>>({} as [string?, ...string[]]);
expectType<Filter<[1, 5?, 'd'?, ...Array<'foo'>], number>>({} as [1, 5?]);
expectType<Filter<[1, 5?, 'd'?, ...Array<'foo'>], 'd'>>({} as ['d'?]);

// Readonly array (verifies readonly modifiers are preserved)
expectType<Filter<readonly [1, 2, 3 | 4, 3, 4], 3>>({} as readonly [3 | 4, 3]);
expectType<Filter<readonly [1, '2', 3, 'foo', boolean], number>>({} as readonly [1, 3]);
expectType<Filter<readonly [1, '2', 3 | 'bar', 'foo', false], string>>({} as readonly ['2', 3 | 'bar', 'foo']);
expectType<Filter<readonly [1, '2', 3, false] | ['1', 2, '3', true], number>>({} as readonly [1, 3] | [2]);

// Filtering Boolean (keep truthy values)
expectType<Filter<[true, false, boolean, 0, 1], Boolean>>([true, 1]);
expectType<Filter<[true, false, boolean, 0, 1], Boolean, {strict: true}>>([true, 1]);
expectType<Filter<[0, '', false, null, undefined, 'ok', 42], Boolean>>(['ok', 42]);
expectType<Filter<[true, false, 0, 1, '', 'text', null, undefined], Boolean>>([true, 1, 'text']);

// Filtering objects
expectType<Filter<[Object1, Object2, Object1 & Object2], Object1>>({} as [Object1, Object1 & Object2]);
expectType<Filter<[Object1, Object2, Object1 & Object2], Object1, {strict: true}>>({} as [Object1, Object1 & Object2]);

// Union
expectType<Filter<[1, '2', 3, false] | ['1', 2, '3', true], number>>({} as [1, 3] | [2]);
expectType<Filter<[1, '2', 3, false] | ['1', 2, '3', true], string>>({} as ['2'] | ['1', '3']);
expectType<Filter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], string>>({} as string[] | Array<'foo'>);
expectType<Filter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], number>>({} as [number?]);

// Loose filtering by boolean or number
expectType<Filter<[true, 0, 1, false, 'no'], boolean | number>>([true, 0, 1, false]);

// Filtering array containing null | undefined | string
expectType<Filter<[null, undefined, 'foo', ''], string>>(['foo', '']);

// Filtering with unknown type (should keep everything)
expectType<Filter<[1, 'a', true], unknown>>([1, 'a', true]);

// Filtering with any type (should keep everything)
expectType<Filter<[1, 'a', true], any>>([1, 'a', true]);

// Filtering with never type (should remove everything)
expectType<Filter<[1, 2, 3], never>>([]);

// Filtering array of arrays by array type
expectType<Filter<[[number], string[], number[]], number[]>>([[1], [2, 3]]);

// Filtering by a union including literal and broader type
expectType<Filter<[1, 2, 3, 'foo', 'bar'], 1 | string>>([1, 'foo', 'bar']);

// Filtering complex nested union types
expectType<Filter<[ {x: 'a'}, {y: 2}, null, {z: true} ], Object3>>([{x: 'a'}, {y: 2}, null]);

// Filtering with boolean type but array has no boolean values
expectType<Filter<[1, 2, 3], Boolean>>([1, 2, 3]);

// Filtering with boolean type but array has falsy values
expectType<Filter<[0, '', false, null, undefined], Boolean>>([]);

// Filtering string literals with template literal union
expectType<Filter<['foo1', 'bar2', 'fooo', 'foo3'], `foo${number}`>>(['foo1', 'foo3']);

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
expectType<Filter<[typeof Class, {}, null, undefined], Boolean>>([Class, {}]);

// Filtering with strict = true and union including literals and primitives
expectType<Filter<[1, '1', 2, '2', true, false], number | `${number}`, {strict: true}>>([1, '1', 2, '2']);

// Filtering falsy values mixed with ({} | [] is truthy)
expectType<Filter<[false, 0, '', null, undefined, {}, []], Boolean>>([{}, []]);

// Filtering with `true` literal (strict) but array contains boolean and number
expectType<Filter<[true, false, 1, 0], true, {strict: true}>>([true]);

// Filtering empty string literal type with strict mode
expectType<Filter<['', 'non-empty'], '', {strict: true}>>(['']);

// Filtering with loose mode for literal union type and matching subset
expectType<Filter<[1, 2, 3, 4, 5], 2 | 3>>([2, 3]);

// Edge cases
expectType<Filter<any, never>>({} as any); // Should it return `any`
expectType<Filter<any[], never>>({} as any[]);
expectType<Filter<never, any>>({} as never);
expectType<Filter<never, never>>({} as never);

expectType<Filter<[], number>>([]);
expectType<Filter<[never, never], number>>([]);
expectType<Filter<[never, never], never>>([]);
expectType<Filter<[never, never], never, {strict: true}>>({} as [never, never]);

// Object tests

// Loose filtering
expectType<Filter<{a: 1; b: 2; c: 3 | 4; d: 3; e: 4}, 3>>({} as {c: 3 | 4; d: 3});
expectType<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: boolean}, number>>({a: 1, c: 3});
expectType<Filter<{a: 1; b: '2'; c: 3 | 'bar'; d: 'foo'; e: false}, string>>({} as {b: '2'; c: 3 | 'bar'; d: 'foo'});
expectType<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number>>({a: 1, b: '2', c: 3, d: 'foo'});
expectType<Filter<{a: 'foo'; b: 'baz'; c: 'foo'; d: 'foo' | 'bar'}, 'foo'>>({} as {a: 'foo'; c: 'foo'; d: 'foo' | 'bar'});
expectType<Filter<{a: '1'; b: '2'; c: 3; d: 4; e: 'foo'}, `${number}`>>({a: '1', b: '2'});
expectType<Filter<{a: true; b: false; c: boolean | 'bar'; d: 0; e: 1}, boolean>>({} as {a: true; b: false; c: boolean | 'bar'});
expectType<Filter<{a: true; b: false; c: true; d: 0; e: 1}, true>>({a: true, c: true});

// Strict filtering
expectType<Filter<{a: 1; b: 2; c: 3 | 4; d: 3; e: 4}, 3, {strict: true}>>({d: 3});
expectType<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: boolean}, number, {strict: true}>>({a: 1, c: 3});
expectType<Filter<{a: 1; b: '2'; c: 3 | 'bar'; d: 'foo'; e: false}, string, {strict: true}>>({b: '2', d: 'foo'});
expectType<Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number, {strict: true}>>({a: 1, b: '2', c: 3, d: 'foo'});
expectType<Filter<{a: 'foo'; b: 'baz'; c: 'foo'; d: 'foo' | 'bar'}, 'foo', {strict: true}>>({} as {a: 'foo'; c: 'foo'});
expectType<Filter<{a: '1'; b: '2'; c: 3; d: 4; e: 'foo'}, `${number}`, {strict: true}>>({a: '1', b: '2'});
expectType<Filter<{a: true; b: false; c: boolean | 'bar'; d: 0; e: 1}, boolean, {strict: true}>>({} as {a: true; b: false});
expectType<Filter<{a: true; b: false; c: true; d: 0; e: 1}, true, {strict: true}>>({a: true, c: true});

// Index signatures
expectType<Filter<{[a: string]: number | string; b: 1}, 1 | string>>({} as {[x: string]: string | number; b: 1});
expectType<Filter<{[a: string]: number | string; b: 1}, 1 | string, {strict: true}>>({} as {b: 1});
expectType<Filter<{[a: string]: number; [b: symbol]: string}, string>>({} as {[b: symbol]: string});
expectType<Filter<{[a: string]: number; [b: symbol]: string; c: 5}, number>>({} as {[a: string]: number; c: 5});

// Optional elements
expectType<Filter<{a?: 'f'; b: 's'; c: undefined}, undefined>>({} as {a?: 'f'; c: undefined});
expectType<Filter<{a?: 'f'; b: 's'; c: undefined}, undefined, {strict: true}>>({c: undefined});
expectType<Filter<{a?: 'f'; b: 's'; c: 5}, string>>({} as {a?: 'f'; b: 's'});
expectType<Filter<{a?: 'f'; b: 's'; c: 5}, string, {strict: true}>>({} as {b: 's'});

// Readonly properties (verifies readonly modifiers are preserved)
expectType<Filter<{readonly a: 1; b: 2; readonly c: 3}, number>>({} as {readonly a: 1; b: 2; readonly c: 3});
expectType<Filter<{readonly a: string; b: number; readonly c: boolean}, string>>({} as {readonly a: string});
expectType<Filter<{readonly a?: string; b?: number; c: boolean}, string>>({} as {readonly a?: string});

// Filtering Boolean (keep truthy values)
expectType<Filter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean>>({a: true, e: 1});
expectType<Filter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean, {strict: true}>>({a: true, e: 1});
expectType<Filter<{a: 0; b: ''; c: false; d: null; e: undefined; f: 'ok'; g: 42}, Boolean>>({f: 'ok', g: 42});
expectType<Filter<{a: true; b: false; c: 0; d: 1; e: ''; f: 'text'; g: null; h: undefined}, Boolean>>({a: true, d: 1, f: 'text'});

// Filtering objects
expectType<Filter<{a: Object1; b: Object2; c: Object1 & Object2}, Object1>>({} as {a: Object1; c: Object1 & Object2});
expectType<Filter<{a: Object1; b: Object2; c: Object1 & Object2}, Object1, {strict: true}>>({} as {a: Object1; c: Object1 & Object2});

// Union
expectType<Filter<{a: 1; b: '2'; c: 3; d: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, number>>({} as {a: 1; c: 3} | {b2: 2});
expectType<Filter<{a: 1; b: '2'; c: 3; d: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, string>>({} as {b: '2'} | {b1: '1'; b3: '3'});

// Loose filtering by boolean or number
expectType<Filter<{a: true; b: 0; c: 1; d: false; e: 'no'}, boolean | number>>({a: true, b: 0, c: 1, d: false});

// Filtering object containing null | undefined | string
expectType<Filter<{a: null; b: undefined; c: 'foo'; d: ''}, string>>({c: 'foo', d: ''});

// Filtering with unknown type (should keep everything)
expectType<Filter<{a: 1; b: 'a'; c: true}, unknown>>({a: 1, b: 'a', c: true});

// Filtering with any type (should keep everything)
expectType<Filter<{a: 1; b: 'a'; c: true}, any>>({a: 1, b: 'a', c: true});

// Filtering with never type (should remove everything)
expectType<Filter<{a: 1; b: 2; c: 3}, never>>({});

// Filtering object of arrays by array type
expectType<Filter<{a: number[]; b: string[]; c: number[]}, number[]>>({a: [1], c: [2, 3]});

// Filtering by a union including literal and broader type
expectType<Filter<{a: 1; b: 2; c: 3; d: 'foo'; e: 'bar'}, 1 | string>>({a: 1, d: 'foo', e: 'bar'});

// Filtering complex nested union types
expectType<Filter<{a: {x: 'a'}; b: {y: 2}; c: null; d: {z: true}}, Object3>>({a: {x: 'a'}, b: {y: 2}, c: null});

// Filtering with boolean type but object has no boolean values
expectType<Filter<{a: 1; b: 2; c: 3}, Boolean>>({a: 1, b: 2, c: 3});

// Filtering with boolean type but object has falsy values
expectType<Filter<{a: 0; b: ''; c: false; d: null; e: undefined}, Boolean>>({});

// Filtering string literals with template literal union
expectType<Filter<{a: 'foo1'; b: 'bar2'; c: 'fooo'; d: 'foo3'}, `foo${number}`>>({a: 'foo1', d: 'foo3'});

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
expectType<Filter<{a: typeof Class; b: {}; c: null; d: undefined}, Boolean>>({a: Class, b: {}});

// Filtering with strict = true and union including literals and primitives
expectType<Filter<{a: 1; b: '1'; c: 2; d: '2'; e: true; f: false}, number | `${number}`, {strict: true}>>({a: 1, b: '1', c: 2, d: '2'});

// Filtering falsy values mixed with truthy objects
expectType<Filter<{a: false; b: 0; c: ''; d: null; e: undefined; f: {}; g: []}, Boolean>>({f: {}, g: []});

// Filtering with `true` literal (strict) but object contains boolean and number
expectType<Filter<{a: true; b: false; c: 1; d: 0}, true, {strict: true}>>({a: true});

// Filtering empty string literal type with strict mode
expectType<Filter<{a: ''; b: 'non-empty'}, '', {strict: true}>>({a: ''});

// Filtering with loose mode for literal union type and matching subset
expectType<Filter<{a: 1; b: 2; c: 3; d: 4; e: 5}, 2 | 3>>({b: 2, c: 3});

// Edge cases
expectType<Filter<any, never>>({} as any);
expectType<Filter<never, any>>({} as never);
expectType<Filter<never, never>>({} as never);

expectType<Filter<{}, number>>({});
expectType<Filter<{a: never; b: never}, number>>({});
expectType<Filter<{a: never; b: never}, never>>({});
expectType<Filter<{a: never; b: never}, never, {strict: true}>>({} as {a: never; b: never});
