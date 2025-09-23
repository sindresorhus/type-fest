import {expectType} from 'tsd';
import type {ObjectFilter} from '../source/object-filter.d.ts';

// Loose filtering
expectType<ObjectFilter<{a1: 1; a2: 2; a3: 3 | 4; a4: 3; a5: 4}, 3>>({} as {a3: 3 | 4; a4: 3});
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3; a4: 'foo'; a5: boolean}, number>>({a1: 1, a3: 3});
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3 | 'bar'; a4: 'foo'; a5: false}, string>>({} as {a2: '2'; a3: 3 | 'bar'; a4: 'foo'});
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3; a4: 'foo'; a5: false}, string | number>>({a1: 1, a2: '2', a3: 3, a4: 'foo'});
expectType<ObjectFilter<{a1: 'foo'; a2: 'baz'; a3: 'foo'; a4: 'foo' | 'bar'}, 'foo'>>({} as {a1: 'foo'; a3: 'foo'; a4: 'foo' | 'bar'});
expectType<ObjectFilter<{a1: '1'; a2: '2'; a3: 3; a4: 4; a5: 'foo'}, `${number}`>>({a1: '1', a2: '2'});
expectType<ObjectFilter<{a1: true; a2: false; a3: boolean | 'bar'; a4: 0; a5: 1}, boolean>>({} as {a1: true; a2: false; a3: boolean | 'bar'});
expectType<ObjectFilter<{a1: true; a2: false; a3: true; a4: 0; a5: 1}, true>>({a1: true, a3: true});

// Strict filtering
expectType<ObjectFilter<{a1: 1; a2: 2; a3: 3 | 4; a4: 3; a5: 4}, 3, {strict: true}>>({a4: 3});
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3; a4: 'foo'; a5: boolean}, number, {strict: true}>>({a1: 1, a3: 3});
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3 | 'bar'; a4: 'foo'; a5: false}, string, {strict: true}>>({a2: '2', a4: 'foo'});
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3; a4: 'foo'; a5: false}, string | number, {strict: true}>>({a1: 1, a2: '2', a3: 3, a4: 'foo'});
expectType<ObjectFilter<{a1: 'foo'; a2: 'baz'; a3: 'foo'; a4: 'foo' | 'bar'}, 'foo', {strict: true}>>({} as {a1: 'foo'; a3: 'foo'});
expectType<ObjectFilter<{a1: '1'; a2: '2'; a3: 3; a4: 4; a5: 'foo'}, `${number}`, {strict: true}>>({a1: '1', a2: '2'});
expectType<ObjectFilter<{a1: true; a2: false; a3: boolean | 'bar'; a4: 0; a5: 1}, boolean, {strict: true}>>({} as {a1: true; a2: false});
expectType<ObjectFilter<{a1: true; a2: false; a3: true; a4: 0; a5: 1}, true, {strict: true}>>({a1: true, a3: true});

// Index signatures
expectType<ObjectFilter<{[a1: string]: number | string; a2: 1}, 1 | string>>({} as {[x: string]: string | number; a2: 1});
expectType<ObjectFilter<{[a1: string]: number | string; a2: 1}, 1 | string, {strict: true}>>({} as {a2: 1});
expectType<ObjectFilter<{[a1: string]: number; [a2: symbol]: string}, string>>({} as {[a2: symbol]: string});
expectType<ObjectFilter<{[a1: string]: number; [a2: symbol]: string; a3: 5}, number>>({} as {[a1: string]: number; a3: 5});

// Optional elements
expectType<ObjectFilter<{a1?: 'f'; a2: 's'; a3: undefined}, undefined>>({} as {a1?: 'f'; a3: undefined});
expectType<ObjectFilter<{a1?: 'f'; a2: 's'; a3: undefined}, undefined, {strict: true}>>({a3: undefined});
expectType<ObjectFilter<{a1?: 'f'; a2: 's'; a3: 5}, string>>({} as {a1?: 'f'; a2: 's'});
expectType<ObjectFilter<{a1?: 'f'; a2: 's'; a3: 5}, string, {strict: true}>>({} as {a2: 's'});

// Filtering Boolean (keep truthy values)
expectType<ObjectFilter<{a1: true; a2: false; a3: boolean; a4: 0; a5: 1}, Boolean>>({a1: true, a5: 1});
expectType<ObjectFilter<{a1: true; a2: false; a3: boolean; a4: 0; a5: 1}, Boolean, {strict: true}>>({a1: true, a5: 1});
expectType<ObjectFilter<{a1: 0; a2: ''; a3: false; a4: null; a5: undefined; a6: 'ok'; a7: 42}, Boolean>>({a6: 'ok', a7: 42});
expectType<ObjectFilter<{a1: true; a2: false; a3: 0; a4: 1; a5: ''; a6: 'text'; a7: null; a8: undefined}, Boolean>>({a1: true, a4: 1, a6: 'text'});

// Filtering objects
type Object1 = {a: number};
type Object2 = {b: string};
expectType<ObjectFilter<{a1: Object1; a2: Object2; a3: Object1 & Object2}, Object1>>({} as {a1: Object1; a3: Object1 & Object2});
expectType<ObjectFilter<{a1: Object1; a2: Object2; a3: Object1 & Object2}, Object1, {strict: true}>>({} as {a1: Object1; a3: Object1 & Object2});

// Loose filtering by boolean or number
expectType<ObjectFilter<{a1: true; a2: 0; a3: 1; a4: false; a5: 'no'}, boolean | number>>({a1: true, a2: 0, a3: 1, a4: false});

// Filtering object containing null | undefined | string
expectType<ObjectFilter<{a1: null; a2: undefined; a3: 'foo'; a4: ''}, string>>({a3: 'foo', a4: ''});

// Filtering with unknown type (should keep everything)
expectType<ObjectFilter<{a1: 1; a2: 'a'; a3: true}, unknown>>({a1: 1, a2: 'a', a3: true});

// Filtering with any type (should keep everything)
expectType<ObjectFilter<{a1: 1; a2: 'a'; a3: true}, any>>({a1: 1, a2: 'a', a3: true});

// Filtering with never type (should remove everything)
expectType<ObjectFilter<{a1: 1; a2: 2; a3: 3}, never>>({});

// Filtering object of arrays by array type
expectType<ObjectFilter<{a1: number[]; a2: string[]; a3: number[]}, number[]>>({a1: [1], a3: [2, 3]});

// Filtering by a union including literal and broader type
expectType<ObjectFilter<{a1: 1; a2: 2; a3: 3; a4: 'foo'; a5: 'bar'}, 1 | string>>({a1: 1, a4: 'foo', a5: 'bar'});

// Filtering complex nested union types
type Nested = {x: string} | {y: number} | null;
expectType<ObjectFilter<{a1: {x: 'a'}; a2: {y: 2}; a3: null; a4: {z: true}}, Nested>>({a1: {x: 'a'}, a2: {y: 2}, a3: null});

// Filtering with boolean type but object has no boolean values
expectType<ObjectFilter<{a1: 1; a2: 2; a3: 3}, Boolean>>({a1: 1, a2: 2, a3: 3});

// Filtering with boolean type but object has falsy values
expectType<ObjectFilter<{a1: 0; a2: ''; a3: false; a4: null; a5: undefined}, Boolean>>({});

// Filtering string literals with template literal union
expectType<ObjectFilter<{a1: 'foo1'; a2: 'bar2'; a3: 'fooo'; a4: 'foo3'}, `foo${number}`>>({a1: 'foo1', a4: 'foo3'});

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
class Foo {}
expectType<ObjectFilter<{a1: typeof Foo; a2: {}; a3: null; a4: undefined}, Boolean>>({a1: Foo, a2: {}});

// Filtering with strict = true and union including literals and primitives
expectType<ObjectFilter<{a1: 1; a2: '1'; a3: 2; a4: '2'; a5: true; a6: false}, number | `${number}`, {strict: true}>>({a1: 1, a2: '1', a3: 2, a4: '2'});

// Filtering falsy values mixed with truthy objects
expectType<ObjectFilter<{a1: false; a2: 0; a3: ''; a4: null; a5: undefined; a6: {}; a7: []}, Boolean>>({a6: {}, a7: []});

// Filtering with `true` literal (strict) but object contains boolean and number
expectType<ObjectFilter<{a1: true; a2: false; a3: 1; a4: 0}, true, {strict: true}>>({a1: true});

// Filtering empty string literal type with strict mode
expectType<ObjectFilter<{a1: ''; a2: 'non-empty'}, '', {strict: true}>>({a1: ''});

// Filtering with loose mode for literal union type and matching subset
expectType<ObjectFilter<{a1: 1; a2: 2; a3: 3; a4: 4; a5: 5}, 2 | 3>>({a2: 2, a3: 3});

// Union
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3; a4: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, number>>({} as {a1: 1; a3: 3} | {b2: 2});
expectType<ObjectFilter<{a1: 1; a2: '2'; a3: 3; a4: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, string>>({} as {a2: '2'} | {b1: '1'; b3: '3'});

// Edge cases
expectType<ObjectFilter<any, never>>({});
expectType<ObjectFilter<never, any>>({} as never);
expectType<ObjectFilter<never, never>>({} as never);

expectType<ObjectFilter<{}, number>>({});
expectType<ObjectFilter<{a1: never; a2: never}, number>>({});
expectType<ObjectFilter<{a1: never; a2: never}, never>>({});
expectType<ObjectFilter<{a1: never; a2: never}, never, {strict: true}>>({} as {a1: never; a2: never});
